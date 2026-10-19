# -*- coding: utf-8 -*-
import os

PORTAL_HTML = os.path.join(os.path.dirname(__file__), "..", "portal.html")
from update_portal_geometries import NEW_JS_ENGINE

with open(PORTAL_HTML, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "// 2. MOTOR DE METAMORFOSIS"
# Find start of the line with start_marker
start_pos = content.find(start_marker)
if start_pos == -1:
    print("Start marker not found")
    exit(1)

# Back up to the comment bar above it
prev_bar = content.rfind("// =======", 0, start_pos)
if prev_bar != -1:
    start_pos = prev_bar

end_marker = "const POSTCARD_GEOMETRIES = buildAllPostcardGeometries();"
end_pos = content.find(end_marker)
if end_pos == -1:
    print("End marker not found")
    exit(1)

new_content = content[:start_pos] + NEW_JS_ENGINE + "\n\n    " + content[end_pos:]

with open(PORTAL_HTML, "w", encoding="utf-8") as f:
    f.write(new_content)

print("SUCCESS: portal.html updated cleanly with 128 layers x 256 vertices per stroke!")
