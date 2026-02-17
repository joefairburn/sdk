import {
  ExpressiveCodeEngine,
  ExpressiveCodeTheme,
} from "@expressive-code/core";
import { toHtml } from "@expressive-code/core/hast";
import { pluginFrames } from "@expressive-code/plugin-frames";
import githubDarkDefault from "@shikijs/themes/github-dark-default";
import { ecPlugins, ecDefaultProps } from "@/expressive-code.config";

// Lazily-initialized singleton using the shared EC config.
// Uses @expressive-code/core directly (not the `expressive-code` wrapper) to avoid
// pulling in Shiki's WASM which Cloudflare Workers blocks.
let enginePromise: ReturnType<typeof createEngine> | null = null;

async function createEngine() {
  const theme = new ExpressiveCodeTheme(githubDarkDefault);

  return new ExpressiveCodeEngine({
    themes: [theme],
    plugins: [pluginFrames(), ...ecPlugins()],
    defaultProps: ecDefaultProps,
  });
}

function getEngine() {
  if (!enginePromise) {
    enginePromise = createEngine();
  }
  return enginePromise;
}

export async function Code({
  code,
  lang = "bash",
  title,
  frame,
}: {
  code: string;
  lang?: string;
  title?: string;
  frame?: "auto" | "terminal" | "code" | "none";
}) {
  const ec = await getEngine();

  const meta = [
    title ? `title="${title}"` : "",
    frame ? `frame="${frame}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const { renderedGroupAst, styles } = await ec.render({
    code,
    language: lang,
    meta,
  });

  const html = toHtml(renderedGroupAst);
  const css = [...styles].join("");

  return (
    <>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
