import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

if "" in sys.path:
    sys.path.remove("")
root_dir = os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".."))
if root_dir in sys.path:
    sys.path.remove(root_dir)

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8005))
    print(f"============================================================")
    print(f"  Starting Event Page (Paradigm) Backend on http://localhost:{port}")
    print(f"============================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)

