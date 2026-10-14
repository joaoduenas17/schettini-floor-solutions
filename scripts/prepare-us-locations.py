"""Create state and city lists from the Census Bureau's 2026 Gazetteer files."""
import argparse
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path, help="Folder containing the two 2026 national Gazetteer text files")
args = parser.parse_args()

def rows(filename):
    with (args.source / filename).open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="|"))

states = sorted(
    [{"code": row["USPS"], "name": row["NAME"]} for row in rows("2026_Gaz_state_national.txt") if row["USPS"] != "PR"],
    key=lambda item: item["name"],
)
assert len(states) == 51
(root / "app/us-states.json").write_text(json.dumps(states, indent=2) + "\n")
cities = {state["code"]: set() for state in states}
suffixes = [" city and borough", " metropolitan government", " consolidated government", " unified government", " metro government", " urban county", " municipality", " corporation", " borough", " village", " city", " town", " CDP"]
for row in rows("2026_Gaz_place_national.txt"):
    if row["USPS"] not in cities:
        continue
    name = row["NAME"].removesuffix(" (balance)")
    for suffix in suffixes:
        if name.endswith(suffix):
            name = name.removesuffix(suffix)
            break
    assert 0 < len(name) <= 100
    cities[row["USPS"]].add(name)

output = root / "public/locations/2026"
output.mkdir(parents=True, exist_ok=True)
for code, names in cities.items():
    (output / f"{code.lower()}.json").write_text(json.dumps({"state": code, "cities": sorted(names, key=lambda name: (name.casefold(), name))}, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Prepared {len(states) - 1} states and DC, with {sum(len(names) for names in cities.values()):,} distinct city/town names.")
