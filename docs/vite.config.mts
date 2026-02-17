import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeExpressiveCode from "rehype-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@astrojs/starlight/components": path.resolve(
        "src/app/components/mdx/index.tsx",
      ),
      "starlight-package-managers": path.resolve(
        "src/app/components/mdx/index.tsx",
      ),
      "astro-embed": path.resolve("src/app/components/mdx/index.tsx"),
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood(),
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [
          rehypeExpressiveCode,
          {
            themes: ["github-dark-default"],
            plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
            defaultProps: {
              showLineNumbers: true,
            },
          },
        ],
      ],
    }),
    contentCollections(),
  ],
});
