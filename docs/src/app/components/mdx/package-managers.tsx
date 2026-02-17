import { requestInfo } from "rwsdk/worker";
import { Code } from "./code";
import {
  PackageManagersTabs,
  PKG_MANAGER_COOKIE,
} from "./package-managers-tabs";
import {
  getCommand,
  defaultPkgManagers,
  type PackageManager,
  type CommandType,
} from "./pkg-commands";

function getPreferredManager(labels: string[]): number {
  const cookie = requestInfo.request.headers.get("Cookie");
  const match = cookie?.match(new RegExp(`${PKG_MANAGER_COOKIE}=([^;]+)`));
  if (match?.[1]) {
    const idx = labels.indexOf(match[1]);
    if (idx !== -1) return idx;
  }
  return 0;
}

export async function PackageManagers({
  pkg,
  type = "add",
  args,
  dev,
  comment,
  prefix,
  frame,
  title,
  pkgManagers: managers = defaultPkgManagers,
}: {
  pkg?: string;
  type?: CommandType;
  args?: string;
  dev?: boolean;
  comment?: string;
  prefix?: string;
  frame?: "auto" | "terminal" | "code" | "none";
  title?: string;
  pkgManagers?: PackageManager[];
  icons?: boolean;
}) {
  const entries = managers
    .map((pm) => ({
      name: pm,
      command: getCommand(pm, type, pkg, { args, dev, prefix, comment }),
    }))
    .filter((e) => e.command);

  if (entries.length <= 1) {
    return (
      <Code
        code={entries[0]?.command ?? ""}
        lang="bash"
        title={title}
        frame={frame}
      />
    );
  }

  const labels = entries.map((e) => e.name);
  const defaultValue = getPreferredManager(labels);

  return (
    <PackageManagersTabs labels={labels} defaultValue={defaultValue}>
      {entries.map((entry) => (
        <Code
          key={entry.name}
          code={entry.command}
          lang="bash"
          title={title}
          frame={frame}
        />
      ))}
    </PackageManagersTabs>
  );
}
