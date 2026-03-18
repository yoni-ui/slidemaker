from pydantic import BaseModel
from typing import List, Optional


class GenerateRequest(BaseModel):
    prompt: str


class SlideContent(BaseModel):
    title: str
    subtitle: Optional[str] = None
    bullets: List[str] = []
    layout: Optional[str] = None
    theme: Optional[str] = None


class GenerateResponse(BaseModel):
    slides: List[SlideContent]

