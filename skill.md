# Claude Code Skills / Plugins

Reference for available Claude Code skills in this project. Invoke with `/skill-name` in the prompt.

---

## `/frontend-design`
**Purpose:** Generate production-grade, polished frontend UI components and pages.
**Use when:** Building pharmacy UI — prescription forms, drug lookup, patient dashboards, inventory views.
**Example:** `/frontend-design create a prescription intake form with drug name autocomplete`

---

## `/simplify`
**Purpose:** Review recently changed code for quality, reuse, and efficiency, then fix issues found.
**Use when:** After writing a feature or fix and wanting a quality pass.
**Example:** `/simplify`

---

## `/claude-api`
**Purpose:** Build features using the Claude API or Anthropic SDK.
**Use when:** Adding AI-powered features — drug interaction warnings, prescription summarization, clinical note parsing.
**Example:** `/claude-api build a drug interaction checker using the Claude API`

---

## `/schedule`
**Purpose:** Create scheduled remote agents that run on a cron schedule.
**Use when:** Setting up automated tasks — nightly inventory reports, expiry date alerts, reorder reminders.
**Example:** `/schedule run inventory expiry check every day at 8am`

---

## `/loop`
**Purpose:** Run a prompt or slash command on a recurring interval within a session.
**Use when:** Polling a build, watching test output, or repeatedly checking a status during development.
**Example:** `/loop 5m check test results`

---

## `/update-config`
**Purpose:** Configure Claude Code behavior via `settings.json` — hooks, automated behaviors, defaults.
**Use when:** Setting up "before/after" automated behaviors or project-level Claude settings.
**Example:** `/update-config run linter before every commit`

---

## `/keybindings-help`
**Purpose:** Customize keyboard shortcuts for Claude Code.
**Use when:** Rebinding keys or adding chord shortcuts.
**Example:** `/keybindings-help rebind submit to ctrl+enter`

---

## `/notebooklm` ✅ Integrated
**Purpose:** Full programmatic access to Google NotebookLM — create notebooks, add sources (URLs, PDFs, YouTube, audio), chat, and generate artifacts.
**Status:** `notebooklm-py v0.3.4` installed. Run `notebooklm login` once to authenticate.
**Use when:** Pharmacy knowledge workflows — drug references, interaction research, compliance docs, study materials.

### Pharmacy-specific commands (via `notebooklm_pharmacy.py`)
| Command | What it does |
|---|---|
| `python notebooklm_pharmacy.py setup-drug-ref` | Notebook with DailyMed, FDA, MedlinePlus sources |
| `python notebooklm_pharmacy.py setup-interactions` | Notebook with web-researched drug interaction content |
| `python notebooklm_pharmacy.py setup-compliance` | Notebook with FDA CGMP, DEA schedules, CMS coverage docs |
| `python notebooklm_pharmacy.py ask "question"` | Chat with the active notebook |
| `python notebooklm_pharmacy.py podcast` | Generate audio overview |
| `python notebooklm_pharmacy.py quiz` | Generate pharmacology quiz (downloads as Markdown) |
| `python notebooklm_pharmacy.py study-guide` | Generate study guide report |
| `python notebooklm_pharmacy.py list` | List all notebooks |

### Direct CLI quick reference
```bash
notebooklm login                            # Authenticate (one-time)
notebooklm status                           # Check auth + active notebook
notebooklm use <notebook_id>                # Set active notebook
notebooklm source add ./monograph.pdf       # Add a PDF source
notebooklm source add "https://..."         # Add a URL source
notebooklm ask "what are beta blocker contraindications?"
notebooklm generate audio "pharmacy overview"
notebooklm generate quiz --difficulty hard
notebooklm generate report --format study-guide
notebooklm artifact list                    # Check generation status
notebooklm download audio ./out.mp3
notebooklm download quiz --format markdown quiz.md
notebooklm download report report.md
```

### Typical workflow
1. `python notebooklm_pharmacy.py setup-drug-ref` — create & seed notebook
2. `notebooklm use <id>` — set active context
3. `notebooklm source add ./custom_doc.pdf` — add project-specific docs
4. `python notebooklm_pharmacy.py ask "drug X interactions with drug Y"`
5. `python notebooklm_pharmacy.py study-guide` — generate training material

### NotebookLM skill trigger examples
- "create a drug reference notebook" → `/notebooklm`
- "generate a pharmacology podcast" → `/notebooklm`
- "add the FDA monograph to NotebookLM" → `/notebooklm`
- "quiz me on beta blockers from the notebook" → `/notebooklm`

---

## Ralph Wiggum Technique
| Skill | Purpose |
|---|---|
| `/ralph-wiggum:ralph-loop` | Start the Ralph Wiggum reasoning loop |
| `/ralph-wiggum:cancel-ralph` | Cancel an active Ralph loop |
| `/ralph-wiggum:help` | Explain the Ralph Wiggum technique |
