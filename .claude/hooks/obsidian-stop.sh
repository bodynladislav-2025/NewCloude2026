#!/bin/bash
# Automatický zápis Claude sezení do Obsidianu
# Spouští se po každém ukončení Claude sezení (Stop hook)

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
CLAUDE_DIR="$VAULT/Claude"

# Pokud vault neexistuje (web prostředí), zapsat do projektu jako fallback
if [ ! -d "$VAULT" ]; then
    CLAUDE_DIR="$CLAUDE_PROJECT_DIR/.claude/obsidian-export"
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAILY_DIR="$CLAUDE_DIR/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"

mkdir -p "$DAILY_DIR"
mkdir -p "$CLAUDE_DIR/Projekty"
mkdir -p "$CLAUDE_DIR/Git logy"

# Načíst vstup z hooku
INPUT=$(cat)

# Parsovat cestu k transkriptu a pracovní složku
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

PROJECT=$(basename "$CWD" 2>/dev/null || echo "neznámý")
SESSION_ID=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('session_id', 'neznámé')[:8])
except:
    print('neznámé')
" 2>/dev/null || echo "neznámé")

# Git informace
GIT_LOG=""
GIT_DIFF_STATS=""
GIT_BRANCH=""

if [ -n "$CWD" ] && [ -d "$CWD/.git" ]; then
    GIT_BRANCH=$(cd "$CWD" && git branch --show-current 2>/dev/null || echo "neznámá")
    GIT_LOG=$(cd "$CWD" && git log --oneline --since="8 hours ago" --format="- %s (%h)" 2>/dev/null | head -10 || echo "")
    GIT_DIFF_STATS=$(cd "$CWD" && git diff --stat HEAD~1 HEAD 2>/dev/null | tail -5 || echo "")
fi

# Parsovat transkript - extrahovat co se dělalo
AKCE=""
SOUBORY_ZMENENY=""

if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    AKCE=$(python3 -c "
import json, sys, re

messages = []
tool_uses = []

try:
    with open('$TRANSCRIPT_PATH', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                msg_type = data.get('type', '')

                # Textové zprávy asistenta
                if msg_type == 'assistant':
                    content = data.get('message', {}).get('content', [])
                    for block in content:
                        if isinstance(block, dict):
                            if block.get('type') == 'text':
                                text = block.get('text', '').strip()
                                if len(text) > 30 and not text.startswith('#'):
                                    messages.append(text[:300])
                            elif block.get('type') == 'tool_use':
                                tool_name = block.get('name', '')
                                tool_input = block.get('input', {})
                                if tool_name in ['Edit', 'Write']:
                                    fp = tool_input.get('file_path', '')
                                    if fp:
                                        tool_uses.append(f'Upraveno: {fp}')
                                elif tool_name == 'Bash':
                                    cmd = tool_input.get('command', '')[:80]
                                    tool_uses.append(f'Příkaz: {cmd}')
            except:
                pass
except:
    pass

# Poslední 3 zprávy asistenta
result = []
if messages:
    result.append('### Shrnutí aktivity')
    for m in messages[-3:]:
        clean = m.replace('\n', ' ').strip()
        result.append(f'- {clean}')

if tool_uses:
    result.append('')
    result.append('### Provedené akce')
    seen = []
    for t in tool_uses:
        if t not in seen:
            seen.append(t)
            result.append(f'- {t}')
        if len(seen) >= 15:
            break

print('\n'.join(result))
" 2>/dev/null || echo "- Sezení bez detailů")
fi

# Vytvořit nebo aktualizovat denní zápisek
if [ ! -f "$DAILY_NOTE" ]; then
    cat > "$DAILY_NOTE" << HEADER
---
datum: $DATE
typ: claude-denní-log
projekt: $PROJECT
---

# Claude zápisky — $DATE

HEADER
fi

# Přidat sezení do denního zápisku
cat >> "$DAILY_NOTE" << SESSION

---

## 🤖 Sezení $TIME | $PROJECT

| Pole | Hodnota |
|------|---------|
| **Čas** | $DATE $TIME |
| **Projekt** | $PROJECT |
| **Session ID** | $SESSION_ID |
| **Git větev** | ${GIT_BRANCH:-N/A} |
| **Cesta** | $CWD |

$AKCE

$(if [ -n "$GIT_LOG" ]; then
echo "### Git commity (posledních 8h)"
echo "\`\`\`"
echo "$GIT_LOG"
echo "\`\`\`"
fi)

$(if [ -n "$GIT_DIFF_STATS" ]; then
echo "### Změněné soubory"
echo "\`\`\`"
echo "$GIT_DIFF_STATS"
echo "\`\`\`"
fi)

SESSION

# Aktualizovat projektový přehled
PROJECT_NOTE="$CLAUDE_DIR/Projekty/$PROJECT.md"
if [ ! -f "$PROJECT_NOTE" ]; then
    cat > "$PROJECT_NOTE" << PROJ
---
projekt: $PROJECT
cesta: $CWD
vytvořeno: $DATE
---

# Projekt: $PROJECT

**Cesta:** \`$CWD\`
**Větev:** $GIT_BRANCH

## Historie sezení

PROJ
fi

echo "- [[Denní zápisky/$DATE|$DATE $TIME]] — $PROJECT" >> "$PROJECT_NOTE"

# Git log soubor
GIT_LOG_FILE="$CLAUDE_DIR/Git logy/$PROJECT-git.md"
if [ -n "$GIT_LOG" ]; then
    if [ ! -f "$GIT_LOG_FILE" ]; then
        echo "# Git log — $PROJECT" > "$GIT_LOG_FILE"
        echo "" >> "$GIT_LOG_FILE"
    fi
    echo "## $DATE $TIME" >> "$GIT_LOG_FILE"
    echo "$GIT_LOG" >> "$GIT_LOG_FILE"
    echo "" >> "$GIT_LOG_FILE"
fi

echo "✅ Obsidian sync hotov: $DAILY_NOTE"
