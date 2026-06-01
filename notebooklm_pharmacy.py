#!/usr/bin/env python3
"""
Pharmacy NotebookLM Integration
--------------------------------
Automates creation and management of pharmacy-focused NotebookLM notebooks.

Usage:
    python notebooklm_pharmacy.py <command> [options]

Commands:
    setup-drug-ref       Create a drug reference notebook from FDA/NLM sources
    setup-interactions   Create a drug interaction research notebook
    setup-compliance     Create a regulatory compliance notebook
    ask                  Ask a question against the active pharmacy notebook
    podcast              Generate a podcast summary of the active notebook
    quiz                 Generate a pharmacology quiz from the active notebook
    study-guide          Generate a study guide from the active notebook
    list                 List all pharmacy notebooks
"""

import subprocess
import sys
import json
import argparse


def run(cmd: list[str], capture=True) -> tuple[int, str]:
    result = subprocess.run(
        cmd, capture_output=capture, text=True
    )
    return result.returncode, (result.stdout + result.stderr).strip()


def create_notebook(title: str) -> str | None:
    code, out = run(["notebooklm", "create", title, "--json"])
    if code != 0:
        print(f"[error] Failed to create notebook: {out}")
        return None
    data = json.loads(out)
    notebook_id = data["id"]
    print(f"[ok] Created notebook: {title!r} ({notebook_id})")
    return notebook_id


def add_source(notebook_id: str, source: str) -> str | None:
    code, out = run(["notebooklm", "source", "add", source, "--notebook", notebook_id, "--json"])
    if code != 0:
        print(f"[warn] Could not add source {source!r}: {out}")
        return None
    data = json.loads(out)
    sid = data.get("source_id", "?")
    print(f"  + source added ({sid[:8]}...): {source}")
    return sid


def setup_drug_reference():
    """Create a drug reference notebook with NLM/FDA public sources."""
    nb_id = create_notebook("Pharmacy: Drug Reference")
    if not nb_id:
        return

    sources = [
        "https://dailymed.nlm.nih.gov/dailymed/",
        "https://www.fda.gov/drugs/drug-approvals-and-databases/drugsfda-data-files",
        "https://medlineplus.gov/druginformation.html",
    ]
    for s in sources:
        add_source(nb_id, s)

    print(f"\n[ready] Drug reference notebook ID: {nb_id}")
    print(f"        Run: notebooklm use {nb_id}")


def setup_interactions():
    """Create a drug interaction research notebook."""
    nb_id = create_notebook("Pharmacy: Drug Interactions")
    if not nb_id:
        return

    # Seed with a web research query
    print("  + running web research on drug interactions...")
    code, out = run([
        "notebooklm", "source", "add-research",
        "common drug interactions clinical pharmacology",
        "--notebook", nb_id, "--mode", "fast"
    ])
    if code == 0:
        print("  + research sources imported")
    else:
        print(f"  [warn] Research import: {out}")

    print(f"\n[ready] Drug interactions notebook ID: {nb_id}")
    print(f"        Run: notebooklm use {nb_id}")


def setup_compliance():
    """Create a regulatory compliance notebook."""
    nb_id = create_notebook("Pharmacy: Regulatory Compliance")
    if not nb_id:
        return

    sources = [
        "https://www.fda.gov/drugs/pharmaceutical-quality-resources/current-good-manufacturing-practice-cgmp-regulations",
        "https://www.deadiversion.usdoj.gov/schedules/",
        "https://www.cms.gov/medicare/prescription-drug-coverage",
    ]
    for s in sources:
        add_source(nb_id, s)

    print(f"\n[ready] Compliance notebook ID: {nb_id}")
    print(f"        Run: notebooklm use {nb_id}")


def ask_question(question: str):
    code, out = run(["notebooklm", "ask", question, "--json"])
    if code != 0:
        print(f"[error] {out}")
        return
    data = json.loads(out)
    print("\nAnswer:", data.get("answer", out))


def generate_podcast():
    print("Generating pharmacy podcast summary...")
    code, out = run([
        "notebooklm", "generate", "audio",
        "Create a concise pharmacy education podcast covering the key drug information, interactions, and clinical highlights",
        "--json"
    ])
    if code != 0:
        print(f"[error] {out}")
        return
    data = json.loads(out)
    print(f"[started] Artifact ID: {data.get('task_id', '?')}")
    print("Check status: notebooklm artifact list")
    print("Download when ready: notebooklm download audio ./pharmacy_podcast.mp3")


def generate_quiz():
    print("Generating pharmacology quiz...")
    code, out = run([
        "notebooklm", "generate", "quiz",
        "--difficulty", "medium", "--quantity", "standard", "--json"
    ])
    if code != 0:
        print(f"[error] {out}")
        return
    data = json.loads(out)
    print(f"[started] Artifact ID: {data.get('task_id', '?')}")
    print("Download when ready: notebooklm download quiz --format markdown pharmacy_quiz.md")


def generate_study_guide():
    print("Generating pharmacy study guide...")
    code, out = run([
        "notebooklm", "generate", "report",
        "--format", "study-guide",
        "--append", "Focus on drug classes, mechanisms, side effects, and clinical use cases",
        "--json"
    ])
    if code != 0:
        print(f"[error] {out}")
        return
    data = json.loads(out)
    print(f"[started] Artifact ID: {data.get('task_id', '?')}")
    print("Download when ready: notebooklm download report ./pharmacy_study_guide.md")


def list_notebooks():
    code, out = run(["notebooklm", "list"])
    print(out if code == 0 else f"[error] {out}")


COMMANDS = {
    "setup-drug-ref": setup_drug_reference,
    "setup-interactions": setup_interactions,
    "setup-compliance": setup_compliance,
    "podcast": generate_podcast,
    "quiz": generate_quiz,
    "study-guide": generate_study_guide,
    "list": list_notebooks,
}


def main():
    parser = argparse.ArgumentParser(description="Pharmacy NotebookLM Integration")
    parser.add_argument("command", choices=list(COMMANDS.keys()) + ["ask"])
    parser.add_argument("args", nargs="*")
    args = parser.parse_args()

    if args.command == "ask":
        if not args.args:
            print("Usage: python notebooklm_pharmacy.py ask \"your question\"")
            sys.exit(1)
        ask_question(" ".join(args.args))
    else:
        COMMANDS[args.command]()


if __name__ == "__main__":
    main()
