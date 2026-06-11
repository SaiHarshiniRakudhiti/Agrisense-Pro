from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserInDB(BaseModel):
    id: str
    email: str
    hashed_password: str
    full_name: str
    farm_name: Optional[str] = None
    location:  Optional[str] = None
    created_at: datetime = datetime.utcnow()
    is_active: bool = True
