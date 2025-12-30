from __future__ import annotations

import io
import mimetypes
from typing import Tuple

from pypdf import PdfReader


def guess_mime_type(filename: str | None, content_type: str | None) -> str:
    if content_type:
        return content_type
    if filename:
        mime, _ = mimetypes.guess_type(filename)
        if mime:
            return mime
    return "application/octet-stream"


def extract_text(
    filename: str | None,
    content_type: str | None,
    data: bytes,
) -> Tuple[str, str]:
    """
    Returns extracted text and the resolved mime type.
    """
    resolved_mime = guess_mime_type(filename, content_type)
    if "pdf" in resolved_mime.lower() or (filename and filename.lower().endswith(".pdf")):
        text = _extract_pdf_text(data)
    else:
        text = data.decode("utf-8", errors="ignore")

    return text, resolved_mime


def _extract_pdf_text(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(pages)
