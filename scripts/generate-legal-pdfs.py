"""
Generate legal PDF documents from translation JSON files.
Runs as postbuild step — produces PDFs for all locales into public/legal/{locale}/.
"""

import json
import os
import sys

from fpdf import FPDF

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MESSAGES_DIR = os.path.join(PROJECT_ROOT, "src", "messages")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "legal")

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

LOCALES = ["en", "hu", "de"]

DOCS = [
    {
        "key": "privacy",
        "filename": "privacy-policy",
        "has_date": True,
        "has_intro": True,
        "sections": [
            "collection", "basis", "purpose", "storage",
            "thirdparty", "hosting", "rights", "complaint", "contact",
        ],
    },
    {
        "key": "terms",
        "filename": "terms-of-service",
        "has_date": True,
        "has_intro": True,
        "sections": [
            "scope", "payment", "revisions", "delivery", "client",
            "ownership", "thirdparty", "cancellation", "warranty",
            "liability", "changes", "law",
        ],
    },
    {
        "key": "imprint",
        "filename": "imprint",
        "has_date": False,
        "has_intro": False,
        "sections": [
            "company", "contact", "registration", "responsible", "disclaimer",
        ],
    },
]


def make_pdf(legal: dict, doc: dict, locale: str, out_dir: str) -> None:
    data = legal[doc["key"]]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=25)

    # Register Unicode fonts
    pdf.add_font("Arial", "", FONT_REGULAR)
    pdf.add_font("Arial", "B", FONT_BOLD)

    # Title
    pdf.set_font("Arial", "B", 22)
    pdf.set_text_color(17, 17, 17)
    pdf.multi_cell(0, 10, data["title"])

    # Date
    if doc["has_date"]:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Arial", "", 9)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 7, data["lastUpdated"], new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)

    # Intro
    if doc["has_intro"]:
        pdf.set_font("Arial", "", 10)
        pdf.set_text_color(80, 80, 80)
        pdf.multi_cell(0, 5.5, data["intro"])
        pdf.ln(5)

    # Sections
    for key in doc["sections"]:
        section = data["sections"][key]
        pdf.ln(3)
        pdf.set_font("Arial", "B", 13)
        pdf.set_text_color(17, 17, 17)
        pdf.cell(0, 8, section["title"], new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Arial", "", 10)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 5.5, section["content"])

    # Footer line
    pdf.ln(10)
    pdf.set_font("Arial", "", 8)
    pdf.set_text_color(160, 160, 160)
    pdf.cell(0, 5, "Budapest Labs — budapestlabs.com", align="C")

    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{doc['filename']}.pdf")
    pdf.output(path)


def main() -> None:
    count = 0
    for locale in LOCALES:
        msg_path = os.path.join(MESSAGES_DIR, f"{locale}.json")
        with open(msg_path, "r", encoding="utf-8") as f:
            messages = json.load(f)
        legal = messages["legal"]
        out_dir = os.path.join(OUTPUT_DIR, locale)

        for doc in DOCS:
            make_pdf(legal, doc, locale, out_dir)
            count += 1

    print(f"Generated {count} legal PDFs into public/legal/")


if __name__ == "__main__":
    main()
