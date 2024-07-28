from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import initialize_faiss, rag_llm

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class Text(BaseModel):
    text: str

# Initialize FAISS index on startup
faiss_index = None

@app.on_event("startup")
async def startup_event():
    global faiss_index
    faiss_index = initialize_faiss()

@app.get("/")
def read_root():
    return {"message": "hi"}

@app.post('/llm')
async def llm_main(text: Text):
    try:
        print(f"Received text: {text.text}")
        output = rag_llm(text.text, faiss_index)
        print(f"Generated output: {output}")  # Debug print to check the output structure
        return JSONResponse(content={"response": output})
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during processing.")
