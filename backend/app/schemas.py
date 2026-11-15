from datetime import datetime
from typing import Optional, List, Any, Union
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
    name: Optional[str] = None
    fullName: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    mobile: Optional[str] = None
    organization: Optional[str] = None
    institution: Optional[str] = None
    track: Optional[str] = None
    category: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    education_level: Optional[str] = None
    educationLevel: Optional[str] = None
    course: Optional[str] = None
    academic_stage: Optional[str] = None
    academicStage: Optional[str] = None
    institution_type: Optional[str] = None
    institutionType: Optional[str] = None
    interests: Optional[Any] = None
    participation_mode: Optional[str] = None
    participationMode: Optional[str] = None
    team_name: Optional[str] = None
    teamName: Optional[str] = None
    team_members: Optional[Any] = None
    teamMembers: Optional[Any] = None
    notes: Optional[str] = None

class RegistrationResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    track: Optional[str] = None
    category: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    education_level: Optional[str] = None
    course: Optional[str] = None
    participation_mode: Optional[str] = None
    team_name: Optional[str] = None
    status: str
    pass_code: Optional[str] = None
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

