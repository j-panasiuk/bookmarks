import chalk from "chalk";

export const log: typeof console.info = (...args) =>
  console.log(chalk.gray(">"), ...args);

export const logWarning: typeof console.warn = (...args) =>
  console.log(chalk.yellowBright("✗"), ...args);

export const logError: typeof console.error = (...args) =>
  console.log(chalk.redBright("✗"), ...args);

export const logSuccess: typeof console.log = (...args) =>
  console.log(chalk.greenBright("✔"), ...args);
