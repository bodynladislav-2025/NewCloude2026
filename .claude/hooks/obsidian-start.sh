#!/bin/bash
# Zápis zahájení sezení do Obsidianu
# Spouští se na začátku každého Claude sezení (SessionStart hook)

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
CLAUDE_DIR="$VAULT/Claude"
PROFILE="$CLAUDE_DIR/Profil.md"

# Pokud vault neexistuje (web prostředí), přeskočit
if [ ! -d "$VAULT" ]; then
    exit 0
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAILY_DIR="$CLAUDE_DIR/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"
CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PROJECT=$(basename "$CWD")

mkdir -p "$DAILY_DIR"
mkdir -p "$CLAUDE_DIR/Projekty"

# Vytvořit profil pokud neexistuje
if [ ! -f "$PROFILE" ]; then
    mkdir -p "$(dirname "$PROFILE")"
    cat > "$PROFILE" << 'PROFILE_TEMPLATE'
---
typ: uživatelský-profil
vlastník: Ladislav Bodyn
tagy:
  - claude/profil
---

# Profil — Ladislav Bodyn

## Osobní informace

| Pole | Hodnota |
|------|---------|
| **Jméno** | Ladislav Bodyn |
| **Vault** | `/Users/ladislavbodyn/Desktop/Obsidian_2026` |
| **Jazyk** | Čeština |

## Aktivní projekty

- [[Projekty/NewCloude2026|NewCloude2026]] — hlavní vývojový projekt

## Technologie

- Frontend: React, Vite, JavaScript
- Verzování: Git, GitHub
- Nástroje: Claude Code, Obsidian

## Preference Claude

> [!tip] Instrukce pro Claude
> - Vždy komunikuj česky
> - Zapisuj výsledky každého sezení do Obsidianu
> - Commituj na větev `claude/claude-obsidian-integration-8yor0`
> - Dávej přednost hotovému řešení před popisem

## Osobní poznámky

<!-- Sem si piš poznámky pro Claude -->

PROFILE_TEMPLATE
    echo "✅ Vytvořen profil: $PROFILE"
fi

# Vytvořit denní zápisek pokud neexistuje
if [ ! -f "$DAILY_NOTE" ]; then
    cat > "$DAILY_NOTE" << HEADER
---
datum: $DATE
typ: claude-log
tagy:
  - claude/denní-log
  - projekt/$PROJECT
projekt: $PROJECT
---

# Claude zápisky — $DATE

HEADER
fi

# Přidat záznam o startu — zkontrolovat obsidian CLI
if command -v obsidian &>/dev/null 2>&1; then
    obsidian append path="Claude/Denní zápisky/$DATE.md" \
        content="\n> [!abstract] Sezení zahájeno $TIME — [[Projekty/$PROJECT|$PROJECT]]\n" \
        silent 2>/dev/null || \
        echo "" >> "$DAILY_NOTE" && \
        echo "> [!abstract] Sezení zahájeno **$TIME** — [[Projekty/$PROJECT|$PROJECT]]" >> "$DAILY_NOTE"
else
    echo "" >> "$DAILY_NOTE"
    echo "> [!abstract] Sezení zahájeno **$TIME** — [[Projekty/$PROJECT|$PROJECT]]" >> "$DAILY_NOTE"
fi

echo "✅ Obsidian start sync: $DAILY_NOTE"
