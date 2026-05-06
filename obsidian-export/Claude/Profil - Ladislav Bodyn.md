---
title: Profil - Ladislav Bodyn
tags:
  - claude/profil
  - uživatel
aliases:
  - Ladislav
  - Ladislav Bodyn
date_created: 2026-05-06
date_updated: 2026-05-06
---

# Ladislav Bodyn

> [!info] Profil uživatele Claude Code
> Tato nota obsahuje vše, co o mně ví Claude — preference, projekty, nastavení a pracovní kontext.

## Základní informace

| Položka | Hodnota |
|---|---|
| **Jméno** | Ladislav Bodyn |
| **Komunikace** | Česky (stručně) |
| **Obsidian vault** | `/Users/ladislavbodyn/Desktop/Obsidian_2026` |
| **GitHub** | `bodynladislav-2025` |

## Technické preference

> [!tip] Stack
> Technologie, které používám pro vývoj.

- **Frontend:** React 18, Vite, JavaScript
- **Linting:** ESLint
- **Verzování:** Git + GitHub
- **IDE integrace:** Claude Code (CLI)

## Obsidian integrace s Claude Code

> [!note] Automatická integrace
> Claude Code automaticky zapisuje logy do Obsidianu při každém sezení.

### Struktura vaultu (Claude sekce)

```
Obsidian_2026/
└── Claude/
    ├── Denní zápisky/     → YYYY-MM-DD.md (auto-generované po každém sezení)
    ├── Projekty/          → projektové noty
    └── Git logy/          → logy commitů
```

### Hooks

| Hook | Soubor |
|---|---|
| **Start hook** | `.claude/hooks/obsidian-start.sh` |
| **Stop hook** | `.claude/hooks/obsidian-stop.sh` |

## Pravidla pro Claude

> [!warning] Povinná pravidla
> Claude musí tato pravidla vždy dodržovat.

1. Vždy commitovat na větev `claude/claude-obsidian-integration-8yor0`
2. Po každém sezení automaticky zapsat log do Obsidianu
3. Komunikovat stručně a **česky**
4. Všechny změny pushovat pomocí `git push -u origin <větev>`

## Projekty

- [[Projekt - NewCloude2026]]

---

%%Generováno: 2026-05-06 | Zdroj: CLAUDE.md%%
