"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/utils/cn";

export function TopNavigation() {
  const pathname = usePathname();
  const activeItem = navigationItems.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-blueprint-950/88 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blueprint-300">
            Operations
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {activeItem?.title ?? "War Room"}
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <StatusBadge>Foundation</StatusBadge>
        </div>

        <Link
          aria-label="Open War Room"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.055] text-white lg:hidden"
          href="/war-room"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden"
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-turf-400 text-blueprint-950"
                  : "bg-white/[0.055] text-blueprint-200"
              )}
              href={item.href}
              key={item.href}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
