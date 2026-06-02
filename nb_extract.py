#!/usr/bin/env python3
"""
nb_extract.py — Extract text and embed images into a single Jupyter notebook Markdown.

Usage:
    python nb_extract.py notebook.ipynb
    python nb_extract.py notebook.ipynb --output my_folder
    python nb_extract.py notebook.ipynb --separate-img --img-prefix xxx
    python nb_extract.py notebook.ipynb --filename custom_name.md
    python nb_extract.py notebook.ipynb --exclude-code
    python nb_extract.py notebook.ipynb --exclude-img
    python nb_extract.py notebook.ipynb --hide-code
    python nb_extract.py notebook.ipynb --hide-code-only
"""

import argparse
import base64
import json
import sys
import re
from pathlib import Path


def cell_label(index: int, cell_type: str) -> str:
    return f""


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


def save_image(mime: str, raw: str, counter: int, img_dir: Path, img_prefix: str) -> str:
    """Save image to img_dir and return a relative Markdown image tag using img_prefix."""
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
    return f"![Embedded Image {counter}]({img_prefix}/{img_filename})"


def extract_notebook(
    nb_path: Path,
    out_dir: Path,
    separate_img: bool = False,
    exclude_code: bool = False,
    exclude_img: bool = False,
    filename: str = "content.md",
    hide_code: bool = False,
    hide_code_only: bool = False,
    img_prefix: str = "images",
) -> None:
    with nb_path.open("r", encoding="utf-8") as f:
        nb = json.load(f)

    cells = nb.get("cells", [])
    out_dir.mkdir(parents=True, exist_ok=True)

    img_dir: Path | None = None
    if separate_img and not exclude_img:
        img_dir = out_dir / img_prefix
        img_dir.mkdir(parents=True, exist_ok=True)

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
                        md_tag = save_image(mime, raw, image_counter, img_dir, img_prefix)
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
            source_str = source.strip()
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
                        image_counter += 1

                        if exclude_img:
                            print(f"  Skipped image {image_counter} ({mime}) [--exclude-img]")
                        elif separate_img and img_dir:
                            mime, raw = image_info
                            md_tag = save_image(mime, raw, image_counter, img_dir, img_prefix)
                            cell_text_chunks.append(md_tag)
                        else:
                            mime, raw = image_info
                            md_tag = embed_image(mime, raw, image_counter)
                            cell_text_chunks.append(md_tag)
                            print(f"  Embedded image {image_counter} ({mime})")

                    # ── Plain text ──
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

            # Render logic based on accordion flags
            if hide_code:
                cell_parts = []
                if not exclude_code and source_str:
                    cell_parts.append(f"```python\n{source_str}\n```")
                    cell_parts.append("")
                if cell_text_chunks:
                    cell_parts.extend(cell_text_chunks)
                    cell_parts.append("")
                
                if cell_parts:
                    text_parts.append(cell_label(cell_idx, "code and output hidden"))
                    text_parts.append("<details>")
                    text_parts.append(f"<summary>Code &amp; Output for Cell {cell_idx}</summary>")
                    text_parts.append("")  
                    text_parts.extend(cell_parts)
                    text_parts.append("</details>")
                    text_parts.append("")

            elif hide_code_only:
                if not exclude_code and source_str:
                    text_parts.append(cell_label(cell_idx, "code hidden"))
                    text_parts.append("<details>")
                    text_parts.append(f"<summary>Code for Cell {cell_idx}</summary>")
                    text_parts.append("")  
                    text_parts.append(f"```python\n{source_str}\n```")
                    text_parts.append("</details>")
                    text_parts.append("")
                
                if cell_text_chunks:
                    text_parts.append(cell_label(cell_idx, "code output"))
                    text_parts.extend(cell_text_chunks)
                    text_parts.append("")

            else:
                if not exclude_code and source_str:
                    text_parts.append(cell_label(cell_idx, "code"))
                    text_parts.append(f"```python\n{source_str}\n```")
                    text_parts.append("")
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
        help="Save images as separate files instead of embedding as Data URIs"
    )
    parser.add_argument(
        "--img-prefix", type=str, default="images",
        help="Directory name and Markdown path prefix for separate images (default: images)"
    )
    parser.add_argument(
        "--exclude-code", action="store_true",
        help="Omit all code cell blocks from the Markdown"
    )
    parser.add_argument(
        "--exclude-img", action="store_true",
        help="Omit all images from the Markdown"
    )
    parser.add_argument(
        "--hide-code", action="store_true",
        help="Wrap both code cells and their outputs in an HTML <details> accordion"
    )
    parser.add_argument(
        "--hide-code-only", action="store_true",
        help="Wrap ONLY the code cells in an HTML <details> accordion, leaving outputs visible"
    )
    args = parser.parse_args()

    if args.separate_img and args.exclude_img:
        parser.error("--separate-img and --exclude-img are mutually exclusive")
        
    if args.hide_code and args.hide_code_only:
        parser.error("--hide-code and --hide-code-only are mutually exclusive")

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
        hide_code=args.hide_code,
        hide_code_only=args.hide_code_only,
        img_prefix=args.img_prefix,
    )
    print("Done.")


if __name__ == "__main__":
    main()