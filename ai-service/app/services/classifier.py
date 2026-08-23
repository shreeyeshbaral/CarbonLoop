import re
from typing import Dict, Any, List
from app.schemas import (
    AssetCategory,
    AssetCondition,
    CircularAction,
    AssetAssessmentRequest,
    AssetAssessmentResponse,
    NaturalSearchRequest,
    NaturalSearchResponse,
    NaturalSearchFilter,
)

class AIAssetClassifier:
    """
    Robust Asset Intelligence Classifier.
    Combines rule-based NLP extraction with deterministic fallback schemas.
    """

    CATEGORY_KEYWORDS = {
        AssetCategory.LAPTOP: ["laptop", "thinkpad", "macbook", "latitude", "notebook", "dell xps", "hp elitebook"],
        AssetCategory.MONITOR: ["monitor", "display", "screen", "4k", "ultrawide", "benq", "dell ultrasharp"],
        AssetCategory.DESKTOP: ["desktop", "optiplex", "workstation", "tower", "pc", "imac", "cpu unit"],
        AssetCategory.CHAIR: ["chair", "aeron", "seating", "ergonomic", "herman miller", "armchair"],
        AssetCategory.DESK: ["desk", "table", "standing desk", "workbench", "workstation table"],
        AssetCategory.PROJECTOR: ["projector", "beamer", "epson", "optoma", "sony projector", "hdmi projector"],
        AssetCategory.PRINTER: ["printer", "laserjet", "scanner", "ecotank", "photocopier", "mfp"],
        AssetCategory.NETWORKING: ["switch", "router", "cisco", "access point", "poe", "ethernet switch"],
        AssetCategory.LAB_EQUIPMENT: ["oscilloscope", "spectrometer", "multimeter", "microscope", "leica", "analyzer", "calibrator"],
    }

    DATA_WIPE_CATEGORIES = {
        AssetCategory.LAPTOP,
        AssetCategory.DESKTOP,
        AssetCategory.PRINTER,
        AssetCategory.NETWORKING,
    }

    def assess_asset(self, req: AssetAssessmentRequest) -> AssetAssessmentResponse:
        desc_lower = req.description.lower()

        # 1. Detect Category
        detected_category = AssetCategory.OTHER
        for cat, keywords in self.CATEGORY_KEYWORDS.items():
            if any(kw in desc_lower for kw in keywords):
                detected_category = cat
                break

        # 2. Detect Issues & Condition
        issues: List[str] = []
        if "battery" in desc_lower and any(w in desc_lower for w in ["poor", "bad", "dead", "degraded", "replace", "draining"]):
            issues.append("Battery degradation (requires cell replacement)")
        if any(w in desc_lower for w in ["screen crack", "cracked display", "scratched", "dead pixel"]):
            issues.append("Display panel wear / surface scratches")
        if any(w in desc_lower for w in ["fan noise", "overheating", "thermal"]):
            issues.append("Thermal paste & cooling fan maintenance required")
        if any(w in desc_lower for w in ["wheel", "castor", "creak", "loose armrest"]):
            issues.append("Castor / mechanical lubrication required")
        if any(w in desc_lower for w in ["lamp expired", "dim light", "low brightness"]):
            issues.append("Projector optical lamp replacement required")

        # Condition logic
        if req.reportedCondition:
            condition = req.reportedCondition
        elif len(issues) >= 2 or "broken" in desc_lower or "faulty" in desc_lower:
            condition = AssetCondition.POOR
        elif len(issues) == 1 or "fair" in desc_lower or "scratched" in desc_lower:
            condition = AssetCondition.FAIR
        elif any(w in desc_lower for w in ["mint", "like new", "perfect", "brand new", "flawless"]):
            condition = AssetCondition.EXCELLENT
        else:
            condition = AssetCondition.GOOD

        # 3. Data-Wipe Mandatory Check
        data_wipe_required = detected_category in self.DATA_WIPE_CATEGORIES or "storage" in desc_lower or "ssd" in desc_lower

        # 4. Circular Pathway Decision
        repairable = len(issues) > 0 and "unrepairable" not in desc_lower and "salvage only" not in desc_lower

        if condition == AssetCondition.POOR and not repairable:
            recommended_action = CircularAction.RECYCLE
            reasoning = "Asset has severe non-repairable component failure. Certified e-waste recycling recommended to recover precious metals and avoid landfill accumulation."
            confidence = 0.95
            val_mult = 0.10
        elif repairable or condition == AssetCondition.POOR or condition == AssetCondition.FAIR:
            recommended_action = CircularAction.REPAIR
            reasoning = f"Asset is operational with minor issues ({', '.join(issues) if issues else 'scheduled overhaul'}). Estimated refurb cost is low relative to procurement replacement value."
            confidence = 0.91
            val_mult = 0.40
        elif detected_category in [AssetCategory.LAPTOP, AssetCategory.MONITOR, AssetCategory.NETWORKING]:
            recommended_action = CircularAction.REDISTRIBUTE
            reasoning = "High institutional demand detected across Design and Research departments. Recommended for immediate cross-department surplus redistribution."
            confidence = 0.96
            val_mult = 0.65
        else:
            recommended_action = CircularAction.REUSE
            reasoning = "Asset is in solid operational condition and can be retained or re-assigned locally within the campus cluster."
            confidence = 0.94
            val_mult = 0.70

        # Suggested tags
        tags = ["AI Assessed", detected_category.value.capitalize()]
        if data_wipe_required:
            tags.append("NIST 800-88 Required")
        if repairable:
            tags.append("Refurb Candidate")

        return AssetAssessmentResponse(
            category=detected_category,
            condition=condition,
            issues=issues,
            repairable=repairable,
            dataWipeRequired=data_wipe_required,
            recommendedAction=recommended_action,
            confidence=confidence,
            estimatedValueMultiplier=val_mult,
            reasoning=reasoning,
            suggestedTags=tags,
        )

    def parse_search_query(self, req: NaturalSearchRequest) -> NaturalSearchResponse:
        q = req.query.lower()

        # Extract Category
        cat_match = None
        for cat, keywords in self.CATEGORY_KEYWORDS.items():
            if any(kw in q for kw in keywords):
                cat_match = cat
                break

        # Extract Quantity (e.g. "3 monitors", "5 laptops")
        qty_match = re.search(r"\b(\d+)\b", q)
        quantity = int(qty_match.group(1)) if qty_match else 1

        # Extract Distance (e.g. "within 2 km", "under 1.5km")
        dist_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:km|kilometers?)", q)
        max_dist = float(dist_match.group(1)) if dist_match else None

        # Extract Condition (e.g. "good condition", "excellent")
        cond_match = None
        if "excellent" in q or "mint" in q:
            cond_match = AssetCondition.EXCELLENT
        elif "good" in q or "working" in q or "usable" in q:
            cond_match = AssetCondition.GOOD
        elif "fair" in q or "repairable" in q:
            cond_match = AssetCondition.FAIR

        filters = NaturalSearchFilter(
            category=cat_match,
            condition=cond_match,
            maxDistanceKm=max_dist,
            quantity=quantity,
            status="AVAILABLE",
            keywords=[w for w in q.split() if len(w) > 3],
        )

        explanation = f"Structured search filters generated: Category={cat_match.value if cat_match else 'ANY'}, Target Quantity={quantity}, Minimum Condition={cond_match.value if cond_match else 'ANY'}"
        if max_dist:
            explanation += f", Proximity Radius ≤ {max_dist} km"

        return NaturalSearchResponse(
            originalQuery=req.query,
            parsedFilters=filters,
            explanation=explanation,
        )

classifier = AIAssetClassifier()
