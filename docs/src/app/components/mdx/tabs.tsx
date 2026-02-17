import React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";

export function TabItem({
  label: _label,
  children,
}: {
  label: string;
  icon?: string;
  children?: React.ReactNode;
}) {
  return <>{children}</>;
}

export function Tabs({
  children,
}: {
  children?: React.ReactNode;
  syncKey?: string;
}) {
  const items: { label: string; content: React.ReactNode }[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ label: string; children?: React.ReactNode }>(child) && child.props.label) {
      items.push({ label: child.props.label, content: child.props.children });
    }
  });

  if (items.length === 0) return null;

  return (
    <BaseTabs.Root defaultValue={0} className="not-prose my-4">
      <BaseTabs.List className="relative flex" aria-label="Tabs">
        {items.map((item, i) => (
          <BaseTabs.Tab
            key={i}
            value={i}
            className="cursor-pointer border-none bg-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200 data-[active]:text-zinc-100"
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-brand-orange transition-[translate,width] duration-200 ease-in-out" />
      </BaseTabs.List>
      {items.map((item, i) => (
        <BaseTabs.Panel
          key={i}
          value={i}
          className="[&>.expressive-code]:mt-0"
        >
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
