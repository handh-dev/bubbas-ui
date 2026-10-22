# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools==4.67.0"]
# ///
"""Mechanical OFL static instances; never edits the approved variable source.

Run: uv run scripts/instantiate-native-fonts.py
"""
import hashlib
import json
from pathlib import Path

import fontTools
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "examples/expo/assets/fonts/montserrat.ttf"
LICENSE = SOURCE.with_name("OFL.txt")
OUTPUT = SOURCE.parent / "native"
WEIGHTS = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 900: "Black"}
SOURCE_SHA = "498dc34d0fa45288e0ac5345bd385c98bf81c56ee70209aacfb4a22a6510697c"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    if digest(SOURCE.read_bytes()) != SOURCE_SHA:
        raise ValueError("Approved Montserrat source identity changed")
    if fontTools.__version__ != "4.67.0":
        raise ValueError("Use the pinned fontTools generation environment")
    variable = TTFont(SOURCE, recalcTimestamp=False)
    OUTPUT.mkdir(exist_ok=True)
    files = []
    for weight, label in WEIGHTS.items():
        static = instantiateVariableFont(variable, {"wght": weight}, inplace=False, updateFontNames=True)
        static.recalcTimestamp = False
        name = f"Montserrat-{label}.ttf"
        destination = OUTPUT / name
        static.save(destination)
        result = TTFont(destination, recalcTimestamp=False)
        if "fvar" in result or result["OS/2"].usWeightClass != weight:
            raise ValueError(f"Incorrect static instance: {name}")
        if result["name"].getBestFamilyName() != "Montserrat":
            raise ValueError(f"Incorrect native family: {name}")
        files.append({"path": name, "weight": weight, "family": "Montserrat",
                      "postScriptName": result["name"].getDebugName(6),
                      "sha256": digest(destination.read_bytes()), "bytes": destination.stat().st_size})
    manifest = {"schemaVersion": 1, "kind": "mechanical-static-font-instances",
                "source": {"repository": "https://github.com/handh-dev/bubbas-ui", "path": "examples/expo/assets/fonts/montserrat.ttf", "sha256": SOURCE_SHA},
                "license": {"identifier": "OFL-1.1", "sha256": digest(LICENSE.read_bytes())},
                "generator": {"script": "scripts/instantiate-native-fonts.py", "fontTools": fontTools.__version__, "axis": "wght", "fontNamesUpdated": True, "sourceTimestampPreserved": True},
                "files": files}
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    paths = [{"path": f"./assets/fonts/native/{item['path']}", "weight": item["weight"], "style": "normal"} for item in files]
    registration = {"android": {"fonts": [{"fontFamily": "BubbasBody", "fontDefinitions": paths}]},
                    "ios": {"fonts": [item["path"] for item in paths]}}
    (ROOT / "examples/expo/native-fonts.json").write_text(json.dumps(registration, indent=2) + "\n")
    print(f"Generated {len(files)} faithful static weights; original variable font unchanged")


if __name__ == "__main__":
    main()
