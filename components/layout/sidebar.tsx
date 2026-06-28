"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen border-r border-white/10 bg-black/20 px-4 py-6 backdrop-blur lg:block">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-turf-400">
          Dynasty
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">
          Blueprint HQ
        </h1>
        <p className="mt-2 text-sm leading-5 text-blueprint-300">
          Football Operations Center
        </p>
      </div>

      <nav aria-label="Primary navigation" className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              className={cn(
                "group flex h-11 items-center justify-between rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-blueprint-950"
                  : "text-blueprint-200 hover:bg-white/[0.055] hover:text-white"
              )}
              href={item.href}
              key={item.href}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.title}</span>
              </span>
              {isActive ? (
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
