"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HamburgerMenu, CloseSquare } from "iconsax-reactjs";
import type { Icon } from "iconsax-reactjs";
import { BelefulImages } from "@/constant/image";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: Icon;
  /** Defaults to exact match; pass to control active highlighting. */
  match?: (pathname: string) => boolean;
}

export interface DashboardUser {
  name: string;
  role: string;
  /** Falls back to initials derived from the name. */
  initials?: string;
}

interface DashboardShellProps {
  navItems: DashboardNavItem[];
  user: DashboardUser;
  /** Where the brand logo links to (usually the dashboard home). */
  brandHref: string;
  /** Login page to return to after signing out. */
  logoutHref: string;
  children: React.ReactNode;
}

/**
 * Shared logistics/admin dashboard scaffold: fixed sidebar on desktop, a
 * slide-over drawer on mobile. Reused by the agent and vendor dashboards.
 */
export function DashboardShell({
  navItems,
  user,
  brandHref,
  logoutHref,
  children,
}: DashboardShellProps) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = React.useState(false);

  const initials =
    user.initials ??
    user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");

  const isActive = (item: DashboardNavItem) =>
    item.match ? item.match(pathname) : pathname === item.href;

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <Link href={brandHref} className="flex px-6 py-6">
        <Image src={BelefulImages.logoImage} alt="BELEFUL" className="w-28" />
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const ItemIcon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#00452E] text-white shadow-sm"
                  : "text-[#666666] hover:bg-[#00452E]/[0.06] hover:text-[#00452E]",
              )}
            >
              <ItemIcon size={20} variant={active ? "Bold" : "TwoTone"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-[#00452E]/10 p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#00452E] text-sm font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#111111]">
              {user.name}
            </p>
            <p className="truncate text-xs text-[#666666]">{user.role}</p>
          </div>
          <SignOutButton redirectTo={logoutHref} className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#00452E]/10 bg-white lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#00452E]/10 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href={brandHref}>
          <Image src={BelefulImages.logoImage} alt="BELEFUL" className="w-24" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl bg-[#00452E]/5 text-[#00452E]"
        >
          <HamburgerMenu size={22} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-white shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-xl text-[#666666]"
            >
              <CloseSquare size={22} variant="TwoTone" />
            </button>
            {SidebarBody}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Page header used at the top of each dashboard screen. */
export function DashboardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-[#666666]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
