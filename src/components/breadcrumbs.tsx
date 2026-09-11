import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-ssb-blue">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ssb-navy">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
