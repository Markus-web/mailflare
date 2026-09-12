"use client";

import {
  DatabaseBackup,
  Globe2,
  Activity,
  Mail,
  Settings,
  Palette,
  BadgeDollarSign,
  Users,
  Route,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "./components-nav";
import { SidebarFooter } from "./sidebar-footer";
import { useBranding } from "./branding-provider";
import { SidebarHeader } from "./sidebar-header";
import { useSidebar } from "./sidebar-state";

const sections = [
  {
    // label: "Yleiskatsaus",
    links: [{ href: "/admin", label: "Yleiskatsaus", icon: Settings }],
  },
  {
    label: "Sähköposti",
    links: [
      { href: "/mailboxes", label: "Postilaatikot", icon: Mail },
      { href: "/domains", label: "Verkkotunnukset", icon: Globe2 },
      { href: "/routing", label: "Reititys", icon: Route },
      { href: "/webhooks", label: "Webhookit", icon: Webhook },
    ],
  },
  {
    label: "Hallinto",
    links: [
      { href: "/accounts", label: "Tilit", icon: Users },
      { href: "/activity", label: "Tapahtumat", icon: Activity },
      { href: "/backups", label: "Varmuuskopiot", icon: DatabaseBackup },
    ],
  },
  {
    label: "Tuote",
    links: [
      { href: "/branding", label: "Brändäys", icon: Palette },
      { href: "/licenses", label: "Lisenssit", icon: BadgeDollarSign },
      // { href: "/api-keys", label: "API-avaimet", icon: KeyRound },
    ],
  },
];

export function AdminNav({ className }: { className?: string }) {
  const branding = useBranding();
  const { minimal } = useSidebar();

  return (
    <nav className={cn("flex min-h-full flex-col gap-1", className)}>
      <SidebarHeader href="/inbox" label="Ylläpito" />
      <div className={cn("space-y-4", minimal && "space-y-2")}>
        {sections.map((section) => {
          const links = section.links.filter(
            (link) =>
              link.href !== "/branding" || branding.canCustomizeBranding,
          );
          if (links.length === 0) return null;

          return (
            // The first section has no label, so fall back to its first href for a stable key.
            <section key={section.label ?? links[0].href}>
              {!minimal && section.label && (
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {links.map((link) => (
                  <NavItem link={link} key={link.href} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <span className="flex-1" />
      <SidebarFooter />
    </nav>
  );
}
