#!/usr/bin/env python3
"""
nb_extract.py — Extract text and embed images into a single Jupyter notebook Markdown.

Usage:
    python nb_extract.py notebook.ipynb
    python nb_extract.py notebook.ipynb --output my_folder
    python nb_extract.py notebook.ipynb --separate-img
    python nb_extract.py notebook.ipynb --exclude-code
    python nb_extract.py notebook.ipynb --exclude-img
"""

import argparse
import base64
import json
import sys
import re
from pathlib import Path


def cell_label(index: int, cell_type: str) -> str:
    return f"<!-- Cell {index} [{cell_type}] -->"


def extract_image_data(data: dict) -> tuple[str, str] | None:
    """
    Return (mime, raw_string) for the first image MIME found in a data dict,
    or None if no image is present.
    Handles both string and list-of-strings formats.
    """
    for mime in ("image/png", "image/jpeg", "image/gif", "image/svg+xml"):
        if mime not in data:
            continue
        raw = data[mime]
        # Notebooks store base64 as either a plain string or a list of strings
        if isinstance(raw, list):
            raw = "".join(raw)
        # Strip any stray whitespace/newlines from the base64 payload
        raw = raw.strip()
        return mime, raw
    return None


def embed_image(mime: str, raw: str, counter: int) -> str:
    """Return a Markdown image tag with a base64 Data URI."""
    if mime == "image/svg+xml":
        # SVG is text; base64-encode the XML string
        b64 = base64.b64encode(raw.encode("utf-8")).decode("utf-8")
        data_uri = f"data:image/svg+xml;base64,{b64}"
    else:
        # PNG/JPEG/GIF: raw is already a base64 string, just strip whitespace
        b64 = "".join(raw.split())
        data_uri = f"data:{mime};base64,{b64}"
    return f"![Embedded Image {counter}]({data_uri})"


def save_image(mime: str, raw: str, counter: int, img_dir: Path) -> str:
    """Save image to img_dir and return a relative Markdown image tag."""
    ext = mime.split("/")[-1].replace("svg+xml", "svg")
    img_filename = f"image_{counter:03d}.{ext}"
    img_path = img_dir / img_filename

    if mime == "image/svg+xml":
        img_path.write_text(raw, encoding="utf-8")
    else:
        # Strip whitespace and fix missing padding to prevent binascii.Error crashes
        b64 = "".join(raw.split())
        b64 += "=" * ((4 - len(b64) % 4) % 4)
        img_path.write_bytes(base64.b64decode(b64))

    print(f"  Saved image {counter} → {img_path}")
    return f"![Embedded Image {counter}](images/{img_filename})"


def extract_notebook(
    nb_path: Path,
    out_dir: Path,
    separate_img: bool = False,
    exclude_code: bool = False,
    exclude_img: bool = False,
    filename: str = "content.md",
) -> None:
    with nb_path.open("r", encoding="utf-8") as f:
        nb = json.load(f)

    cells = nb.get("cells", [])
    out_dir.mkdir(parents=True, exist_ok=True)

    img_dir: Path | None = None
    if separate_img and not exclude_img:
        img_dir = out_dir / "images"
        img_dir.mkdir(exist_ok=True)

    text_parts: list[str] = []
    image_counter = 0

    for cell_idx, cell in enumerate(cells, start=1):
        cell_type = cell.get("cell_type", "unknown")
        source = "".join(cell.get("source", []))

        # ── Markdown cells ────────────────────────────────────────────────
        if cell_type == "markdown":
            # Process markdown attachments (drag-and-dropped images)
            attachments = cell.get("attachments", {})
            for att_name, att_data in attachments.items():
                image_info = extract_image_data(att_data)
                if image_info and not exclude_img:
                    mime, raw = image_info
                    image_counter += 1
                    
                    if separate_img and img_dir:
                        md_tag = save_image(mime, raw, image_counter, img_dir)
                    else:
                        md_tag = embed_image(mime, raw, image_counter)
                    
                    # Extract the raw URL/URI from the generated markdown tag
                    url = md_tag[md_tag.find("(")+1 : md_tag.rfind(")")]
                    source = source.replace(f"attachment:{att_name}", url)

            if source.strip():
                text_parts.append(cell_label(cell_idx, "markdown"))
                text_parts.append(source.strip())
                text_parts.append("")

        # ── Code cells ────────────────────────────────────────────────────
        elif cell_type == "code":
            # Append the actual code block (if not excluded)
            if not exclude_code and source.strip():
                text_parts.append(cell_label(cell_idx, "code"))
                text_parts.append(f"```python\n{source.strip()}\n```")
                text_parts.append("")

            outputs = cell.get("outputs", [])
            cell_text_chunks: list[str] = []

            for output in outputs:
                output_type = output.get("output_type", "")

                if output_type == "stream":
                    text = "".join(output.get("text", []))
                    if text.strip():
                        cell_text_chunks.append(text.rstrip())

                elif output_type in ("execute_result", "display_data"):
                    data = output.get("data", {})

                    # ── Image handling ────────────────────────────────────
                    image_info = extract_image_data(data)
                    if image_info:
                        mime, raw = image_info
                        image_counter += 1

                        if exclude_img:
                            print(f"  Skipped image {image_counter} ({mime}) [--exclude-img]")
                        elif separate_img and img_dir:
                            md_tag = save_image(mime, raw, image_counter, img_dir)
                            cell_text_chunks.append(md_tag)
                        else:
                            md_tag = embed_image(mime, raw, image_counter)
                            cell_text_chunks.append(md_tag)
                            print(f"  Embedded image {image_counter} ({mime})")

                    # ── Plain text (always include alongside or instead of image) ─
                    if "text/plain" in data:
                        plain = "".join(data["text/plain"]).rstrip()
                        if plain and not plain.startswith("<"):
                            cell_text_chunks.append(plain)

                    # ── HTML fallback ──
                    elif not image_info and "text/html" in data:
                        html = "".join(data["text/html"])
                        plain_html = re.sub(r"<[^>]+>", "", html).strip()
                        if plain_html:
                            cell_text_chunks.append(plain_html)

                elif output_type == "error":
                    ename = output.get("ename", "Error")
                    evalue = output.get("evalue", "")
                    cell_text_chunks.append(f"**{ename}: {evalue}**")

            if cell_text_chunks:
                text_parts.append(cell_label(cell_idx, "code output"))
                text_parts.extend(cell_text_chunks)
                text_parts.append("")

        # ── Raw cells ──────────────────────────────────────────────────────
        elif cell_type == "raw":
            if source.strip():
                text_parts.append(cell_label(cell_idx, "raw"))
                text_parts.append(source.strip())
                text_parts.append("")

    if not filename.endswith(".md"):
        filename += ".md"
    content_path = out_dir / filename
    content_path.write_text("\n".join(text_parts), encoding="utf-8")
    print(f"\nSaved combined Markdown to: {content_path}")

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract markdown + embedded outputs from a Jupyter notebook."
    )
    parser.add_argument("notebook", type=Path, help="Path to the .ipynb file")
    parser.add_argument(
        "--output", "-o", type=Path, default=None,
        help="Output folder (default: <notebook_stem>_extracted/)"
    )
    parser.add_argument(
        "--filename", "-f", type=str, default="content.md",
        help="Output Markdown filename (default: content.md)"
    )
    parser.add_argument(
        "--separate-img", action="store_true",
        help="Save images as separate files in an images/ subfolder instead of embedding as Data URIs"
    )
    parser.add_argument(
        "--exclude-code", action="store_true",
        help="Omit all code cell outputs from the Markdown"
    )
    parser.add_argument(
        "--exclude-img", action="store_true",
        help="Omit all images from the Markdown"
    )
    args = parser.parse_args()

    if args.separate_img and args.exclude_img:
        parser.error("--separate-img and --exclude-img are mutually exclusive")

    nb_path: Path = args.notebook.resolve()
    if not nb_path.exists():
        print(f"Error: file not found — {nb_path}", file=sys.stderr)
        sys.exit(1)

    out_dir: Path = args.output or nb_path.parent / f"{nb_path.stem}_extracted"
    out_dir = out_dir.resolve()

    print(f"Processing: {nb_path.name}")
    extract_notebook(
        nb_path,
        out_dir,
        separate_img=args.separate_img,
        exclude_code=args.exclude_code,
        exclude_img=args.exclude_img,
        filename=args.filename,
    )
    print("Done.")


if __name__ == "__main__":
    main()