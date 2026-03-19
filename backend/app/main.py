from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers_generate import router as generate_router
from .routers_export import router as export_router

app = FastAPI(title="Slide Generator API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router)
app.include_router(export_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


