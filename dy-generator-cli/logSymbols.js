import { isUnicodeSupported } from "./utils.js";
import chalk from "chalk";
const main = {
  info: chalk.blue("ℹ"),
  success: chalk.green("✔"),
  warning: chalk.yellow("⚠"),
  error: chalk.red("✖"),
  arrow: chalk.yellow("➦"),
  star:chalk.cyan("✵")
};

const fallback = {
  info: chalk.blue("i"),
  success: chalk.green("√"),
  warning: chalk.yellow("‼"),
  error: chalk.red("×"),
  arrow: chalk.yellow("->"),
  star: chalk.cyan("*")
};

const logSymbols = isUnicodeSupported() ? main : fallback;

export default logSymbols;
