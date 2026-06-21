type PageHeaderProps = {
  title: string;
  description?: string;
  kicker?: string;
  action?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  kicker,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-4">
      <div className="space-y-1">
        <span className="font-press text-[11px] uppercase tracking-[0.24em] text-primary">
          {kicker ?? "Catalog"}
        </span>
        <h1 className="font-disp text-4xl font-extrabold uppercase leading-[0.9] tracking-tight">
          {title}
          <span className="text-primary">.</span>
        </h1>
        {description ? (
          <p className="text-muted-foreground font-press text-xs uppercase tracking-wider">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
