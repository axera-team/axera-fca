/*
 * [utils/logging.js] - Responsible for the colorful logging to the console. :>
 */
import chalk from "chalk";
import gradient, { fruit } from "gradient-string";
const makeGradient = gradient(["#0061ff", "#681297"]);
const ws = fruit("Qyber-Fca");

const logger: { log: (...args: any[]) => void, error: (...args: any[]) => void, warn: (...args: any[]) => void } = {
  log: (...args) => {
      console.log(ws, chalk.green.bold("[LOG]"), ...args);
  },
  error: (...args) => {
      console.error(ws, chalk.red.bold("[ERROR]"), ...args);
  },
  warn: (...args) => {
      console.warn(ws, chalk.yellow.bold("[WARNING]"), ...args);
  },
};

export const Logger = Object.freeze(logger);