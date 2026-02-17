import clsx from "clsx";
import { Info, Rocket, TriangleAlert, OctagonAlert, type LucideIcon } from "lucide-react";

const asideVariants = ["note", "tip", "caution", "danger"] as const;
type AsideVariant = (typeof asideVariants)[number];

const defaultTitles: Record<AsideVariant, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};

const variantStyles: Record<AsideVariant, { bg: string; border: string; title: string }> = {
  note: {
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    title: "text-blue-400",
  },
  tip: {
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    title: "text-purple-400",
  },
  caution: {
    bg: "bg-amber-500/10",
    border: "border-amber-500",
    title: "text-amber-400",
  },
  danger: {
    bg: "bg-red-500/10",
    border: "border-red-500",
    title: "text-red-400",
  },
};

const icons: Record<AsideVariant, LucideIcon> = {
  note: Info,
  tip: Rocket,
  caution: TriangleAlert,
  danger: OctagonAlert,
};

export function Aside({
  type = "note",
  title,
  children,
}: {
  type?: AsideVariant;
  title?: string;
  children?: React.ReactNode;
}) {
  const resolvedTitle = title || defaultTitles[type];
  const styles = variantStyles[type];
  const Icon = icons[type];

  return (
    <aside
      aria-label={resolvedTitle}
      className={clsx(
        "not-prose my-4 rounded-r-lg border-l-2 py-3 pl-4 pr-4",
        styles.border,
        styles.bg,
      )}
    >
      <p
        className={clsx("mb-2 flex items-center gap-1.5 font-semibold", styles.title)}
        aria-hidden="true"
      >
        <Icon size={16} className={clsx("shrink-0", styles.title)} />
        {resolvedTitle}
      </p>
      <div className="space-y-1.5 text-sm text-zinc-300">
        {children}
      </div>
    </aside>
  );
}
