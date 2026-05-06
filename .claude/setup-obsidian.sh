#!/bin/bash
# Jednorázový setup - spusť na svém Macu:
# bash .claude/setup-obsidian.sh

VAULT="/Users/ladislavbodyn/Desktop/Obsidian_2026"

echo "🔧 Nastavuji Obsidian strukturu pro Claude integraci..."

mkdir -p "$VAULT/Claude/Denní zápisky"
mkdir -p "$VAULT/Claude/Projekty"
mkdir -p "$VAULT/Claude/Git logy"
mkdir -p "$VAULT/Claude/Šablony"

# Hlavní README
cat > "$VAULT/Claude/README.md" << 'EOF'
# Claude Code — Automatické zápisky

Tato složka je automaticky spravována Claude Code hooky.

## Struktura

| Složka | Obsah |
|--------|-------|
| `Denní zápisky/` | Každodenní logy Claude sezení |
| `Projekty/` | Přehled aktivních projektů |
| `Git logy/` | Historie git commitů z Claude sezení |
| `Šablony/` | Šablony pro zápisky |

## Jak to funguje

1. **SessionStart hook** — při startu Claude sezení zapíše začátek do denního zápisku
2. **Stop hook** — po ukončení sezení zapíše:
   - Co Claude dělal (shrnutí aktivit)
   - Jaké soubory byly upraveny
   - Git commity z posledních 8 hodin
   - Odkaz do projektového přehledu

## Nastavení
- Projekt: `NewCloude2026`
- Hook soubory: `.claude/hooks/`
- Vault: `/Users/ladislavbodyn/Desktop/Obsidian_2026`

EOF

# Šablona denního zápisku
cat > "$VAULT/Claude/Šablony/denní-záznam.md" << 'EOF'
---
datum: {{date}}
typ: claude-denní-log
---

# Claude zápisky — {{date}}

▶️ **Sezení zahájeno** {{time}}

---

## Sezení {{time}} | {{projekt}}

| Pole | Hodnota |
|------|---------|
| **Čas** | {{datetime}} |
| **Projekt** | {{projekt}} |
| **Git větev** | {{větev}} |

### Shrnutí aktivity
-

### Provedené akce
-

### Git commity
-

EOF

# Profil uživatele (pokud neexistuje)
PROFILE="$VAULT/Claude/Profil.md"
if [ ! -f "$PROFILE" ]; then
cat > "$PROFILE" << 'EOF'
---
typ: uživatelský-profil
vlastník: Ladislav Bodyn
---

# Profil — Ladislav Bodyn

## Osobní informace
- **Jméno:** Ladislav Bodyn
- **Vault:** /Users/ladislavbodyn/Desktop/Obsidian_2026

## Pracovní styl
- Preferuje stručné odpovědi
- Chce hotové řešení
- Pracuje ve webovém prostředí Claude Code

## Aktivní projekty
- [[Projekty/NewCloude2026|NewCloude2026]]

## Technologie
- Frontend: React, Vite, JavaScript
- Verzování: Git, GitHub
- Nástroje: Claude Code, Obsidian

## Preference
- Komunikace česky
- Vždy zapisovat výsledky do Obsidianu
- Denní přehled aktivit

## Osobní poznámky
<!-- Sem si piš poznámky pro Claude -->

EOF
echo "✅ Vytvořen profil: $PROFILE"
fi

echo ""
echo "✅ Struktura Obsidianu připravena!"
echo ""
echo "Vytvořené složky:"
find "$VAULT/Claude" -type d | sort
echo ""
echo "Vytvořené soubory:"
find "$VAULT/Claude" -type f | sort
