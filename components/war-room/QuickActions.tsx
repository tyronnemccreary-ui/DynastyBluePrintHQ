import Link from "next/link";
import {
  BriefcaseBusiness,
  ClipboardList,
  FileStack,
  Handshake,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

const quickActions = [
  {
    title: "Program Office",
    href: "/program-office",
    icon: BriefcaseBusiness
  },
  {
    title: "Football Operations Budget",
    href: "/blueprint-planner",
    icon: FileStack
  },
  {
    title: "Roster Intelligence",
    href: "/roster-intelligence",
    icon: ShieldCheck
  },
  {
    title: "Recruiting Command Center",
    href: "/recruiting-command-center",
    icon: ClipboardList
  },
  {
    title: "Transfer Portal",
    href: "/transfer-portal",
    icon: Handshake
  },
  {
    title: "Staff Management",
    href: "/staff-management",
    icon: UsersRound
  }
] as const;

export function QuickActions() {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Quick Actions</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Football Operations</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="flex h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-blueprint-100 transition-colors hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-turf-400/60"
              href={action.href}
              key={action.href}
            >
              <Icon className="h-4 w-4 shrink-0 text-turf-400" aria-hidden="true" />
              <span className="truncate">{action.title}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
