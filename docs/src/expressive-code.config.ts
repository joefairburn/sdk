import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

export const ecThemeName = "github-dark-default" as const;

export const ecPlugins = () => [
  pluginLineNumbers(),
  pluginCollapsibleSections(),
];

export const ecDefaultProps = {
  showLineNumbers: true,
  overridesByLang: {
    "bash,sh,shell,zsh,bat,batch,cmd,console,powershell,ps,ps1,shellscript,shellsession,ansi":
      {
        showLineNumbers: false,
      },
  },
};
