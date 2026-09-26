const color = (code: number) => (s: string) => (process.stdout.isTTY && !process.env.NO_COLOR ? `\x1b[${code}m${s}\x1b[0m` : s);
export const green = color(32);
export const yellow = color(33);
export const red = color(31);
export const dim = color(2);
export const bold = color(1);

export const log = {
  info: (msg: string) => console.log(msg),
  success: (msg: string) => console.log(`${green("✔")} ${msg}`),
  warn: (msg: string) => console.log(`${yellow("!")} ${msg}`),
  error: (msg: string) => console.error(`${red("✖")} ${msg}`),
};
