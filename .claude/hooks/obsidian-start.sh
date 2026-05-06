#!/bin/bash
# Načtení kontextu z Obsidianu při startu Claude sezení
# Spouští se na začátku každého sezení (SessionStart hook)

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
PROFILE="$VAULT/Claude/Profil.md"
ENV_FILE="${CLAUDE_ENV_FILE:-}"

# Pokud vault neexistuje (web prostředí), přeskočit
if [ ! -d "$VAULT" ]; then
    exit 0
fi

# Zapsat profilové informace do env pro Claude
if [ -n "$ENV_FILE" ] && [ -f "$PROFILE" ]; then
    echo "export CLAUDE_USER_PROFILE_PATH='$PROFILE'" >> "$ENV_FILE"
fi

# Vytvořit profil pokud neexistuje
if [ ! -f "$PROFILE" ]; then
    mkdir -p "$(dirname "$PROFILE")"
    cat > "$PROFILE" << 'PROFILE_TEMPLATE'
---
typ: uživatelský-profil
vlastník: Ladislav Bodyn
aktualizováno: auto
---

# Profil uživatele — Ladislav Bodyn

## Osobní informace
- **Jméno:** Ladislav Bodyn
- **Vault:** /Users/ladislavbodyn/Desktop/Obsidian_2026
- **Jazyk:** Česky (preferovaný jazyk komunikace)

## Pracovní styl
- Preferuje stručné a přímé odpovědi
- Chce vidět hotové řešení, ne jen popis
- Pracuje primárně ve webovém prostředí Claude Code

## Aktivní projekty
- [[Projekty/NewCloude2026|NewCloude2026]] — hlavní vývojový projekt

## Technologie
- Frontend: React, Vite, JavaScript
- Verzování: Git, GitHub
- Nástroje: Claude Code, Obsidian

## Preference Claude
- Vždy zapisovat výsledky sezení do Obsidianu
- Commitovat změny na větev claude/claude-obsidian-integration-8yor0
- Komunikovat v češtině

## Poznámky
<!-- Sem si zapisuj osobní poznámky pro Claude -->

PROFILE_TEMPLATE
    echo "✅ Vytvořen nový profil: $PROFILE"
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAILY_DIR="$VAULT/Claude/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"

mkdir -p "$DAILY_DIR"

# Přidat záznam o startu sezení
if [ ! -f "$DAILY_NOTE" ]; then
    cat > "$DAILY_NOTE" << HEADER
---
datum: $DATE
typ: claude-denní-log
---

# Claude zápisky — $DATE

HEADER
fi

CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PROJECT=$(basename "$CWD")

echo "" >> "$DAILY_NOTE"
echo "▶️ **Sezení zahájeno** $TIME — projekt: $PROJECT" >> "$DAILY_NOTE"

echo "✅ Obsidian start sync: $DAILY_NOTE"
