"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  Plus,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  Home,
  CalendarDays,
} from "lucide-react";
import LogoutButton from "@/app/dashboard/logout-button";

export type AccountLink = {
  href: string;
  label: string;
  icon: string;
};

const ICONS = {
  overview: LayoutDashboard,
  profile: UserRound,
  explore: Compass,
  messages: MessageCircle,
  companions: Users,
  events: CalendarDays,
  membership: Ticket,
  opportunity: Home,
  create: Plus,
  admin: ShieldCheck,
  other: Handshake,
} as const;

type Props = {
  links: AccountLink[];
  name: string;
  avatarUrl: string | null;
  roleLabel: string;
};

export default function AccountNav({ links, name, avatarUrl, roleLabel }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const initial = (name.trim()[0] ?? "T").toUpperCase();

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-3xl bg-[#0f3d2e] p-5 text-white shadow-sm">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full border-2 border-amber-400 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-[#176b50] text-xl font-bold">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-bold">{name}</p>
            <span className="mt-1 inline-block rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-[#3b2a00]">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <nav
        aria-label="Account"
        className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-3xl lg:border lg:border-[#e8dfc8] lg:bg-white lg:p-3 lg:pb-3"
      >
        {links.map((link) => {
          const Icon = ICONS[link.icon as keyof typeof ICONS] ?? ICONS.other;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-2xl ${
                active
                  ? "bg-[#176b50] text-white"
                  : "border border-[#e8dfc8] bg-white text-[#1f2a26] hover:bg-[#f3ecd9] lg:border-0 lg:bg-transparent"
              }`}
            >
              <Icon size={18} className={active ? "text-amber-300" : "text-[#176b50]"} />
              {link.label}
            </Link>
          );
        })}

        <div className="hidden pt-2 lg:block">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
