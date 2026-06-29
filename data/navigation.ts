import {
  BriefcaseBusiness,
  ClipboardList,
  DoorOpen,
  FileStack,
  Handshake,
  Images,
  LayoutDashboard,
  ShieldCheck,
  UsersRound
} from "lucide-react";

export const navigationItems = [
  {
    title: "Welcome",
    href: "/welcome",
    icon: DoorOpen
  },
  {
    title: "War Room",
    href: "/war-room",
    icon: LayoutDashboard
  },
  {
    title: "Program Office",
    href: "/program-office",
    icon: BriefcaseBusiness
  },
  {
    title: "Blueprint Planner",
    href: "/blueprint-planner",
    icon: FileStack
  },
  {
    title: "Roster Intelligence",
    href: "/roster-intelligence",
    icon: ShieldCheck
  },
  {
    title: "Recruiting Command",
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
  },
  {
    title: "Screenshot Import",
    href: "/screenshot-import",
    icon: Images
  }
] as const;
