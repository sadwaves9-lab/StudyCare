#!/data/data/com.termux/files/usr/bin/bash
# ============================================
#  StudyCare Content CLI v3
#  Class + Set + Subject + Validation
# ============================================

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT="$ROOT/content"

G='\033[0;32m'; C='\033[0;36m'; Y='\033[1;33m'; R='\033[0;31m'; M='\033[0;35m'; N='\033[0m'

banner() {
  echo -e "${C}"
  echo "  ╔══════════════════════════════════╗"
  echo "  ║   📚  StudyCare Content CLI v3   ║"
  echo "  ╚══════════════════════════════════╝"
  echo -e "${N}"
}

command -v jq >/dev/null || pkg install jq -y >/dev/null 2>&1

init_content() {
  mkdir -p "$CONTENT"
  [ -f "$CONTENT/questions.json" ] || echo '{ "version": 1, "questions": [] }' > "$CONTENT/questions.json"
  [ -f "$CONTENT/notes.json" ]     || echo '{ "version": 1, "notes": [] }'     > "$CONTENT/notes.json"
  [ -f "$CONTENT/tests.json" ]     || echo '{ "version": 1, "tests": [] }'     > "$CONTENT/tests.json"
}
init_content

# ---------- Sanitize helper ----------
clean() {
  # Remove \r, \n, \t, leading/trailing spaces, limit length
  echo "$1" | tr -d '\r\n\t' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | head -c "${2:-200}"
}

# ---------- Validate no weird input ----------
has_bad() {
  echo "$1" | grep -qE '#|studycare |studycare$|npx |expo |push$|^$'
}

# ---------- Smart prompt with validation ----------
prompt_class() {
  while true; do
    read -p "Class (9/10/11/12): " c
    c=$(clean "$c" 2)
    case "$c" in 9|10|11|12) echo "$c"; return ;; *) echo -e "${R}✗ Only 9/10/11/12 allowed${N}" >&2 ;; esac
  done
}

prompt_set() {
  while true; do
    read -p "Set (A/B/C/D) [A]: " s
    s=$(clean "$s" 1 | tr 'a-z' 'A-Z')
    [ -z "$s" ] && s="A"
    case "$s" in A|B|C|D) echo "$s"; return ;; *) echo -e "${R}✗ Only A/B/C/D allowed${N}" >&2 ;; esac
  done
}

prompt_answer() {
  while true; do
    read -p "Correct (A/B/C/D): " a
    a=$(clean "$a" 1 | tr 'a-z' 'A-Z')
    case "$a" in A|B|C|D) echo "$a"; return ;; *) echo -e "${R}✗ Only A/B/C/D${N}" >&2 ;; esac
  done
}

prompt_safe() {
  # $1=label, $2=max_len, $3=required(y/n)
  local label="$1" maxlen="${2:-200}" required="${3:-y}"
  while true; do
    read -p "$label" val
    val=$(clean "$val" "$maxlen")
    if [ "$required" = "y" ] && [ -z "$val" ]; then
      echo -e "${R}✗ Yeh field zaroori hai${N}" >&2
      continue
    fi
    if has_bad "$val"; then
      echo -e "${R}✗ Invalid characters (#, npx, expo etc). Dobara try karo.${N}" >&2
      continue
    fi
    echo "$val"; return
  done
}

# ---------- ADD QUESTION ----------
add_question() {
  banner
  echo -e "${Y}▶ Naya Question${N}"

  CLASS=$(prompt_class)
  SET=$(prompt_set)
  SUBJECT=$(prompt_safe "Subject (Physics/Chemistry/Mathematics/Biology): " 30)
  CHAPTER=$(prompt_safe "Chapter: " 50)
  QUESTION=$(prompt_safe "Question: " 500)
  OA=$(prompt_safe "Option A: " 200)
  OB=$(prompt_safe "Option B: " 200)
  OC=$(prompt_safe "Option C: " 200)
  OD=$(prompt_safe "Option D: " 200)
  ANS=$(prompt_answer)
  EXP=$(prompt_safe "Explanation: " 500 "n")

  echo ""
  echo -e "${M}┌─ Summary ────────────────────────┐${N}"
  echo -e "${M}│${N} Class+Set:  $CLASS-$SET"
  echo -e "${M}│${N} Subject:    $SUBJECT"
  echo -e "${M}│${N} Chapter:    $CHAPTER"
  echo -e "${M}│${N} Question:   $QUESTION"
  echo -e "${M}│${N} Answer:     $ANS"
  echo -e "${M}└──────────────────────────────────┘${N}"
  read -p "Save? (Y/n): " ok
  case "$ok" in n|N) echo -e "${Y}Cancelled${N}"; return 0 ;; esac

  TMP=$(mktemp)
  jq --arg cl "$CLASS" --arg st "$SET" --arg s "$SUBJECT" --arg c "$CHAPTER" \
     --arg q "$QUESTION" \
     --arg oa "$OA" --arg ob "$OB" --arg oc "$OC" --arg od "$OD" \
     --arg a "$ANS" --arg e "$EXP" \
     '.questions += [{
        id: ("q_" + (now|tostring|gsub("\\.";""))),
        class: $cl, set: $st,
        subject: $s, chapter: $c,
        question: $q,
        options: [$oa,$ob,$oc,$od],
        answer: $a, explanation: $e,
        createdAt: (now|todate)
     }]' "$CONTENT/questions.json" > "$TMP" && mv "$TMP" "$CONTENT/questions.json"

  echo -e "${G}✓ Total questions: $(jq '.questions|length' "$CONTENT/questions.json")${N}"
}

# ---------- ADD NOTE ----------
add_note() {
  banner
  echo -e "${Y}▶ Naya Note${N}"

  CLASS=$(prompt_class)
  SET=$(prompt_set)
  SUBJECT=$(prompt_safe "Subject: " 30)
  CHAPTER=$(prompt_safe "Chapter: " 50)
  TITLE=$(prompt_safe "Title: " 100)
  echo "Content (multi-line, Ctrl+D to finish):"
  BODY=$(cat)

  if [ -z "$BODY" ]; then
    echo -e "${R}✗ Body khali hai${N}"; return 1
  fi

  echo ""
  echo -e "${M}┌─ Summary ────────────────────────┐${N}"
  echo -e "${M}│${N} Class+Set:  $CLASS-$SET"
  echo -e "${M}│${N} Subject:    $SUBJECT"
  echo -e "${M}│${N} Title:      $TITLE"
  echo -e "${M}└──────────────────────────────────┘${N}"
  read -p "Save? (Y/n): " ok
  case "$ok" in n|N) echo -e "${Y}Cancelled${N}"; return 0 ;; esac

  TMP=$(mktemp)
  jq --arg cl "$CLASS" --arg st "$SET" --arg s "$SUBJECT" \
     --arg c "$CHAPTER" --arg t "$TITLE" --arg b "$BODY" \
     '.notes += [{
        id: ("n_" + (now|tostring|gsub("\\.";""))),
        class: $cl, set: $st,
        subject: $s, chapter: $c,
        title: $t, body: $b,
        createdAt: (now|todate)
     }]' "$CONTENT/notes.json" > "$TMP" && mv "$TMP" "$CONTENT/notes.json"

  echo -e "${G}✓ Total notes: $(jq '.notes|length' "$CONTENT/notes.json")${N}"
}

# ---------- ADD TEST ----------
add_test() {
  banner
  echo -e "${Y}▶ Naya Test${N}"

  NAME=$(prompt_safe "Test name: " 100)
  CLASS=$(prompt_class)
  SET=$(prompt_set)
  SUBJECT=$(prompt_safe "Subject: " 30)

  while true; do
    read -p "Date (YYYY-MM-DD) [$(date '+%Y-%m-%d')]: " DATE
    DATE=$(clean "$DATE" 10)
    [ -z "$DATE" ] && DATE=$(date '+%Y-%m-%d')
    if echo "$DATE" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then break; fi
    echo -e "${R}✗ Format YYYY-MM-DD hona chahiye${N}"
  done

  while true; do
    read -p "Time (HH:MM 24h): " TIME
    TIME=$(clean "$TIME" 5)
    if echo "$TIME" | grep -qE '^[0-9]{1,2}:[0-9]{2}$'; then break; fi
    echo -e "${R}✗ Format HH:MM hona chahiye${N}"
  done

  while true; do
    read -p "Duration (minutes) [30]: " DUR
    DUR=$(clean "$DUR" 3)
    [ -z "$DUR" ] && DUR=30
    if echo "$DUR" | grep -qE '^[0-9]+$'; then break; fi
    echo -e "${R}✗ Number hona chahiye${N}"
  done

  echo ""
  echo -e "${M}┌─ Summary ────────────────────────┐${N}"
  echo -e "${M}│${N} Name:       $NAME"
  echo -e "${M}│${N} Class+Set:  $CLASS-$SET"
  echo -e "${M}│${N} Subject:    $SUBJECT"
  echo -e "${M}│${N} Date:       $DATE"
  echo -e "${M}│${N} Time:       $TIME"
  echo -e "${M}│${N} Duration:   ${DUR}m"
  echo -e "${M}└──────────────────────────────────┘${N}"
  read -p "Save? (Y/n): " ok
  case "$ok" in n|N) echo -e "${Y}Cancelled${N}"; return 0 ;; esac

  TMP=$(mktemp)
  jq --arg cl "$CLASS" --arg st "$SET" --arg n "$NAME" --arg s "$SUBJECT" \
     --arg d "$DATE" --arg t "$TIME" --arg du "$DUR" \
     '.tests += [{
        id: ("t_" + (now|tostring|gsub("\\.";""))),
        name: $n,
        class: $cl, set: $st, subject: $s,
        date: $d, time: $t,
        duration: ($du|tonumber),
        notified: false,
        createdAt: (now|todate)
     }]' "$CONTENT/tests.json" > "$TMP" && mv "$TMP" "$CONTENT/tests.json"

  echo -e "${G}✓ Total tests: $(jq '.tests|length' "$CONTENT/tests.json")${N}"
}

# ---------- PUSH ----------
push() {
  banner
  cd "$ROOT"
  if [ ! -d .git ]; then
    echo -e "${R}✗ Git repo nahi hai${N}"; exit 1
  fi
  git add content/
  git commit -m "content: update $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "No changes"
  git push 2>&1 | tail -3
  echo -e "${G}✓ Pushed! App me pull-to-refresh karo.${N}"
}

# ---------- LIST ----------
list() {
  banner
  Q=$(jq '.questions|length' "$CONTENT/questions.json" 2>/dev/null || echo 0)
  N=$(jq '.notes|length' "$CONTENT/notes.json" 2>/dev/null || echo 0)
  T=$(jq '.tests|length' "$CONTENT/tests.json" 2>/dev/null || echo 0)

  echo -e "${C}┌──────────────────────────────────┐${N}"
  echo -e "${C}│${N} Questions: ${G}$Q${N}"
  echo -e "${C}│${N} Notes:     ${G}$N${N}"
  echo -e "${C}│${N} Tests:     ${G}$T${N}"
  echo -e "${C}└──────────────────────────────────┘${N}"
  echo ""

  echo -e "${Y}📌 Latest Question:${N}"
  jq -r '.questions[-1] // empty | "  [C\(.class // "?")-\(.set // "?")] \(.subject): \(.question)"' \
     "$CONTENT/questions.json" 2>/dev/null | cut -c1-90
  echo ""

  echo -e "${Y}📌 Latest Note:${N}"
  jq -r '.notes[-1] // empty | "  [C\(.class // "?")-\(.set // "?")] \(.subject): \(.title)"' \
     "$CONTENT/notes.json" 2>/dev/null | cut -c1-90
  echo ""

  echo -e "${Y}📌 Latest Test:${N}"
  jq -r '.tests[-1] // empty | "  [C\(.class // "?")-\(.set // "?")] \(.name) — \(.date) \(.time)"' \
     "$CONTENT/tests.json" 2>/dev/null | cut -c1-90
  echo ""
}

# ---------- DELETE LAST ----------
delete_last_question() {
  banner
  TMP=$(mktemp)
  jq '.questions = .questions[:-1]' "$CONTENT/questions.json" > "$TMP" && mv "$TMP" "$CONTENT/questions.json"
  echo -e "${G}✓ Last question deleted. Total: $(jq '.questions|length' "$CONTENT/questions.json")${N}"
}

delete_last_note() {
  banner
  TMP=$(mktemp)
  jq '.notes = .notes[:-1]' "$CONTENT/notes.json" > "$TMP" && mv "$TMP" "$CONTENT/notes.json"
  echo -e "${G}✓ Last note deleted. Total: $(jq '.notes|length' "$CONTENT/notes.json")${N}"
}

delete_last_test() {
  banner
  TMP=$(mktemp)
  jq '.tests = .tests[:-1]' "$CONTENT/tests.json" > "$TMP" && mv "$TMP" "$CONTENT/tests.json"
  echo -e "${G}✓ Last test deleted. Total: $(jq '.tests|length' "$CONTENT/tests.json")${N}"
}

# ---------- FIND CORRUPTED (safety check) ----------
find_corrupted() {
  banner
  echo -e "${Y}🔍 Checking for corrupted entries...${N}"
  echo ""
  
  # Questions
  echo -e "${C}Questions with bad subject (contains # or newline or npx):${N}"
  jq -r '.questions[] | select(.subject | test("#|\\n|npx|expo")) | "  \(.id): \(.subject[0:60])"' \
     "$CONTENT/questions.json" 2>/dev/null || echo "  none"
  echo ""
  
  # Long subjects
  echo -e "${C}Questions with subject > 40 chars:${N}"
  jq -r '.questions[] | select(.subject | length > 40) | "  \(.id): \(.subject[0:60])"' \
     "$CONTENT/questions.json" 2>/dev/null || echo "  none"
  echo ""
  
  echo -e "${G}✓ Check complete${N}"
  echo -e "${Y}Tip: Manually remove corrupted entries by ID:${N}"
  echo "  jq 'del(.questions[] | select(.id == \"q_xxx\"))' content/questions.json > tmp && mv tmp content/questions.json"
}

# ---------- HELP ----------
help_msg() {
  banner
  echo -e "${Y}Content add:${N}"
  echo "  aq / add-question       → naya MCQ (class+set+subject)"
  echo "  an / add-note           → naya note"
  echo "  at / add-test           → test schedule"
  echo ""
  echo -e "${Y}Manage:${N}"
  echo "  ls / list               → counts + latest 3 items"
  echo "  dlq                     → last question delete"
  echo "  dln                     → last note delete"
  echo "  dlt                     → last test delete"
  echo "  fc / find-corrupted     → corrupted entries check"
  echo ""
  echo -e "${Y}Sync:${N}"
  echo "  p  / push               → GitHub push (app me aayega)"
  echo ""
  echo -e "${Y}Workflow:${N}"
  echo "  1. studycare aq   → question add"
  echo "  2. studycare ls   → verify"
  echo "  3. studycare p    → push"
  echo "  4. App me pull-refresh"
}

# ---------- ROUTER ----------
case "${1:-help}" in
  add-question|aq)   add_question ;;
  add-note|an)       add_note ;;
  add-test|at)       add_test ;;
  push|p)            push ;;
  list|ls)           list ;;
  delete-last-q|dlq) delete_last_question ;;
  delete-last-n|dln) delete_last_note ;;
  delete-last-t|dlt) delete_last_test ;;
  find-corrupted|fc) find_corrupted ;;
  help|--help|-h)    help_msg ;;
  *) help_msg ;;
esac
