from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import run_pipeline
from fastapi.middleware.cors import CORSMiddleware

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