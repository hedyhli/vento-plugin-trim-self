#!/usr/bin/env python3

import sys

cov = int(sys.argv[1])

color = "red"
if cov > 90:
    color = "2ebb4e"
elif cov > 50:
    color = "yellow"

image = f"![deno-coverage](https://img.shields.io/badge/Coverage-{cov}%25-{color})"

found = False
before = []
after = []

with open("README.md") as f:
    for line in f.read().splitlines():
        if line.startswith("![deno-coverage]"):
            found = True
            continue

        if not found:
            before.append(line)
        else:
            after.append(line)

if found:
    with open("README.md", "w") as f:
        f.write("\n".join(before) + "\n")
        f.write(image + "\n")
        f.write("\n".join(after) + "\n")
