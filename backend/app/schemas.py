from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Event schemas
class EventBase(BaseModel):
    title: str
    slug: str
    type: Optional[str] = "summit"
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    mode: Optional[str] = "in_person"
    location: Optional[str] = "Berhampur, Odisha, India"
    registration_open: Optional[bool] = True
    image_url: Optional[str] = None
    status: Optional[str] = "published"
    display_order: Optional[int] = 0

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    registration_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Registration schemas
class RegistrationCreate(BaseModel):
    event_id: Optional[int] = None
    event_slug: Optional[str] = None
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None  # Or role / college / company
    track: Optional[str] = None  # Preferred program / track
    notes: Optional[str] = None

class RegistrationResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    track: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Notice / Announcement schemas
class NoticeResponse(BaseModel):
    id: int
    title: str
    tag: Optional[str] = "IMPORTANT"
    body: Optional[str] = None
    posted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

