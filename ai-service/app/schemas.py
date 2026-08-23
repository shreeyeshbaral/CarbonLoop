from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

# ===================================================
# CARBONLOOP — AI Service Pydantic Schemas
# ===================================================

class AssetCategory(str, Enum):
    LAPTOP = "LAPTOP"
    MONITOR = "MONITOR"
    DESKTOP = "DESKTOP"
    CHAIR = "CHAIR"
    DESK = "DESK"
    PROJECTOR = "PROJECTOR"
    PRINTER = "PRINTER"
    LAB_EQUIPMENT = "LAB_EQUIPMENT"
    NETWORKING = "NETWORKING"
    OTHER = "OTHER"

class AssetCondition(str, Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"
    FOR_PARTS = "FOR_PARTS"

class CircularAction(str, Enum):
    REUSE = "REUSE"
    REPAIR = "REPAIR"
    REDISTRIBUTE = "REDISTRIBUTE"
    RECYCLE = "RECYCLE"

# ---------------------------------------------------
# REQUEST SCHEMAS
# ---------------------------------------------------
class AssetAssessmentRequest(BaseModel):
    description: str = Field(..., min_length=5, description="Free text description of the surplus asset")
    reportedCondition: Optional[AssetCondition] = None
    ageYears: Optional[float] = None
    sourceDepartment: Optional[str] = None

class NaturalSearchRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Natural language search query")
    userDepartment: Optional[str] = None

# ---------------------------------------------------
# RESPONSE SCHEMAS
# ---------------------------------------------------
class AssetAssessmentResponse(BaseModel):
    category: AssetCategory
    condition: AssetCondition
    issues: List[str] = Field(default_factory=list)
    repairable: bool
    dataWipeRequired: bool
    recommendedAction: CircularAction
    confidence: float = Field(ge=0.0, le=1.0)
    estimatedValueMultiplier: float = Field(ge=0.0, le=1.0)
    reasoning: str
    suggestedTags: List[str] = Field(default_factory=list)

class NaturalSearchFilter(BaseModel):
    category: Optional[AssetCategory] = None
    condition: Optional[AssetCondition] = None
    maxDistanceKm: Optional[float] = None
    quantity: Optional[int] = 1
    status: str = "AVAILABLE"
    keywords: List[str] = Field(default_factory=list)

class NaturalSearchResponse(BaseModel):
    originalQuery: str
    parsedFilters: NaturalSearchFilter
    explanation: str
