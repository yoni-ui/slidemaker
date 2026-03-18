from fastapi import APIRouter
from .schemas import GenerateRequest, GenerateResponse, SlideContent


router = APIRouter(prefix="/api", tags=["generate"])


@router.post("/generate", response_model=GenerateResponse)
async def generate_slides(payload: GenerateRequest) -> GenerateResponse:
    # Placeholder deterministic implementation for now.
    # Later this will call the OpenAI API with structured output.
    base_title = "Generated Slide"
    slides = [
        SlideContent(
            title=f"{base_title} 1",
            subtitle=payload.prompt[:80] or None,
            bullets=["Point one", "Point two", "Point three"],
            layout="hero",
            theme="default",
        ),
        SlideContent(
            title=f"{base_title} 2",
            bullets=["Another idea", "Supporting detail"],
            layout="bullet-list",
            theme="default",
        ),
    ]
    return GenerateResponse(slides=slides)

