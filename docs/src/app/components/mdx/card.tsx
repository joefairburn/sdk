export function Card({
  title,
  children,
}: {
  title?: string;
  icon?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="not-prose flex flex-col gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-4 sm:p-6">
      {title && (
        <p className="text-lg font-semibold text-zinc-100">{title}</p>
      )}
      <div className="space-y-3 text-sm">
        {children}
      </div>
    </article>
  );
}

export function CardGrid({
  children,
}: {
  stagger?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      {children}
    </div>
  );
}
