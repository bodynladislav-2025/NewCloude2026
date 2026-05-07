#!/bin/bash
# Stop hook — zápis sezení do Obsidianu

set -euo pipefail

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"
CLAUDE_DIR="$VAULT/Claude"

if [ ! -d "$VAULT" ]; then
    CLAUDE_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/obsidian-export"
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAILY_DIR="$CLAUDE_DIR/Denní zápisky"
DAILY_NOTE="$DAILY_DIR/$DATE.md"
STATE_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/obsidian-state"

mkdir -p "$DAILY_DIR" "$CLAUDE_DIR/Projekty" "$CLAUDE_DIR/Git logy" "$STATE_DIR"

INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('session_id', '')[:8])
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

TRANSCRIPT_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('transcript_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

PROJECT=$(basename "$CWD" 2>/dev/null || echo "neznámý")
STATE_FILE="$STATE_DIR/$PROJECT.last_commit"

# === Git: pouze nové commity od posledního záznamu ===
GIT_BRANCH="N/A"
NEW_COMMITS=""

if [ -n "$CWD" ] && [ -d "$CWD/.git" ]; then
    GIT_BRANCH=$(cd "$CWD" && git branch --show-current 2>/dev/null || echo "N/A")

    LAST_COMMIT=""
    if [ -f "$STATE_FILE" ]; then
        LAST_COMMIT=$(cat "$STATE_FILE")
    fi

    if [ -n "$LAST_COMMIT" ]; then
        # Commity novější než poslední logovaný
        NEW_COMMITS=$(cd "$CWD" && git log --oneline "$LAST_COMMIT"..HEAD --format="- \`%h\` %s" 2>/dev/null | head -10 || echo "")
    else
        # První záznam — pouze commity z posledních 24h
        NEW_COMMITS=$(cd "$CWD" && git log --oneline --since="24 hours ago" --format="- \`%h\` %s" 2>/dev/null | head -10 || echo "")
    fi

    # Uložit aktuální HEAD jako nový referenční bod
    CURRENT_HEAD=$(cd "$CWD" && git rev-parse HEAD 2>/dev/null || echo "")
    if [ -n "$CURRENT_HEAD" ]; then
        echo "$CURRENT_HEAD" > "$STATE_FILE"
    fi
fi

# === Parsovat transkript ===
SUMMARY_LINES=""
FILES_EDITED=""

if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    PARSED=$(python3 << 'PYEOF'
import json, sys, os

transcript_path = os.environ.get('TRANSCRIPT_PATH', '')
summaries = []
files_edited = []

try:
    with open(transcript_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get('type') != 'assistant':
                    continue
                content = data.get('message', {}).get('content', [])
                for block in content:
                    if not isinstance(block, dict):
                        continue
                    btype = block.get('type', '')
                    if btype == 'text':
                        text = block.get('text', '').strip()
                        if len(text) > 60:
                            first = text.split('\n')[0][:150]
                            if first not in summaries:
                                summaries.append(first)
                    elif btype == 'tool_use' and block.get('name') in ('Edit', 'Write'):
                        fp = block.get('input', {}).get('file_path', '')
                        if fp and fp not in files_edited:
                            files_edited.append(fp)
            except:
                pass
except:
    pass

print('SUMMARIES_START')
for s in summaries[-3:]:
    print(f'- {s.replace("|", "/")}')
print('SUMMARIES_END')

print('FILES_START')
for f in files_edited[:8]:
    name = f.split('/')[-1]
    print(f'[[{f}|{name}]]')
print('FILES_END')
PYEOF
)

    export TRANSCRIPT_PATH
    PARSED=$(TRANSCRIPT_PATH="$TRANSCRIPT_PATH" python3 << 'PYEOF'
import json, sys, os

transcript_path = os.environ.get('TRANSCRIPT_PATH', '')
summaries = []
files_edited = []

try:
    with open(transcript_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get('type') != 'assistant':
                    continue
                content = data.get('message', {}).get('content', [])
                for block in content:
                    if not isinstance(block, dict):
                        continue
                    btype = block.get('type', '')
                    if btype == 'text':
                        text = block.get('text', '').strip()
                        if len(text) > 60:
                            first = text.split('\n')[0][:150]
                            if first not in summaries:
                                summaries.append(first)
                    elif btype == 'tool_use' and block.get('name') in ('Edit', 'Write'):
                        fp = block.get('input', {}).get('file_path', '')
                        if fp and fp not in files_edited:
                            files_edited.append(fp)
            except:
                pass
except:
    pass

print('SUMMARIES_START')
for s in summaries[-3:]:
    print(f'- {s.replace("|", "/")}')
print('SUMMARIES_END')

print('FILES_START')
for f in files_edited[:8]:
    name = f.split('/')[-1]
    print(f'[[{f}|{name}]]')
print('FILES_END')
PYEOF
)

    SUMMARY_LINES=$(echo "$PARSED" | awk '/SUMMARIES_START/{f=1;next}/SUMMARIES_END/{f=0}f')
    FILES_EDITED=$(echo "$PARSED" | awk '/FILES_START/{f=1;next}/FILES_END/{f=0}f' | tr '\n' ' ')
fi

# === Vytvořit denní zápisek pokud neexistuje ===
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

# === Sestavit blok sezení (čistý formát) ===
{
    echo ""
    echo "## $TIME | $PROJECT"
    echo ""
    echo "**Větev:** \`$GIT_BRANCH\`"

    if [ -n "$SUMMARY_LINES" ]; then
        echo "**Shrnutí:**"
        echo "$SUMMARY_LINES"
    fi

    if [ -n "$FILES_EDITED" ]; then
        echo "**Soubory:** $FILES_EDITED"
    fi

    if [ -n "$NEW_COMMITS" ]; then
        echo "**Commity:**"
        echo "$NEW_COMMITS"
    fi

    echo ""
} >> "$DAILY_NOTE"

# === Aktualizovat projektovou notu ===
PROJECT_NOTE="$CLAUDE_DIR/Projekty/$PROJECT.md"
if [ ! -f "$PROJECT_NOTE" ]; then
    cat > "$PROJECT_NOTE" << PROJ
---
projekt: $PROJECT
cesta: $CWD
vytvořeno: $DATE
tags: [projekt, dev]
---

# $PROJECT

**Cesta:** \`$CWD\`
**Git větev:** \`$GIT_BRANCH\`

## Sezení

PROJ
fi

# Přidat dnešní datum pouze jednou
if ! grep -q "$DATE" "$PROJECT_NOTE" 2>/dev/null; then
    echo "- [[Denní zápisky/$DATE|$DATE]]" >> "$PROJECT_NOTE"
fi

# === Git log — pouze nové commity ===
if [ -n "$NEW_COMMITS" ]; then
    GIT_LOG_FILE="$CLAUDE_DIR/Git logy/$PROJECT.md"
    if [ ! -f "$GIT_LOG_FILE" ]; then
        cat > "$GIT_LOG_FILE" << GITHEAD
---
projekt: $PROJECT
tags: [log, git]
---

# Git log — $PROJECT

GITHEAD
    fi

    # Přidat pouze pokud tyto commity ještě nejsou v souboru
    FIRST_COMMIT=$(echo "$NEW_COMMITS" | head -1 | grep -o '`[a-f0-9]\{7\}`' | tr -d '`' || echo "")
    if [ -z "$FIRST_COMMIT" ] || ! grep -q "$FIRST_COMMIT" "$GIT_LOG_FILE" 2>/dev/null; then
        {
            echo ""
            echo "## $DATE | \`$GIT_BRANCH\`"
            echo ""
            echo "$NEW_COMMITS"
            echo ""
        } >> "$GIT_LOG_FILE"
    fi
fi

echo "✅ Obsidian sync: $DAILY_NOTE"
