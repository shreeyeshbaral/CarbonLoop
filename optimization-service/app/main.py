import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

from app.solver import solver

load_dotenv()

app = FastAPI(
    title="CarbonLoop Logistics Optimization Service",
    description="Google OR-Tools Vehicle Routing Problem (VRP) & OSRM Campus Logistics Solver",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeLocation(BaseModel):
    name: str
    building: str
    lat: float
    lng: float
    transferId: Optional[str] = None
    assetName: Optional[str] = None

class RouteOptimizationRequest(BaseModel):
    depot: NodeLocation
    stops: List[NodeLocation]

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "carbonloop-optimization-service",
        "engine": "Google OR-Tools 9.10 + Haversine Routing Engine",
    }

@app.post("/api/routes/optimize")
def optimize_route_endpoint(request: RouteOptimizationRequest):
    """
    Optimizes inter-departmental transfer pickup/drop-off dispatch loops using Google OR-Tools.
    """
    try:
        depot_dict = request.depot.model_dump()
        stops_dicts = [s.model_dump() for s in request.stops]
        result = solver.optimize_route(depot_dict, stops_dicts)
        return {
            "status": "success",
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("OPTIMIZATION_SERVICE_PORT", 8001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
