import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.schemas import (
    AssetAssessmentRequest,
    AssetAssessmentResponse,
    NaturalSearchRequest,
    NaturalSearchResponse,
)
from app.services.classifier import classifier

load_dotenv()

app = FastAPI(
    title="CarbonLoop AI Intelligence Service",
    description="Structured LLM & NLP Asset Classification, Circular Decision Support, and Natural Search Engine",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "carbonloop-ai-service",
        "engine": "Pydantic Structured NLP + LLM Pipeline",
    }

@app.post("/api/ai/assess-asset", response_model=AssetAssessmentResponse)
def assess_asset_endpoint(request: AssetAssessmentRequest):
    """
    Analyzes unformatted surplus asset description and returns verified structured JSON.
    """
    try:
        result = classifier.assess_asset(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI assessment failure: {str(e)}")

@app.post("/api/ai/parse-search", response_model=NaturalSearchResponse)
def parse_search_endpoint(request: NaturalSearchRequest):
    """
    Converts natural language user search queries into structured database query filters.
    """
    try:
        result = classifier.parse_search_query(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Natural search parsing failure: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
