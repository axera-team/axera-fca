# Appstate Secure Vault Storage

```ts
import { Cookie } from 'tough-cookie';
import { PinVault } from "./vault";

type AppState = Cookie.Serialized[];

async function main() {
  const vault = new PinVault({
    // optional overrides:
    // vaultPath: "./my-vault.json",
    // scryptN: 2 ** 14, // lower for dev/testing (faster)
    // maxAttempts: 3,
  });

  // --- First run: initialize ---
  if (!vault.exists) {
    const appstate: AppState = [{}, {}, ...]
    await vault.init(appstate);
    // ^ prompts: "Set vault PIN: ••••" + "Confirm PIN: ••••"
    // vault is now unlocked after init
  } else {
    // --- Subsequent runs ---
    await vault.unlock();
    // ^ tries keychain silently first
    // falls back to: "Enter vault PIN: ••••"
  }

  // Read appstate
  const state = vault.read<AppState>();
  console.log("Loaded userId:", state[0].user);

  // Use cookies for requests...
  // await fbClient.login(state);

  // Update appstate (e.g. after cookie refresh)
  vault.write({ ...state, cookies: "datr=newcookie; ..." });

  // Optional: lock when done
  // await vault.lock();

  // Optional: change PIN
  // await vault.changePIN();
}

main().catch(console.error);
```
