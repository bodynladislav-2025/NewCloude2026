#!/bin/bash
# Start hook — příprava denního zápisku v Obsidianu

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
CLAUDE_DIR="$VAULT/Claude"

# Ve webovém prostředí vault není dostupný — přeskočit
if [ ! -d "$VAULT" ]; then
    exit 0
fi

DATE=$(date +%Y-%m-%d)
DAILY_DIR="$CLAUDE_DIR/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"
CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PROJECT=$(basename "$CWD")

mkdir -p "$DAILY_DIR" "$CLAUDE_DIR/Projekty" "$CLAUDE_DIR/Git logy"

# Profil — vytvořit pokud neexistuje
PROFILE="$CLAUDE_DIR/Profil.md"
if [ ! -f "$PROFILE" ]; then
    cat > "$PROFILE" << 'EOF'
---
tags: [profil]
vlastník: Ladislav Bodyn
---

# Ladislav Bodyn

| | |
|---|---|
| **Vault** | `/Users/ladislavbodyn/Desktop/Obsidian_2026` |
| **GitHub** | `bodynladislav-2025` |
| **Jazyk** | Čeština |

## Stack

- React 18, Vite, JavaScript
- Git + GitHub
- Claude Code, Obsidian

## Pravidla pro Claude

- Komunikuj česky, stručně
- Commituj na větev `claude/claude-obsidian-integration-8yor0`
- Po sezení zapiš log do Obsidianu

## Projekty

- [[Projekty/NewCloude2026|NewCloude2026]]
EOF
fi

# Denní zápisek — vytvořit pokud neexistuje
if [ ! -f "$DAILY_NOTE" ]; then
    cat > "$DAILY_NOTE" << HEADER
---
datum: $DATE
tags: [log, dev]
projekt: $PROJECT
---

# Zápisky — $DATE

HEADER
fi

echo "✅ Obsidian start: $DAILY_NOTE"
