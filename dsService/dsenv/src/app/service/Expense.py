from typing import Optional
from pydantic import BaseModel, Field

class Expense(BaseModel):
    amount: Optional[str] = Field(description="Transaction amount")
    merchant: Optional[str] = Field(description="Merchant name")
    currency: Optional[str] = Field(description="Currency")
