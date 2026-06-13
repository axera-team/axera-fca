/*
 * [utils/logging.js] - Responsible for the colorful logging to the console. :>
 */

import pc from "picocolors";
import gradient from "gradient-string";

const LEVEL_COLORS = {
  INFO: pc.cyan,
  SUCCESS: pc.green,
  WARN: pc.yellow,
  ERROR: pc.red,
  DEBUG: pc.gray,
};

const LEVEL_SYMBOLS = {
  INFO: "ℹ️ ",
  SUCCESS: "✅",
  WARN: "⚠️ ",
  ERROR: "❌",
  DEBUG: "🐛",
};

const GRADIENTS = {
  sunset: gradient(['#ff0080', '#ff8c00', '#40e0d0']),
  ocean: gradient(['#00b4db', '#0083b0']),
  rainbow: gradient(['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']),
  fire: gradient(['#ff0000', '#ff8800', '#ffff00']),
  ice: gradient(['#00ffff', '#0088ff', '#0000ff']),
  forest: gradient(['#00ff00', '#00cc00', '#009900']),
  purple: gradient(['#9d00ff', '#ff00cc']),
  candy: gradient(['#ff6b6b', '#4ecdc4', '#45b7d1']),
};

export class Logger {
  static LEVELS = Object.keys(LEVEL_COLORS) as (keyof typeof LEVEL_COLORS)[];
  static COLORS = LEVEL_COLORS;
  static instance: Logger | null = null;

  scope?: string;
  scopeStyle: string | ((text: string) => string) | any;
  debugMode: boolean;

  constructor(options?: { scope?: string, color?: keyof typeof pc | keyof typeof GRADIENTS | ((text: string) => string), debugMode?: boolean }) {
    this.scope = options?.scope;
    this.debugMode = options?.debugMode || false;

    if (options?.color) {
      if (typeof options.color === 'function') {
        this.scopeStyle = options.color;
      } else if (GRADIENTS[options.color as keyof typeof GRADIENTS]) {
        this.scopeStyle = GRADIENTS[options.color as keyof typeof GRADIENTS];
      } else if (pc[options.color as keyof typeof pc]) {
        this.scopeStyle = pc[options.color as keyof typeof pc];
      }
    }
  }

  private format(level: string, message: string) {
    const time = new Date().toISOString();
    const color = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
    const symbol = LEVEL_SYMBOLS[level as keyof typeof LEVEL_SYMBOLS];
    const scopeText = this.scope ?? "APP";
    
    let coloredScope: string;
    if (typeof this.scopeStyle === 'function') {
      coloredScope = this.scopeStyle(scopeText);
    } else {
      coloredScope = pc.white(scopeText);
    }

    return `[${pc.gray(time)}] ${symbol} ${color(level)} ${coloredScope} → ${message}`;
  }

  info(message: string) {
    console.log(this.format("INFO", message));
  }

  warn(message: string) {
    console.warn(this.format("WARN", message));
  }

  success(message: string) {
    console.log(this.format("SUCCESS", message));
  }

  error(message: string, error?: Error) {
    console.error(this.format("ERROR", message));
    if (error) {
      console.error(error.stack);
    }
  }

  debug(message: string, meta?: unknown) {
    if (!this.debugMode) return;

    console.log(this.format("DEBUG", message));

    if (meta) {
      console.dir(meta, { depth: null });
    }
  }
};