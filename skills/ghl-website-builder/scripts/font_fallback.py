#!/usr/bin/env python3
"""Generate metric-matched fallback @font-face rules so a web font loads without the page jumping.

Before a web font arrives, the browser draws text in a system font (Arial, Georgia, Courier New).
If that fallback is wider, narrower or sits at a different height, the page visibly shifts when
the real font swaps in. This script measures the real font and emits a fallback face whose
size-adjust / ascent-override / descent-override / line-gap-override make the system font take
up the same space.

Usage:
  python font_fallback.py "Fraunces:600:serif" "Instrument Sans:400:sans"
  python font_fallback.py "fs:satoshi:400:sans"            # Fontshare slug
  python font_fallback.py "C:/fonts/Brand-Bold.woff2:700:sans"   # local file (client font)

Spec = <name or fs:slug or file path>:<weight used on the site>:<sans|serif|mono>
Measure at the weight the site actually uses for that family (display fonts: their heading weight).

Needs:  pip install fonttools brotli
"""
import io
import re
import sys
import urllib.request

try:
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
except ImportError:
    sys.exit("Needs fontTools and brotli:  pip install fonttools brotli")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
SAMPLE = ("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs! "
          "0123456789 Sphinx of black quartz, judge my vow; how vexingly quick daft zebras jump.")

# Measured from the Windows system fonts with the same SAMPLE (per-em units), so this script
# runs anywhere, including machines without these fonts installed.
# Weights of 600+ are matched against the real bold system face (declared for 600-900 so the
# browser never fakes a bold), everything lighter against the regular face.
FALLBACKS = {
    "sans": {"generic": "sans-serif",
             "regular": ("local('Arial'), local('ArialMT')", 0.45345),
             "bold": ("local('Arial Bold'), local('Arial-BoldMT')", 0.48808)},
    "serif": {"generic": "serif",
              "regular": ("local('Georgia')", 0.45152),
              "bold": ("local('Georgia Bold'), local('Georgia-Bold')", 0.52313)},
    "mono": {"generic": "monospace",
             "regular": ("local('Courier New'), local('CourierNewPSMT')", 0.6001),
             "bold": ("local('Courier New Bold'), local('CourierNewPS-BoldMT')", 0.6001)},
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def font_bytes(source, weight):
    if source.startswith("fs:"):
        css = fetch(f"https://api.fontshare.com/v2/css?f[]={source[3:]}@{weight}&display=swap").decode()
        m = re.search(r"url\('?(//cdn\.fontshare\.com[^)']+\.woff2)", css)
        if not m:
            sys.exit(f"Fontshare has no woff2 for {source} at {weight}")
        return fetch("https:" + m.group(1))
    if re.search(r"\.(woff2?|ttf|otf)$", source, re.I):
        with open(source, "rb") as fh:
            return fh.read()
    fam = source.replace(" ", "+")
    try:
        css = fetch(f"https://fonts.googleapis.com/css2?family={fam}:wght@{weight}&display=swap").decode()
    except Exception:
        css = fetch(f"https://fonts.googleapis.com/css2?family={fam}&display=swap").decode()
    block = re.search(r"/\* latin \*/\s*@font-face\s*{[^}]*}", css) or re.search(r"@font-face\s*{[^}]*}", css)
    url = re.search(r"url\((https://fonts\.gstatic\.com[^)]+)\)", block.group(0) if block else css)
    if not url:
        sys.exit(f"Google Fonts returned no font file for {source}")
    return fetch(url.group(1))


def metrics(data, weight):
    f = TTFont(io.BytesIO(data))
    if "fvar" in f:
        loc = {}
        for a in f["fvar"].axes:
            loc[a.axisTag] = max(a.minValue, min(a.maxValue, weight)) if a.axisTag == "wght" else a.defaultValue
        f = instancer.instantiateVariableFont(f, loc)
    upm = f["head"].unitsPerEm
    cmap, hmtx = f.getBestCmap(), f["hmtx"]
    widths = [hmtx[cmap[ord(c)]][0] for c in SAMPLE if ord(c) in cmap]
    h = f["hhea"]
    return {"avg": sum(widths) / len(widths) / upm, "asc": h.ascent / upm,
            "desc": abs(h.descent) / upm, "gap": h.lineGap / upm}


def pct(x):
    return f"{x * 100:.2f}%"


def fallback_css(spec):
    parts = spec.rsplit(":", 2)
    if len(parts) != 3 or parts[2] not in FALLBACKS:
        sys.exit(f"Bad spec {spec!r}; expected name:weight:sans|serif|mono")
    source, weight, cat = parts[0], int(parts[1]), parts[2]
    m = metrics(font_bytes(source, weight), weight)
    fb = FALLBACKS[cat]
    bold = weight >= 600
    local, fb_avg = fb["bold" if bold else "regular"]
    size = m["avg"] / fb_avg
    name = source[3:].replace("-", " ").title() if source.startswith("fs:") else re.sub(r"\.(woff2?|ttf|otf)$", "", source.split("/")[-1], flags=re.I)
    weight_desc = " font-weight: 600 900;" if bold else ""
    css = (f"@font-face {{ font-family: '{name} Fallback'; src: {local};{weight_desc} "
           f"size-adjust: {pct(size)}; ascent-override: {pct(m['asc'] / size)}; "
           f"descent-override: {pct(m['desc'] / size)}; line-gap-override: {pct(m['gap'] / size)}; }}")
    stack = f"'{name}', '{name} Fallback', {fb['generic']}"
    return name, css, stack


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)
    failed = 0
    for spec in sys.argv[1:]:
        try:
            name, css, stack = fallback_css(spec)
        except (SystemExit, Exception) as e:
            failed += 1
            print(f"SKIPPED {spec}: {e}", file=sys.stderr)
            continue
        print(f"/* {name}: use  font-family: {stack}; */")
        print(css)
    sys.exit(1 if failed else 0)
