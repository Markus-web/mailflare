"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Archive,
  ShieldAlert,
  Trash2,
  MailPlus,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useCompose } from "@/components/compose/compose-context";
import type { ShortcutDefinition, CommandItem } from "./types";
import { useHotkeys } from "./use-hotkeys";
import { CommandPalette } from "./command-palette";
import { ShortcutsHelpDialog } from "./shortcuts-help-dialog";
import { useShortcutsEnabled } from "./use-shortcuts-enabled";

interface ShortcutsContextValue {
  shortcutsEnabled: boolean;
  shortcutsPreferenceLoading: boolean;
  shortcutsPreferenceError: string | null;
  setShortcutsEnabled: (enabled: boolean) => Promise<void>;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  registerShortcut: (shortcut: ShortcutDefinition) => void;
  registerCommand: (command: CommandItem) => void;
  shortcuts: ShortcutDefinition[];
  commands: CommandItem[];
}

const ShortcutsContext = createContext<ShortcutsContextValue | null>(null);

export function useShortcuts() {
  const ctx = useContext(ShortcutsContext);
  if (!ctx) {
    throw new Error("useShortcuts must be used within a ShortcutsProvider");
  }
  return ctx;
}

export function ShortcutsProvider({
  children,
  extraShortcuts = [],
  extraCommands = [],
}: {
  children: React.ReactNode;
  extraShortcuts?: ShortcutDefinition[];
  extraCommands?: CommandItem[];
}) {
  const router = useRouter();
  const { openComposer } = useCompose();
  const {
    enabled: shortcutsEnabled,
    error: shortcutsPreferenceError,
    isLoading: shortcutsPreferenceLoading,
    setEnabled: setShortcutsEnabled,
  } = useShortcutsEnabled();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [customShortcuts, setCustomShortcuts] = useState<ShortcutDefinition[]>(extraShortcuts);
  const [customCommands, setCustomCommands] = useState<CommandItem[]>(extraCommands);

  const openCommandPalette = () => {
    if (shortcutsEnabled && !shortcutsPreferenceLoading) setIsCommandPaletteOpen(true);
  };
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const openHelpModal = () => {
    if (shortcutsEnabled && !shortcutsPreferenceLoading) setIsHelpModalOpen(true);
  };
  const closeHelpModal = () => setIsHelpModalOpen(false);

  const registerShortcut = (shortcut: ShortcutDefinition) => {
    setCustomShortcuts((prev) => {
      const idx = prev.findIndex((s) => s.key === shortcut.key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = shortcut;
        return next;
      }
      return [...prev, shortcut];
    });
  };

  const registerCommand = (command: CommandItem) => {
    setCustomCommands((prev) => {
      const idx = prev.findIndex((c) => c.id === command.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = command;
        return next;
      }
      return [...prev, command];
    });
  };

  // Base navigation and global shortcuts
  const baseShortcuts = useMemo<ShortcutDefinition[]>(() => {
    return [
      {
        key: "k",
        modifiers: ["meta", "ctrl"],
        label: "Komentopaletti",
        category: "Yleiset",
        action: () => setIsCommandPaletteOpen((prev) => !prev),
      },
      {
        key: "?",
        label: "Pikanäppäimet",
        category: "Yleiset",
        action: () => setIsHelpModalOpen((prev) => !prev),
      },
      {
        key: "c",
        label: "Kirjoita viesti",
        category: "Kirjoittaminen",
        action: () => openComposer(),
      },
      {
        key: "/",
        label: "Hae sähköpostia",
        category: "Navigointi",
        action: () => {
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[placeholder*="Hae"], input[placeholder*="Search"]'
          );
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        },
      },
      {
        key: "g i",
        label: "Siirry Saapuneisiin",
        category: "Navigointi",
        action: () => router.push("/inbox"),
      },
      {
        key: "g s",
        label: "Siirry Tähdellä merkittyihin",
        category: "Navigointi",
        action: () => router.push("/starred"),
      },
      {
        key: "g z",
        label: "Siirry Lykättyihin",
        category: "Navigointi",
        action: () => router.push("/snoozed"),
      },
      {
        key: "g t",
        label: "Siirry Lähetettyihin",
        category: "Navigointi",
        action: () => router.push("/sent"),
      },
      {
        key: "g d",
        label: "Siirry Luonnoksiin",
        category: "Navigointi",
        action: () => router.push("/drafts"),
      },
      {
        key: "g a",
        label: "Siirry Arkistoon",
        category: "Navigointi",
        action: () => router.push("/archived"),
      },
      {
        key: "g !",
        label: "Siirry Roskapostiin",
        category: "Navigointi",
        action: () => router.push("/spam"),
      },
      {
        key: "g x",
        label: "Siirry Roskakoriin",
        category: "Navigointi",
        action: () => router.push("/trash"),
      },
      {
        key: "escape",
        label: "Sulje ikkuna / poista fokus",
        category: "Yleiset",
        action: () => {
          setIsCommandPaletteOpen(false);
          setIsHelpModalOpen(false);
        },
      },
      ...customShortcuts,
    ];
  }, [router, openComposer, customShortcuts]);

  useHotkeys(baseShortcuts, { enabled: shortcutsEnabled && !shortcutsPreferenceLoading });

  // Base Command Palette actions
  const allCommands = useMemo<CommandItem[]>(() => {
    const builtins: CommandItem[] = [
      {
        id: "compose",
        title: "Kirjoita uusi viesti",
        subtitle: "Avaa luonnoseditori",
        category: "Toiminnot",
        icon: MailPlus,
        shortcut: "c",
        perform: () => openComposer(),
      },
      {
        id: "nav-inbox",
        title: "Siirry Saapuneisiin",
        category: "Navigointi",
        icon: Inbox,
        shortcut: "g i",
        perform: () => router.push("/inbox"),
      },
      {
        id: "nav-starred",
        title: "Siirry Tähdellä merkittyihin",
        category: "Navigointi",
        icon: Star,
        shortcut: "g s",
        perform: () => router.push("/starred"),
      },
      {
        id: "nav-snoozed",
        title: "Siirry Lykättyihin",
        category: "Navigointi",
        icon: Clock,
        shortcut: "g z",
        perform: () => router.push("/snoozed"),
      },
      {
        id: "nav-sent",
        title: "Siirry Lähetettyihin",
        category: "Navigointi",
        icon: Send,
        shortcut: "g t",
        perform: () => router.push("/sent"),
      },
      {
        id: "nav-drafts",
        title: "Siirry Luonnoksiin",
        category: "Navigointi",
        icon: FileText,
        shortcut: "g d",
        perform: () => router.push("/drafts"),
      },
      {
        id: "nav-archived",
        title: "Siirry Arkistoon",
        category: "Navigointi",
        icon: Archive,
        shortcut: "g a",
        perform: () => router.push("/archived"),
      },
      {
        id: "nav-spam",
        title: "Siirry Roskapostiin",
        category: "Navigointi",
        icon: ShieldAlert,
        shortcut: "g !",
        perform: () => router.push("/spam"),
      },
      {
        id: "nav-trash",
        title: "Siirry Roskakoriin",
        category: "Navigointi",
        icon: Trash2,
        shortcut: "g x",
        perform: () => router.push("/trash"),
      },
      {
        id: "settings-account",
        title: "Tilin asetukset",
        subtitle: "Profiili, salasana ja asetukset",
        category: "Asetukset",
        icon: Settings,
        perform: () => router.push("/settings/account"),
      },
      {
        id: "show-help",
        title: "Pikanäppäinten pikaopas",
        subtitle: "Näytä kaikki pikanäppäimet",
        category: "Yleiset",
        icon: HelpCircle,
        shortcut: "?",
        perform: () => setIsHelpModalOpen(true),
      },
    ];

    return [...builtins, ...customCommands];
  }, [router, openComposer, customCommands]);

  return (
    <ShortcutsContext.Provider
      value={{
        shortcutsEnabled,
        shortcutsPreferenceLoading,
        shortcutsPreferenceError,
        setShortcutsEnabled,
        openCommandPalette,
        closeCommandPalette,
        openHelpModal,
        closeHelpModal,
        registerShortcut,
        registerCommand,
        shortcuts: baseShortcuts,
        commands: allCommands,
      }}
    >
      {children}
      {shortcutsEnabled && !shortcutsPreferenceLoading && (
        <>
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={closeCommandPalette}
            commands={allCommands}
          />
          <ShortcutsHelpDialog
            isOpen={isHelpModalOpen}
            onClose={closeHelpModal}
            shortcuts={baseShortcuts}
          />
        </>
      )}
    </ShortcutsContext.Provider>
  );
}
