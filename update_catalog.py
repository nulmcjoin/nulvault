import json, re, html, hashlib
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "data" / "sources.json"
OUT = ROOT / "data" / "catalog.json"
MAX_ITEMS = 120

def txt(node, names):
    for name in names:
        el = node.find(name)
        if el is not None and el.text:
            return html.unescape(re.sub(r"<[^>]+>", " ", el.text)).strip()
    return ""

def link_of(item):
    for el in item.findall("link"):
        if el.text and el.text.strip().startswith("http"):
            return el.text.strip()
        href = el.attrib.get("href")
        if href and href.startswith("http"):
            return href
    return ""

def categorize(title, description):
    s = (title + " " + description).lower()
    if any(k in s for k in ["skin pack","skins","skinpack"]): return "Skin Pack"
    if any(k in s for k in ["texture","resource pack","shader","pvp pack","ui pack"]): return "Texture / Resource"
    if any(k in s for k in ["template","mctemplate","world template"]): return "MCTemplate"
    if any(k in s for k in ["map","world","survival world","adventure","parkour"]): return "Maps"
    return "Addons"

def date_of(item):
    raw = txt(item, ["pubDate", "{http://purl.org/dc/elements/1.1/}date", "updated", "published"])
    if not raw: return ""
    try:
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(raw).date().isoformat()
    except Exception:
        return raw[:10] if re.match(r"\d{4}-\d{2}-\d{2}", raw) else ""

def parse_feed(source):
    req = Request(source["url"], headers={"User-Agent":"BlockVaultCommunityCatalog/1.0 (RSS reader)"})
    with urlopen(req, timeout=20) as response:
        raw = response.read(5_000_000)
    root = ET.fromstring(raw)
    entries = root.findall(".//item")
    if not entries:
        entries = root.findall(".//{http://www.w3.org/2005/Atom}entry")
    result = []
    for entry in entries:
        title = txt(entry, ["title", "{http://www.w3.org/2005/Atom}title"])
        desc = txt(entry, ["description", "summary", "content:encoded", "{http://www.w3.org/2005/Atom}summary", "{http://www.w3.org/2005/Atom}content"])
        url = link_of(entry)
        if not title or not url: continue
        # Keep the catalog as links to the original publisher; do not copy hosted files.
        if not url.startswith("https://"): continue
        creator = txt(entry, ["author", "{http://www.w3.org/2005/Atom}author"])
        if len(desc) > 420: desc = desc[:417].rsplit(" ",1)[0] + "…"
        uid = hashlib.sha1(url.encode()).hexdigest()[:12]
        result.append({"id":uid,"title":title[:140],"category":categorize(title,desc),"description":desc or "Buka sumber asli untuk membaca detail, kompatibilitas, dan ketentuan unduhan.","version":"Periksa sumber","date":date_of(entry),"creator":creator or source.get("name","Community source"),"url":url,"icon":"","source":source.get("name","Community source")})
    return result

def main():
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    all_items, errors = [], []
    for source in sources:
        if not source.get("enabled", True): continue
        try:
            all_items.extend(parse_feed(source))
            print("OK:", source.get("name", source["url"]))
        except Exception as exc:
            errors.append(f'{source.get("name",source["url"])}: {exc}')
            print("WARN:", errors[-1])
    # Deduplicate by canonical URL, newest date first.
    unique = {}
    for item in all_items:
        unique[item["url"]] = item
    items = sorted(unique.values(), key=lambda x: x.get("date",""), reverse=True)[:MAX_ITEMS]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {"updated_at":datetime.now(timezone.utc).isoformat(timespec="minutes"),"items":items,"sources_checked":len([s for s in sources if s.get("enabled",True)]),"errors":errors}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(items)} entries to {OUT}")

if __name__ == "__main__":
    main()
