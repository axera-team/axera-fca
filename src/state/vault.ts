import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

// --- optional keytar (graceful fallback if not installed) ---
let keytar: typeof import("keytar") | null = null;
try {
  keytar = require("keytar");
} catch {
  // keytar not available, PIN will be prompted every run
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface VaultFile {
  salt: string;       // hex, 32 bytes
  sentinel: string;   // encrypted known value — used to verify PIN
  data: string;       // encrypted appstate payload
}

interface EncryptedBlob {
  iv: string;
  tag: string;
  ct: string;
}

export interface VaultOptions {
  /** Path to the JSON vault file. Default: ~/.axera-fca/vault.json */
  vaultPath?: string;
  /** Keychain service name. Default: "axera-fca" */
  keychainService?: string;
  /** Keychain account name. Default: "vault-key" */
  keychainAccount?: string;
  /** Max PIN attempts before lockout. Default: 5 */
  maxAttempts?: number;
  /**
   * scrypt N factor (cost). Higher = slower = more brute-force resistant.
   * Default: 2^17 (~1-2s on modern hardware). Lower for testing (e.g. 2^14).
   */
  scryptN?: number;
}

const SENTINEL_VALUE = "axera-fca-vault-v1-ok";
const ALGO = "aes-256-gcm" as const;

// ----------------------------------------------------------------
// Crypto helpers
// ----------------------------------------------------------------

function encrypt(plaintext: string, key: Buffer): EncryptedBlob {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ct: ct.toString("base64"),
  };
}

function decrypt(blob: EncryptedBlob, key: Buffer): string {
  const iv = Buffer.from(blob.iv, "base64");
  const tag = Buffer.from(blob.tag, "base64");
  const ct = Buffer.from(blob.ct, "base64");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ct).toString("utf8") + decipher.final("utf8");
}

function blobToString(blob: EncryptedBlob): string {
  return JSON.stringify(blob);
}

function stringToBlob(s: string): EncryptedBlob {
  return JSON.parse(s) as EncryptedBlob;
}

// ----------------------------------------------------------------
// Key derivation
// ----------------------------------------------------------------

function deriveKey(pin: string, salt: Buffer, N: number): Buffer {
  // scrypt: expensive enough to make offline brute-force painful
  return scryptSync(pin, salt, 32, { N, r: 8, p: 1 }) as Buffer;
}

// ----------------------------------------------------------------
// PIN prompt (hidden input)
// ----------------------------------------------------------------

function promptPin(message: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(message);

    const { stdin, stdout } = process;
    let pin = "";

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (ch: string) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(pin);
      } else if (ch === "\u0003") {
        // Ctrl+C
        stdout.write("\n");
        process.exit(0);
      } else if (ch === "\u007f") {
        // Backspace
        if (pin.length > 0) {
          pin = pin.slice(0, -1);
          stdout.write("\b \b");
        }
      } else {
        pin += ch;
        stdout.write("•");
      }
    };

    stdin.on("data", onData);
  });
}

// ----------------------------------------------------------------
// PinVault
// ----------------------------------------------------------------

export class PinVault {
  private readonly vaultPath: string;
  private readonly keychainService: string;
  private readonly keychainAccount: string;
  private readonly maxAttempts: number;
  private readonly scryptN: number;

  #key: Buffer | null = null;
  #attempts = 0;

  constructor(opts: VaultOptions = {}) {
    const home = process.env.HOME ?? process.env.USERPROFILE ?? ".";
    this.vaultPath = opts.vaultPath ?? `${home}/.axera-fca/vault.json`;
    this.keychainService = opts.keychainService ?? "axera-fca";
    this.keychainAccount = opts.keychainAccount ?? "vault-key";
    this.maxAttempts = opts.maxAttempts ?? 5;
    this.scryptN = opts.scryptN ?? 2 ** 15;
  }

  // --- public API ---

  /** Returns true if a vault file already exists on disk. */
  get exists(): boolean {
    return existsSync(this.vaultPath);
  }

  /** Returns true if the vault is currently unlocked. */
  get isUnlocked(): boolean {
    return this.#key !== null;
  }

  /**
   * Unlock the vault.
   * - Tries OS keychain first (silent, no prompt).
   * - Falls back to PIN prompt if keychain misses.
   * - On success, caches derived key in keychain for this OS session.
   */
  async unlock(): Promise<void> {
    if (this.#key) return; // already unlocked

    if (!this.exists) {
      throw new Error(
        "No vault found. Call vault.init() first to set a PIN and store your appstate."
      );
    }

    // 1. Try keychain (silent)
    if (keytar) {
      const cached = await keytar.getPassword(
        this.keychainService,
        this.keychainAccount
      );
      if (cached) {
        const key = Buffer.from(cached, "hex");
        if (this.#verifySentinel(key)) {
          this.#key = key;
          console.log("🔓 Vault unlocked (keychain).");
          return;
        }
        // Stale/wrong entry — clear it
        await keytar.deletePassword(this.keychainService, this.keychainAccount);
      }
    }

    // 2. PIN prompt loop
    while (this.#attempts < this.maxAttempts) {
      const pin = await promptPin("🔐 Enter vault PIN: ");
      const key = this.#deriveFromPin(pin);

      if (this.#verifySentinel(key)) {
        this.#key = key;
        this.#attempts = 0;

        // Cache in keychain for this OS session
        if (keytar) {
          await keytar.setPassword(
            this.keychainService,
            this.keychainAccount,
            key.toString("hex")
          );
        }

        console.log("🔓 Vault unlocked.");
        return;
      }

      this.#attempts++;
      const left = this.maxAttempts - this.#attempts;
      if (left > 0) {
        console.error(`❌ Wrong PIN. ${left} attempt${left === 1 ? "" : "s"} left.`);
      }
    }

    throw new Error(
      `Too many failed attempts. Delete ${this.vaultPath} to reset the vault.`
    );
  }

  /**
   * Initialize a new vault with a PIN and initial appstate.
   * Prompts for PIN + confirmation. Throws if vault already exists.
   */
  async init(appstate: unknown): Promise<void> {
    if (this.exists) {
      throw new Error(
        `Vault already exists at ${this.vaultPath}. Delete it to reinitialize.`
      );
    }

    let pin: string;
    while (true) {
      pin = await promptPin("🔑 Set vault PIN: ");
      const confirm = await promptPin("🔑 Confirm PIN: ");
      if (pin === confirm) break;
      console.error("❌ PINs don't match, try again.");
    }

    const salt = randomBytes(32);
    const key = deriveKey(pin, salt, this.scryptN);

    const sentinel = blobToString(encrypt(SENTINEL_VALUE, key));
    const data = blobToString(encrypt(JSON.stringify(appstate), key));

    const vaultFile: VaultFile = {
      salt: salt.toString("base64"),
      sentinel,
      data,
    };

    this.#writeVault(vaultFile);
    this.#key = key;

    // Cache in keychain
    if (keytar) {
      await keytar.setPassword(
        this.keychainService,
        this.keychainAccount,
        key.toString("hex")
      );
    }

    console.log(`✅ Vault created at ${this.vaultPath}`);
  }

  /**
   * Read the decrypted appstate. Vault must be unlocked.
   */
  read<T = unknown>(): T {
    this.#assertUnlocked();
    const { data } = this.#readVault();
    const plaintext = decrypt(stringToBlob(data), this.#key!);
    return JSON.parse(plaintext) as T;
  }

  /**
   * Overwrite the appstate. Vault must be unlocked.
   */
  write(appstate: unknown): void {
    this.#assertUnlocked();
    const vault = this.#readVault();
    vault.data = blobToString(encrypt(JSON.stringify(appstate), this.#key!));
    this.#writeVault(vault);
  }

  /**
   * Lock the vault — zeroes the in-memory key and clears keychain entry.
   */
  async lock(): Promise<void> {
    if (this.#key) {
      this.#key.fill(0);
      this.#key = null;
    }
    if (keytar) {
      await keytar
        .deletePassword(this.keychainService, this.keychainAccount)
        .catch(() => {});
    }
    console.log("🔒 Vault locked.");
  }

  /**
   * Change PIN. Vault must be unlocked.
   * Re-encrypts all data under the new key.
   */
  async changePIN(): Promise<void> {
    this.#assertUnlocked();

    // Read current data before re-keying
    const appstate = this.read();

    let newPin: string;
    while (true) {
      newPin = await promptPin("🔑 New PIN: ");
      const confirm = await promptPin("🔑 Confirm new PIN: ");
      if (newPin === confirm) break;
      console.error("❌ PINs don't match, try again.");
    }

    const salt = randomBytes(32);
    const newKey = deriveKey(newPin, salt, this.scryptN);

    const sentinel = blobToString(encrypt(SENTINEL_VALUE, newKey));
    const data = blobToString(encrypt(JSON.stringify(appstate), newKey));

    this.#writeVault({ salt: salt.toString("base64"), sentinel, data });

    // Swap key in memory
    this.#key!.fill(0);
    this.#key = newKey;

    if (keytar) {
      await keytar.setPassword(
        this.keychainService,
        this.keychainAccount,
        newKey.toString("hex")
      );
    }

    console.log("✅ PIN changed.");
  }

  // --- private helpers ---

  #assertUnlocked(): void {
    if (!this.#key) throw new Error("Vault is locked. Call vault.unlock() first.");
  }

  #deriveFromPin(pin: string): Buffer {
    const { salt } = this.#readVault();
    return deriveKey(pin, Buffer.from(salt, "base64"), this.scryptN);
  }

  #verifySentinel(key: Buffer): boolean {
    try {
      const { sentinel } = this.#readVault();
      const result = decrypt(stringToBlob(sentinel), key);
      return result === SENTINEL_VALUE;
    } catch {
      return false;
    }
  }

  #readVault(): VaultFile {
    return JSON.parse(readFileSync(this.vaultPath, "utf8")) as VaultFile;
  }

  #writeVault(vault: VaultFile): void {
    mkdirSync(dirname(this.vaultPath), { recursive: true });
    writeFileSync(this.vaultPath, JSON.stringify(vault, null, 2), {
      encoding: "utf8",
      mode: 0o600, // owner read/write only
    });
  }
}