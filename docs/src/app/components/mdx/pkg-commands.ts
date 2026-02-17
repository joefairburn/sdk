// Adapted from https://github.com/HiDeoo/starlight-package-managers/blob/main/packages/starlight-package-managers/pkg.ts
const pkgManagerNames = ["npm", "yarn", "pnpm", "bun", "deno", "ni"] as const;
export type PackageManager = (typeof pkgManagerNames)[number];

export type CommandType =
  | "add"
  | "create"
  | "dlx"
  | "exec"
  | "install"
  | "remove"
  | "run";

const commands: Record<PackageManager, Record<string, string>> = {
  npm: {
    add: "npm i",
    create: "npm create",
    devOption: "-D",
    dlx: "npx",
    exec: "npx",
    install: "npm install",
    run: "npm run",
    remove: "npm uninstall",
  },
  yarn: {
    add: "yarn add",
    create: "yarn create",
    devOption: "-D",
    dlx: "yarn dlx",
    exec: "yarn",
    install: "yarn install",
    run: "yarn run",
    remove: "yarn remove",
  },
  pnpm: {
    add: "pnpm add",
    create: "pnpm create",
    devOption: "-D",
    dlx: "pnpx",
    exec: "pnpm",
    install: "pnpm install",
    run: "pnpm run",
    remove: "pnpm remove",
  },
  bun: {
    add: "bun add",
    create: "bun create",
    devOption: "-d",
    dlx: "bunx",
    exec: "bunx",
    install: "bun install",
    run: "bun run",
    remove: "bun remove",
  },
  deno: {
    add: "deno add",
    devOption: "-D",
    dlx: "deno x",
    exec: "deno x",
    install: "deno install",
    run: "deno task",
    remove: "deno remove",
  },
  ni: {
    add: "ni",
    devOption: "-D",
    dlx: "nlx",
    exec: "nlx",
    install: "ni",
    run: "nr",
    remove: "nun",
  },
};

export const defaultPkgManagers: PackageManager[] = ["npm", "pnpm", "yarn"];

export function getCommand(
  pkgManager: PackageManager,
  type: CommandType,
  pkg: string | undefined,
  options: { args?: string; comment?: string; dev?: boolean; prefix?: string } = {},
): string {
  let command = commands[pkgManager][type];
  if (!command) return "";

  if (options.prefix) command = `${options.prefix} ${command}`;
  if (options.comment)
    command = `# ${options.comment.replaceAll("{PKG}", pkgManager)}\n${command}`;
  if (type === "add" && options.dev)
    command += ` ${commands[pkgManager].devOption}`;

  if (pkg) {
    const processedPkg =
      type === "create" && pkgManager === "yarn"
        ? pkg.replace(/@[^\s]+/, "")
        : pkg;
    command += ` ${processedPkg}`;
  }

  if (options.args && options.args.length > 0) {
    if (
      pkgManager === "npm" &&
      type !== "dlx" &&
      type !== "exec" &&
      type !== "run"
    ) {
      command += " --";
    }
    command += ` ${options.args}`;
  }

  return command;
}
