"use client";

import React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { PKG_MANAGER_COOKIE } from "./pkg-commands";

export function PackageManagersTabs({
  labels,
  defaultValue = 0,
  children,
}: {
  labels: string[];
  defaultValue?: number;
  children: React.ReactNode;
}) {
  const panels = React.Children.toArray(children);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    function onSync(e: Event) {
      const idx = labels.indexOf((e as CustomEvent<string>).detail);
      if (idx !== -1) setValue(idx);
    }
    window.addEventListener(PKG_MANAGER_COOKIE, onSync);
    return () => window.removeEventListener(PKG_MANAGER_COOKIE, onSync);
  }, [labels]);

  function handleChange(newValue: number | string) {
    const idx = typeof newValue === "number" ? newValue : Number(newValue);
    setValue(idx);
    const label = labels[idx];
    document.cookie = `${PKG_MANAGER_COOKIE}=${label};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(PKG_MANAGER_COOKIE, { detail: label }));
  }

  return (
    <div className="not-prose my-4">
      <Tabs.Root value={value} onValueChange={handleChange}>
        <Tabs.List className="relative flex" aria-label="Package manager">
          {labels.map((label, i) => (
            <Tabs.Tab
              key={label}
              value={i}
              className="cursor-pointer border-none bg-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200 data-[active]:text-zinc-100"
            >
              {label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-brand-orange transition-[translate,width] duration-200 ease-in-out" />
        </Tabs.List>
        {panels.map((panel, i) => (
          <Tabs.Panel
            key={labels[i]}
            value={i}
            className="[&>.expressive-code]:mt-0"
          >
            {panel}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
