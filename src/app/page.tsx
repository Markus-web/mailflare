"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authFetch, getClientSessionToken } from "@/lib/auth/client";
import { getHomeActions, heroMessages, sidebarItems } from "./utils";
import { ArrowRight, Inbox, Mail, Search, ShieldCheck } from "lucide-react";
import { useBranding } from "@/components/branding-provider";

export default function HomePage() {
  const branding = useBranding();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!getClientSessionToken()) return;

    authFetch("/api/auth/me", { redirectOnUnauthorized: false })
      .then((response) => {
        if (!cancelled) setHasUser(response.ok);
      })
      .catch(() => {
        if (!cancelled) setHasUser(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const actions = getHomeActions(hasUser);
  const appName = branding.appName === "Mailflare" ? "Kotisivu Webmail" : branding.appName;

  return (
    <div className="min-h-dvh bg-[#f3efe6] text-[#1a1a1a]">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Kotisivu Webmail"
        >
          <img src={branding.iconUrl} height={32} width={32} alt="" />
          <span className="text-base font-semibold tracking-tight">{appName}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-[#756b5c]/40 bg-white hover:bg-[#ebe4d6]"
          >
            <a href="https://kotisivu.org/hinnasto/">Hinnasto</a>
          </Button>
          {actions.map((action) => (
            <Button
              key={action.href}
              variant={action.variant}
              asChild
              className="rounded-xl bg-[#e4ae20] text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-12 pt-8 sm:px-6 md:pt-16 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div className="flex max-w-2xl flex-col justify-center">
            <div className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-[#004d61]">
              <ShieldCheck className="h-4 w-4" />
              Vain Pro-asiakkaille ja ylläpidolle
            </div>
            <h1 className="max-w-[14ch] text-5xl font-semibold leading-[0.96] tracking-tight text-[#1a1a1a] sm:text-6xl lg:text-7xl">
              Kotisivu.org webmail
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#3e5641]">
              Oma postilaatikko Cloudflare Email Routingin päällä. Julkista
              rekisteröintiä ei ole: laatikko avataan tukitiketin jälkeen
              (alk. 15 €/kk). WordPress-ilmoitukset kulkevat edelleen
              postitus.kotisivu.org -osoitteesta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="rounded-xl bg-[#e4ae20] px-6 text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
              >
                <Link href={hasUser ? "/inbox" : "/login"}>
                  {hasUser ? "Avaa postilaatikko" : "Kirjaudu"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl border-[#756b5c]/40 bg-white px-6 hover:bg-[#ebe4d6]"
              >
                <a href="https://kotisivu.org/tuki/">Tilaa tukitiketin kautta</a>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[480px] overflow-hidden rounded-[2px] border-2 border-[#8a6a0c] bg-[#fff8ee] shadow-[0_6px_0_rgba(10,32,40,0.12)]">
            <div className="grid h-full min-h-[480px] grid-cols-[176px_1fr] bg-[#fff8ee]">
              <aside className="hidden flex-col gap-2 bg-[#ebe4d6] px-3 py-5 sm:flex">
                <div className="mb-4 flex items-center gap-3 px-3 text-[#1a1a1a]">
                  <Inbox className="h-5 w-5" />
                  <span className="font-semibold">Posti</span>
                </div>
                <div className="mb-3 flex h-12 w-fit items-center gap-2 rounded-[2px] bg-[#e4ae20] px-5 text-sm font-semibold text-[#301018] shadow-sm">
                  <Mail className="h-4 w-4" />
                  Kirjoita
                </div>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`flex h-9 items-center justify-between rounded-r-full px-3 text-sm font-medium ${
                        item.active
                          ? "bg-[#004d61] text-[#f0f0f0]"
                          : "text-[#3e5641]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {item.count && (
                        <span className="text-xs opacity-80">{item.count}</span>
                      )}
                    </div>
                  );
                })}
              </aside>

              <div className="col-span-2 flex min-w-0 flex-col sm:col-span-1">
                <div className="flex h-16 items-center gap-3 bg-[#ebe4d6] px-4">
                  <div className="flex h-12 flex-1 items-center gap-3 rounded-[2px] bg-white px-4 text-[#3e5641]">
                    <Search className="h-5 w-5" />
                    <span className="text-[15px]">Hae viestejä</span>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fff8ee]">
                  <div className="flex h-14 items-center justify-between border-b border-[#756b5c]/30 px-6">
                    <h2 className="text-xl font-medium text-[#1a1a1a]">Saapuneet</h2>
                  </div>
                  <div className="divide-y divide-[#756b5c]/20">
                    {heroMessages.map((message) => (
                      <div
                        key={message.sender}
                        className="grid min-h-14 grid-cols-[28px_minmax(112px,180px)_1fr_auto] items-center gap-3 px-5 text-sm hover:bg-[#f3efe6]"
                      >
                        <message.icon className="h-4 w-4 text-[#756b5c]" />
                        <span className="truncate font-semibold text-[#1a1a1a]">
                          {message.sender}
                        </span>
                        <span className="truncate text-[#3e5641]">
                          <span className="font-medium text-[#1a1a1a]">
                            {message.subject}
                          </span>
                          <span className="hidden text-[#3e5641] md:inline">
                            {" "}
                            - {message.preview}
                          </span>
                        </span>
                        <span className="rounded-[2px] bg-[#004d61]/10 px-2.5 py-1 text-xs font-semibold text-[#004d61]">
                          {message.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#756b5c]/25 bg-[#1a1a1a] px-4 py-10 text-[#f0f0f0] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#c9c9c9]">
              Tarvitsetko postilaatikon? Avaa tiketti Kotisivu.orgissa (Pro).
              Ylläpito luo tunnuksen Mailflareen.
            </p>
            <Button
              asChild
              className="rounded-xl bg-[#e4ae20] text-[#301018] hover:bg-[#ffe650]"
            >
              <a href="https://kotisivu.org/tuki/">Avaa Tuki</a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
