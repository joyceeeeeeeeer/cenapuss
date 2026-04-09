#!/usr/bin/env python3
"""Rewrite root-absolute href/src in HTML to paths relative to each file (GitHub Pages /repo/ support)."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def skip_url(s: str) -> bool:
    t = s.strip()
    return t.startswith("http://") or t.startswith("https://") or t.startswith("//") or t.startswith("mailto:")


def fix_file(html_path: Path) -> bool:
    cur_dir = html_path.parent.resolve()
    text = html_path.read_text(encoding="utf-8")

    def repl(match: re.Match) -> str:
        attr, quote, full = match.group(1), match.group(2), match.group(3)
        if not full.startswith("/") or skip_url(full[1:]):
            return match.group(0)
        rest = full[1:]
        path_part, sep, frag = rest.partition("#")
        query = ""
        if "?" in path_part:
            path_part, q = path_part.split("?", 1)
            query = "?" + q
        target = (ROOT / path_part).resolve()
        try:
            rel = Path(os.path.relpath(target, cur_dir)).as_posix()
        except ValueError:
            rel = path_part
        tail = query + (("#" + frag) if sep else "")
        return f"{attr}={quote}{rel}{tail}{quote}"

    new_text = re.sub(r"\b(href|src)=(['\"])(/[^'\"#][^'\"]*)\2", repl, text)
    if new_text == text:
        return False
    html_path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for p in sorted(ROOT.rglob("*.html")):
        if ".git" in p.parts:
            continue
        if fix_file(p):
            print("updated", p.relative_to(ROOT))
            n += 1
    print("done,", n, "files")


if __name__ == "__main__":
    main()
