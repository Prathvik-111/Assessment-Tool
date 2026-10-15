from pydantic import BaseModel, Field


class RubricCriterion(BaseModel):
    name: str
    description: str
    max_points: float = Field(gt=0)
