from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import run_pipeline
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    message: str


@app.post("/analyze")
def analyze(data: UserInput):
    result = run_pipeline(data.message)
    return result


# serve frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def read_root():
    return FileResponse(os.path.join("frontend", "index.html"))