"""Vercel entrypoint for the NexusFinance FastAPI application."""

import sys
from pathlib import Path

# The FastAPI package lives in backend/nexus in this monorepo.
BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from nexus.main import app  # noqa: E402
