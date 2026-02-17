import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";
import path from "path";
import {
  ecThemeName,
  ecPlugins,
  ecDefaultProps,
} from "./src/expressive-code.config";

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
        rehypeMdxImportMedia,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor-link"],
              ariaHidden: true,
              tabIndex: -1,
            },
            content: {
              type: "element",
              tagName: "span",
              properties: { className: ["heading-anchor"] },
              children: [{ type: "text", value: "#" }],
            },
          },
        ],
        [
          rehypeExpressiveCode,
          {
            themes: [ecThemeName],
            plugins: ecPlugins(),
            defaultProps: ecDefaultProps,
          },
        ],
      ],
    }),
    contentCollections(),
  ],
});
