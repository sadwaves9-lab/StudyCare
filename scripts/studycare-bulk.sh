#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  StudyCare BULK Import Tool v3
#  Import questions/notes from text files
# ============================================================

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT="$ROOT/content"
TMPD="${TMPDIR:-$PREFIX/tmp}"
mkdir -p "$TMPD"

G='\033[0;32m'; C='\033[0;36m'; Y='\033[1;33m'; R='\033[0;31m'; N='\033[0m'

banner() {
  echo -e "${C}"
  echo "  ╔══════════════════════════════════╗"
  echo "  ║   📚  StudyCare BULK Import v3   ║"
  echo "  ╚══════════════════════════════════╝"
  echo -e "${N}"
}

command -v jq >/dev/null 2>&1 || pkg install jq -y >/dev/null 2>&1

# ─────────────────────────────────────────────────
#  PARSE QUESTIONS
# ─────────────────────────────────────────────────
parse_questions() {
  local FILE="$1"
  echo -e "${Y}▶ Parsing $FILE...${N}"

  awk '
    BEGIN { RS="---"; FS="\n" }
    NF > 1 {
      cclass=""; cset=""; csubj=""; cchap=""; cq=""; coa=""; cob=""; coc=""; cod=""; cans=""; cexp=""
      for (i=1; i<=NF; i++) {
        line = $i
        gsub(/^[ \t]+|[ \t]+$/, "", line)
        if (line ~ /^Class:/)   { cclass = substr(line, 7); gsub(/^ +| +$/, "", cclass) }
        if (line ~ /^Set:/)     { cset   = substr(line, 5); gsub(/^ +| +$/, "", cset) }
        if (line ~ /^Subject:/) { csubj  = substr(line, 9); gsub(/^ +| +$/, "", csubj) }
        if (line ~ /^Chapter:/) { cchap  = substr(line, 9); gsub(/^ +| +$/, "", cchap) }
        if (line ~ /^Q:/)       { cq     = substr(line, 3); gsub(/^ +| +$/, "", cq) }
        if (line ~ /^A:/)       { coa    = substr(line, 3); gsub(/^ +| +$/, "", coa) }
        if (line ~ /^B:/)       { cob    = substr(line, 3); gsub(/^ +| +$/, "", cob) }
        if (line ~ /^C:/)       { coc    = substr(line, 3); gsub(/^ +| +$/, "", coc) }
        if (line ~ /^D:/)       { cod    = substr(line, 3); gsub(/^ +| +$/, "", cod) }
        if (line ~ /^Ans:/)     { cans   = substr(line, 5); gsub(/^ +| +$/, "", cans) }
        if (line ~ /^Exp:/)     { cexp   = substr(line, 5); gsub(/^ +| +$/, "", cexp) }
      }
      if (cq != "" && cclass != "" && csubj != "" && coa != "") {
        printf("%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s\n", cclass, cset, csubj, cchap, cq, coa, cob, coc, cod, cans, cexp)
      }
    }
  ' "$FILE" > "$TMPD/bulk_q.txt"

  local COUNT=$(wc -l < "$TMPD/bulk_q.txt" | tr -d ' ')
  echo -e "${C}Found $COUNT questions${N}"

  if [ "$COUNT" = "0" ]; then
    echo -e "${R}✗ Koi valid question nahi mila${N}"
    return 1
  fi

  local ADDED=0
  while IFS='|' read -r cclass cset csubj cchap cq coa cob coc cod cans cexp; do
    [ -z "$cq" ] && continue
    [ -z "$cans" ] && cans="A"

    local TMPJ="$TMPD/tmp_$$.json"
    jq --arg cl "$cclass" --arg st "$cset" --arg sj "$csubj" --arg ch "$cchap" \
       --arg q "$cq" --arg oa "$coa" --arg ob "$cob" --arg oc "$coc" --arg od "$cod" \
       --arg a "$cans" --arg e "$cexp" \
       '.questions += [{
          id: ("q_" + (now|tostring|gsub("\\.";"")) + "_" + ((.questions|length)|tostring)),
          class: $cl, set: $st,
          subject: $sj, chapter: $ch,
          question: $q,
          options: [$oa,$ob,$oc,$od],
          answer: $a, explanation: $e,
          createdAt: (now|todate)
       }]' "$CONTENT/questions.json" > "$TMPJ" && mv "$TMPJ" "$CONTENT/questions.json"

    ADDED=$((ADDED + 1))
  done < "$TMPD/bulk_q.txt"

  echo -e "${G}✓ Imported $ADDED questions${N}"
  echo -e "${C}Total questions: $(jq '.questions|length' "$CONTENT/questions.json")${N}"
}

# ─────────────────────────────────────────────────
#  PARSE NOTES
# ─────────────────────────────────────────────────
parse_notes() {
  local FILE="$1"
  echo -e "${Y}▶ Parsing notes...${N}"

  awk '
    BEGIN { RS="===NOTE==="; FS="\n" }
    NR > 1 {
      cclass=""; cset=""; csubj=""; cchap=""; ctitle=""; ckey=""; cbody=""
      inbody=0
      for (i=1; i<=NF; i++) {
        line = $i
        if (line ~ /^===END===/) { inbody=0; continue }
        if (inbody) { cbody = cbody line "\n"; continue }
        if (line ~ /^Body:/) { inbody=1; continue }
        if (line ~ /^Class:/)    { cclass = substr(line, 7); gsub(/^ +| +$/, "", cclass) }
        if (line ~ /^Set:/)      { cset   = substr(line, 5); gsub(/^ +| +$/, "", cset) }
        if (line ~ /^Subject:/)  { csubj  = substr(line, 9); gsub(/^ +| +$/, "", csubj) }
        if (line ~ /^Chapter:/)  { cchap  = substr(line, 9); gsub(/^ +| +$/, "", cchap) }
        if (line ~ /^Title:/)    { ctitle = substr(line, 7); gsub(/^ +| +$/, "", ctitle) }
        if (line ~ /^KeyTerms:/) { ckey   = substr(line, 10); gsub(/^ +| +$/, "", ckey) }
      }
      if (ctitle != "" && cclass != "" && csubj != "" && cbody != "") {
        gsub(/\|/, "\\|", cbody)
        gsub(/\n/, "\\n", cbody)
        printf("%s|%s|%s|%s|%s|%s|%s\n", cclass, cset, csubj, cchap, ctitle, ckey, cbody)
      }
    }
  ' "$FILE" > "$TMPD/bulk_n.txt"

  local COUNT=$(wc -l < "$TMPD/bulk_n.txt" | tr -d ' ')
  echo -e "${C}Found $COUNT notes${N}"

  if [ "$COUNT" = "0" ]; then
    echo -e "${R}✗ Koi valid note nahi mila${N}"
    return 1
  fi

  while IFS='|' read -r cclass cset csubj cchap ctitle ckey cbody; do
    [ -z "$ctitle" ] && continue

    cbody=$(printf '%b' "$cbody")

    KT_JSON=$(echo "$ckey" | awk -F',' '{
      printf "[";
      for(i=1;i<=NF;i++) {
        gsub(/^ +| +$/, "", $i);
        if (i>1) printf ",";
        printf "\"%s\"", $i
      }
      printf "]"
    }')

    local TMPJ="$TMPD/tmp_$$.json"
    jq --arg cl "$cclass" --arg st "$cset" --arg sj "$csubj" --arg ch "$cchap" \
       --arg t "$ctitle" --arg b "$cbody" --argjson kt "$KT_JSON" \
       '.notes += [{
          id: ("n_" + (now|tostring|gsub("\\.";"")) + "_" + ((.notes|length)|tostring)),
          class: $cl, set: $st,
          subject: $sj, chapter: $ch,
          title: $t, keyTerms: $kt, body: $b,
          createdAt: (now|todate)
       }]' "$CONTENT/notes.json" > "$TMPJ" && mv "$TMPJ" "$CONTENT/notes.json"
  done < "$TMPD/bulk_n.txt"

  echo -e "${G}✓ Total notes: $(jq '.notes|length' "$CONTENT/notes.json")${N}"
}

# ─────────────────────────────────────────────────
#  IMPORT AUTO-DETECT
# ─────────────────────────────────────────────────
import_file() {
  local FILE="$1"
  banner

  if [ -z "$FILE" ]; then
    echo -e "${R}✗ File path do${N}"
    echo "  Usage: bash scripts/studycare-bulk.sh i ~/question-template.txt"
    exit 1
  fi

  if [ ! -f "$FILE" ]; then
    echo -e "${R}✗ File nahi mila: $FILE${N}"
    exit 1
  fi

  if grep -q "===NOTE===" "$FILE"; then
    parse_notes "$FILE"
  else
    parse_questions "$FILE"
  fi
}

# ─────────────────────────────────────────────────
#  TEMPLATE
# ─────────────────────────────────────────────────
make_template() {
  local TYPE="${1:-question}"
  banner

  if [ "$TYPE" = "question" ] || [ "$TYPE" = "q" ]; then
    cat > ~/question-template.txt << 'EOF'
---
Class: 9
Set: A
Subject: science
Chapter: Motion
Q: Speed ka formula kya hai?
A: Distance / Time
B: Time / Distance
C: Distance × Time
D: Distance + Time
Ans: A
Exp: Speed = distance divided by time
---
Class: 10
Set: A
Subject: math
Chapter: Quadratic Equations
Q: x² - 5x + 6 = 0 ke roots?
A: 1, 6
B: 2, 3
C: -2, -3
D: 1, 5
Ans: B
Exp: (x-2)(x-3)=0, so x=2 or x=3
---
EOF
    echo -e "${G}✓ Template: ~/question-template.txt${N}"
    echo ""
    echo -e "${Y}Format:${N}"
    echo "  - Questions '---' se separate"
    echo "  - Fields: Class, Set, Subject, Chapter, Q, A, B, C, D, Ans, Exp"

  elif [ "$TYPE" = "note" ] || [ "$TYPE" = "n" ]; then
    cat > ~/note-template.txt << 'EOF'
===NOTE===
Class: 12
Set: A
Subject: physics
Chapter: Electrostatics
Title: Coulomb Law
KeyTerms: Charge, Force, Distance
Body:
## Coulomb Law
**F = k q₁ q₂ / r²**

- **F** = Force (Newton)
- **k** = 9 × 10⁹ N·m²/C²
- **r** = Distance (meter)

__Force__ is inversely proportional to square of distance.
**Remember**: Same charge → repulsion.
===END===
EOF
    echo -e "${G}✓ Template: ~/note-template.txt${N}"
    echo ""
    echo -e "${Y}Format:${N}"
    echo "  - Notes '===NOTE===' se start, '===END===' se finish"
    echo "  - **bold** → yellow highlight"
    echo "  - __italic__ → cyan key term"
    echo "  - ## Heading → section"
  fi
}

# ─────────────────────────────────────────────────
#  VERIFY
# ─────────────────────────────────────────────────
verify_content() {
  banner
  echo -e "${C}📊 Content Status:${N}"
  echo ""

  echo -e "${Y}Questions by class:${N}"
  jq -r '.questions | group_by(.class) | .[] | "  Class \(.[0].class): \(length)"' \
     "$CONTENT/questions.json" 2>/dev/null || echo "  (none)"

  echo ""
  echo -e "${Y}Notes by class:${N}"
  jq -r '.notes | group_by(.class) | .[] | "  Class \(.[0].class): \(length)"' \
     "$CONTENT/notes.json" 2>/dev/null || echo "  (none)"

  echo ""
  echo -e "${C}Totals:${N}"
  echo "  Questions: $(jq '.questions|length' "$CONTENT/questions.json" 2>/dev/null || echo 0)"
  echo "  Notes:     $(jq '.notes|length' "$CONTENT/notes.json" 2>/dev/null || echo 0)"
  echo "  Tests:     $(jq '.tests|length' "$CONTENT/tests.json" 2>/dev/null || echo 0)"
}

# ─────────────────────────────────────────────────
case "${1:-help}" in
  import|i)   import_file "$2" ;;
  template|t) make_template "$2" ;;
  verify|v)   verify_content ;;
  *)
    banner
    echo "Commands:"
    echo "  bash scripts/studycare-bulk.sh i <file>     → import"
    echo "  bash scripts/studycare-bulk.sh t q          → question template"
    echo "  bash scripts/studycare-bulk.sh t n          → note template"
    echo "  bash scripts/studycare-bulk.sh v            → verify content"
    echo ""
    echo "Alias banao:"
    echo "  echo \"alias scbulk='bash ~/StudyCare/scripts/studycare-bulk.sh'\" >> ~/.bashrc"
    echo "  source ~/.bashrc"
    echo ""
    echo "  Phir:"
    echo "    scbulk t q"
    echo "    scbulk i ~/question-template.txt"
    echo "    scbulk v"
    ;;
esac
