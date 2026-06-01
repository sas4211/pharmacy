# Pharmacy Project — Claude Instructions

## Project Overview
This is a pharmacy management project. Claude should assist with building, maintaining, and improving pharmacy-related software.

## Skills & Plugins
See [skill.md](./skill.md) for available Claude Code skills/plugins and when to use them.

## Google NotebookLM Integration
NotebookLM is integrated for pharmacy knowledge management. Use it to:
- Build drug reference notebooks from FDA/NLM public sources
- Research drug interactions via web research ingestion
- Generate pharmacology study guides, quizzes, and podcasts
- Analyze regulatory compliance documents (FDA CGMP, DEA schedules)

**CLI helper:** `python notebooklm_pharmacy.py <command>`

| Command | What it does |
|---|---|
| `setup-drug-ref` | Create drug reference notebook (DailyMed, FDA, MedlinePlus) |
| `setup-interactions` | Create drug interactions notebook with web research |
| `setup-compliance` | Create regulatory compliance notebook |
| `ask "question"` | Chat with the active notebook |
| `podcast` | Generate an audio overview of the active notebook |
| `quiz` | Generate a pharmacology quiz |
| `study-guide` | Generate a study guide report |
| `list` | List all pharmacy notebooks |

**Direct CLI (notebooklm-py):**
```bash
notebooklm status                          # Check auth + active notebook
notebooklm list                            # List all notebooks
notebooklm use <notebook_id>               # Set active notebook
notebooklm ask "what are NSAID interactions?"
notebooklm source add ./drug_monograph.pdf
notebooklm generate audio "pharmacy education overview"
notebooklm artifact list                   # Check generation status
notebooklm download audio ./output.mp3
```

**Auth:** Run `notebooklm login` once to authenticate with Google.
If auth errors appear, re-run `notebooklm login`.

## Code Style
- Prefer clear, readable code over clever one-liners
- Validate all user inputs at system boundaries (drug names, dosages, patient data)
- Never expose sensitive patient or prescription data in logs or error messages

## Security
- Treat all patient data as sensitive (HIPAA-relevant)
- Sanitize inputs before database queries (no SQL injection)
- Do not hardcode credentials or API keys

## Testing
- Write tests for business logic (dosage calculations, inventory checks)
- Integration tests should use a real test database, not mocks

## Commits
- Keep commits focused and descriptive
- Do not commit `.env` files or secrets
