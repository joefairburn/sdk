import clsx from "clsx";

const variants = {
  default: "border-purple-500/50 bg-purple-500/20 text-purple-200",
  note: "border-blue-500/50 bg-blue-500/20 text-blue-200",
  tip: "border-green-500/50 bg-green-500/20 text-green-200",
  success: "border-green-500/50 bg-green-500/20 text-green-200",
  caution: "border-amber-500/50 bg-amber-500/20 text-amber-200",
  danger: "border-red-500/50 bg-red-500/20 text-red-200",
} as const;

const sizes = {
  small: "text-xs px-1 py-0.5",
  medium: "text-sm px-1.5 py-0.5",
  large: "text-base px-2 py-1",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function Badge({
  text,
  variant,
  type,
  size = "small",
}: {
  text: string;
  variant?: Variant;
  /** Alias for `variant` used in some MDX files */
  type?: Variant;
  size?: Size;
}) {
  const v = variant ?? type ?? "default";
  return (
    <span
      className={clsx(
        "inline-block rounded border font-mono leading-normal align-middle",
        variants[v],
        sizes[size],
      )}
    >
      {text}
    </span>
  );
}
