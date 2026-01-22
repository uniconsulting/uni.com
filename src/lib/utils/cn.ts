export const cn = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");
