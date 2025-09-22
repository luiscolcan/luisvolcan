import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly className?: string;
}

export function Card({ children, className, title, description }: PropsWithChildren<CardProps>) {
  return (
    <section className={cn("rounded-xl border border-white/10 bg-card p-4 shadow-lg", className)}>
      {title ? (
        <header className="mb-3 space-y-1">
          <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          {description ? <p className="text-sm text-card-foreground/70">{description}</p> : null}
        </header>
      ) : null}
      <div className="space-y-3 text-card-foreground">{children}</div>
    </section>
  );
}

export function CardGrid({ children, className }: PropsWithChildren<{ readonly className?: string }>) {
  return <div className={cn("grid gap-4 md:grid-cols-2", className)}>{children}</div>;
}
