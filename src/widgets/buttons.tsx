import { Palette, LucideIcon, Sparkles } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  sparkles: Sparkles
};

interface ButtonIconProps {
  readonly label: string;
  readonly icon: keyof typeof ICONS;
  readonly onClick?: () => void;
}

export function ButtonIcon({ label, icon, onClick }: ButtonIconProps) {
  const Icon = ICONS[icon];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-primary/60 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary/20"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
