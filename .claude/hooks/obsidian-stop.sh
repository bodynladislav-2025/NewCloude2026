#!/bin/bash
# Automatický zápis Claude sezení do Obsidianu (Obsidian-flavored markdown)
# Spouští se po každém ukončení Claude sezení (Stop hook)

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
CLAUDE_DIR="$VAULT/Claude"

# Fallback pro web prostředí kde vault není dostupný
if [ ! -d "$VAULT" ]; then
    CLAUDE_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/obsidian-export"
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAILY_DIR="$CLAUDE_DIR/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"

mkdir -p "$DAILY_DIR"
mkdir -p "$CLAUDE_DIR/Projekty"
mkdir -p "$CLAUDE_DIR/Git logy"

# Načíst vstup
INPUT=$(cat)

# Parsovat JSON vstup
TRANSCRIPT_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('transcript_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

CWD=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('cwd', ''))
except:
    print('')
" 2>/dev/null || echo "")

SESSION_ID=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('session_id', 'neznámé')[:8])
except:
    print('neznámé')
" 2>/dev/null || echo "neznámé")

PROJECT=$(basename "$CWD" 2>/dev/null || echo "neznámý")

# Git informace
GIT_BRANCH="N/A"
GIT_COMMITS=""
GIT_DIFF_STATS=""
GIT_FILES_CHANGED=""

if [ -n "$CWD" ] && [ -d "$CWD/.git" ]; then
    GIT_BRANCH=$(cd "$CWD" && git branch --show-current 2>/dev/null || echo "N/A")
    GIT_COMMITS=$(cd "$CWD" && git log --oneline --since="8 hours ago" --format="- \`%h\` %s" 2>/dev/null | head -10 || echo "")
    GIT_DIFF_STATS=$(cd "$CWD" && git diff --stat HEAD~1 HEAD 2>/dev/null | head -10 || echo "")
    GIT_FILES_CHANGED=$(cd "$CWD" && git diff --name-only HEAD~1 HEAD 2>/dev/null | head -20 || echo "")
fi

# Parsovat transkript — extrahovat aktivity
ACTIONS_TEXT=""
FILES_EDITED=""
BASH_COMMANDS=""
SUMMARY_TEXT=""

if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    PARSED=$(python3 << PYEOF
import json, sys

summaries = []
files_edited = []
bash_cmds = []

try:
    with open('$TRANSCRIPT_PATH', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                msg_type = data.get('type', '')

                if msg_type == 'assistant':
                    content = data.get('message', {}).get('content', [])
                    for block in content:
                        if not isinstance(block, dict):
                            continue
                        btype = block.get('type', '')

                        if btype == 'text':
                            text = block.get('text', '').strip()
                            if len(text) > 40:
                                # Vzít první větu nebo prvních 200 znaků
                                first = text.split('\n')[0][:200]
                                summaries.append(first)

                        elif btype == 'tool_use':
                            name = block.get('name', '')
                            inp = block.get('input', {})

                            if name in ('Edit', 'Write'):
                                fp = inp.get('file_path', '')
                                if fp and fp not in files_edited:
                                    files_edited.append(fp)

                            elif name == 'Bash':
                                cmd = inp.get('command', '').strip()
                                if cmd and len(cmd) > 3:
                                    short = cmd.split('\n')[0][:100]
                                    if short not in bash_cmds:
                                        bash_cmds.append(short)
            except:
                pass
except:
    pass

# Výstup
print('SUMMARIES_START')
for s in summaries[-4:]:
    clean = s.replace('|', '\\|')
    print(f'- {clean}')
print('SUMMARIES_END')

print('FILES_START')
for f in files_edited[:15]:
    print(f'- [[{f}|{f.split("/")[-1]}]]')
print('FILES_END')

print('BASH_START')
for c in bash_cmds[:10]:
    print(f'- \`{c}\`')
print('BASH_END')
PYEOF
)

    SUMMARY_TEXT=$(echo "$PARSED" | awk '/SUMMARIES_START/{f=1;next}/SUMMARIES_END/{f=0}f')
    FILES_EDITED=$(echo "$PARSED" | awk '/FILES_START/{f=1;next}/FILES_END/{f=0}f')
    BASH_COMMANDS=$(echo "$PARSED" | awk '/BASH_START/{f=1;next}/BASH_END/{f=0}f')
fi

# === Vytvořit denní zápisek s YAML frontmatter pokud neexistuje ===
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

# === Zkusit obsidian CLI (pokud běží Obsidian a má CLI) ===
USE_CLI=false
if command -v obsidian &>/dev/null 2>&1; then
    USE_CLI=true
fi

# === Sestavit obsah sezení ===
SESSION_CONTENT=$(cat << SESSIONEOF

---

## Sezení $TIME | $PROJECT

> [!info] Informace o sezení
> **Čas:** $DATE $TIME
> **Projekt:** \[\[$PROJECT\]\]
> **Session ID:** \`$SESSION_ID\`
> **Git větev:** \`$GIT_BRANCH\`
> **Cesta:** \`$CWD\`

SESSIONEOF
)

# Přidat shrnutí pokud existuje
if [ -n "$SUMMARY_TEXT" ]; then
    SESSION_CONTENT="$SESSION_CONTENT
> [!summary]- Shrnutí aktivity
$( echo "$SUMMARY_TEXT" | sed 's/^/> /' )

"
fi

# Přidat upravené soubory
if [ -n "$FILES_EDITED" ]; then
    SESSION_CONTENT="$SESSION_CONTENT
> [!example] Upravené soubory
$( echo "$FILES_EDITED" | sed 's/^/> /' )

"
fi

# Přidat bash příkazy
if [ -n "$BASH_COMMANDS" ]; then
    SESSION_CONTENT="$SESSION_CONTENT
> [!note]- Spuštěné příkazy
$( echo "$BASH_COMMANDS" | sed 's/^/> /' )

"
fi

# Přidat git commity
if [ -n "$GIT_COMMITS" ]; then
    SESSION_CONTENT="$SESSION_CONTENT
> [!success] Git commity (posledních 8h)
$( echo "$GIT_COMMITS" | sed 's/^/> /' )

"
fi

# Přidat změněné soubory z gitu
if [ -n "$GIT_DIFF_STATS" ]; then
    SESSION_CONTENT="$SESSION_CONTENT
\`\`\`
$GIT_DIFF_STATS
\`\`\`

"
fi

# === Zapsat do Obsidianu ===
if [ "$USE_CLI" = true ]; then
    # Použít obsidian CLI pokud je dostupné
    obsidian append path="Claude/Denní zápisky/$DATE.md" content="$SESSION_CONTENT" silent 2>/dev/null || \
        echo "$SESSION_CONTENT" >> "$DAILY_NOTE"
else
    # Přímý zápis do souboru
    echo "$SESSION_CONTENT" >> "$DAILY_NOTE"
fi

# === Aktualizovat projektový přehled ===
PROJECT_NOTE="$CLAUDE_DIR/Projekty/$PROJECT.md"
if [ ! -f "$PROJECT_NOTE" ]; then
    cat > "$PROJECT_NOTE" << PROJ
---
projekt: $PROJECT
cesta: $CWD
vytvořeno: $DATE
tagy:
  - claude/projekt
  - projekt/$PROJECT
---

# Projekt: $PROJECT

> [!info] Metadata
> **Cesta:** \`$CWD\`
> **Git větev:** \`$GIT_BRANCH\`
> **Vytvořeno:** $DATE

## Historie sezení

PROJ
fi

echo "- [[Denní zápisky/$DATE|$DATE $TIME]] #$PROJECT" >> "$PROJECT_NOTE"

# === Git log soubor ===
if [ -n "$GIT_COMMITS" ]; then
    GIT_LOG_FILE="$CLAUDE_DIR/Git logy/$PROJECT.md"
    if [ ! -f "$GIT_LOG_FILE" ]; then
        cat > "$GIT_LOG_FILE" << GITHEAD
---
projekt: $PROJECT
tagy:
  - claude/git-log
  - projekt/$PROJECT
---

# Git log — $PROJECT

GITHEAD
    fi
    cat >> "$GIT_LOG_FILE" << GITENTRY

## $DATE $TIME | Větev: \`$GIT_BRANCH\`

$GIT_COMMITS

GITENTRY
fi

echo "✅ Obsidian sync dokončen: $DAILY_NOTE"
