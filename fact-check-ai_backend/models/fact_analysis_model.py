from pydantic import BaseModel, Field
from typing import List, Literal

# ----------------------------------------------------- FACT ANALYSIS MODEL -----------------------------------------------------

class Source(BaseModel):
    source: str = Field(description="The type of source used for verification (e.g., peer-reviewed research paper, official government report, reputable news article, fact-checking website).")
    url: str = Field(description="The direct URL link to the source used for fact-checking.")
    relevant_evidence_excerpt: List[str] = Field(description="The excerpt from the sources as evidence")

class ManipulationFlag(BaseModel):
    manipulation_flag: bool
    summay: str

class Claim(BaseModel):
    claim: str = Field(description="The specific factual statement or assertion extracted from the article")
    fact_check_category: str = Field(description="The classification of the claim's accuracy [True, Misleading, False, Unverifiable].")
    sources : List[Source]
    raw_content : List[str] = Field(description="The raw content of the claim as extracted from the article.")
    manipuation: ManipulationFlag
    
class ClaimsResponse(BaseModel):
    claims: List[Claim] = Field(description="List of claims with their verification details.")
    category: str
    overall_category: str
    notes: str
    
report_format = ClaimsResponse.model_json_schema()

# ----------------------------------------------------- SOURCE MODEL -----------------------------------------------------

class Tonality(BaseModel):
    simplification: int
    dramatization: int 
    framing_shift: int 
    context_erosion: int 

class Authenticity(BaseModel):
    verbatim_match: float  # 0.0-1.0
    omission_rate: float  # 0.0-1.0
    novelty_ratio: float  # 0.0-1.0
    citation_integrity: Literal["Verified", "Unverified", "Misattributed"]
    temporal_consistency: Literal["Valid", "Anomalous"]

class Bias(BaseModel):
    political_leaning: Literal["Left", "Right", "Neutral"]
    commercial_interests: bool
    institutional_affiliations: List[str]

class SourceVerification(BaseModel):
    id: int
    type: Literal["verification", "target"]
    article_url: str
    source_tier: int  # 1-4
    content_type: Literal[
        "Government Statements",
        "Official statements",
        "Press Releases",
        "Peer-reviewed journals",
        "Industry reports",
        "Reputed News",
        "Forums",
        "Social media"
    ]
    domain_name: str
    publish_time: str
    tonality: Tonality
    authenticity: Authenticity
    bias: Bias
    bias_summary: str

class SourceResponse(BaseModel):
    sources: List[SourceVerification]
    
source_format = SourceResponse.model_json_schema()