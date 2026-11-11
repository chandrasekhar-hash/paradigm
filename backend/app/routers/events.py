from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import PublicEvent, EventRegistration, InformationPost
from ..schemas import EventCreate, EventResponse, RegistrationCreate, RegistrationResponse, NoticeResponse

router = APIRouter(prefix="/api", tags=["Events & Registrations"])

def ensure_paradigm_event(db: Session) -> PublicEvent:
    """Ensures the flagship PARADIGM 2026 event exists in the database."""
    event = db.query(PublicEvent).filter(
        or_(PublicEvent.slug == "paradigm-2026", PublicEvent.title.ilike("%paradigm%"))
    ).first()
    if not event:
        event = PublicEvent(
            slug="paradigm-2026",
            title="PARADIGM 2026",
            type="summit",
            description="Annual Flagship Tech, AI & Innovation Summit in Berhampur, Odisha. Where different minds challenge conventional thinking.",
            event_date=datetime(2026, 12, 18, 9, 30),
            mode="in_person",
            location="Berhampur, Odisha, India",
            registration_open=True,
            image_url="/images/paradigm-hero.png",
            status="published",
            display_order=0
        )
        db.add(event)
        db.commit()
        db.refresh(event)
    return event


@router.get("/events", response_model=List[EventResponse])
def get_events(
    status: Optional[str] = "published",
    db: Session = Depends(get_db)
):
    """Retrieve all active public events."""
    ensure_paradigm_event(db)
    query = db.query(PublicEvent)
    if status:
        query = query.filter(PublicEvent.status == status)
    events = query.order_by(PublicEvent.display_order.asc(), PublicEvent.event_date.asc()).all()
    
    # Calculate registration counts
    result = []
    for e in events:
        resp = EventResponse.model_validate(e)
        resp.registration_count = len(e.registrations) if e.registrations else 0
        result.append(resp)
    return result


@router.get("/events/{id_or_slug}", response_model=EventResponse)
def get_event(
    id_or_slug: str,
    db: Session = Depends(get_db)
):
    """Retrieve a single event by ID or slug."""
    ensure_paradigm_event(db)
    if id_or_slug.isdigit():
        event = db.query(PublicEvent).filter(PublicEvent.id == int(id_or_slug)).first()
    else:
        event = db.query(PublicEvent).filter(PublicEvent.slug == id_or_slug).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    resp = EventResponse.model_validate(event)
    resp.registration_count = len(event.registrations) if event.registrations else 0
    return resp


@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/events/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_for_event(
    reg_in: RegistrationCreate,
    db: Session = Depends(get_db)
):
    """Register for an event. Automatically connects to the flagship Paradigm event if not specified."""
    event = None
    if reg_in.event_id:
        event = db.query(PublicEvent).filter(PublicEvent.id == reg_in.event_id).first()
    elif reg_in.event_slug:
        event = db.query(PublicEvent).filter(PublicEvent.slug == reg_in.event_slug).first()
        
    if not event:
        event = ensure_paradigm_event(db)

    # Check for duplicate registration for same email & event
    existing = db.query(EventRegistration).filter(
        EventRegistration.event_id == event.id,
        EventRegistration.email == reg_in.email
    ).first()
    if existing:
        return existing

    new_reg = EventRegistration(
        event_id=event.id,
        name=reg_in.name,
        email=reg_in.email,
        phone=reg_in.phone,
        organization=reg_in.organization,
        track=reg_in.track or reg_in.notes,
        status="registered",
        created_at=datetime.utcnow()
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return new_reg


@router.get("/registrations", response_model=List[RegistrationResponse])
def list_registrations(
    event_id: Optional[int] = None,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """List event registrations (shared with separate management dashboard)."""
    query = db.query(EventRegistration)
    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)
    return query.order_by(EventRegistration.created_at.desc()).limit(limit).all()


@router.get("/notices", response_model=List[NoticeResponse])
@router.get("/announcements", response_model=List[NoticeResponse])
def get_notices(db: Session = Depends(get_db)):
    """Fetch live announcements & notices for PARADIGM NoticeBoard."""
    posts = db.query(InformationPost).order_by(InformationPost.posted_at.desc()).limit(10).all()
    if not posts:
        # Seed default Paradigm notices if table is empty
        sample_notices = [
            InformationPost(
                title="Registration Now Open for PARADIGM 2026",
                tag="REGISTRATION",
                body="Applications are officially open for all university students, researchers, and tech founders across Odisha.",
                posted_at=datetime.utcnow()
            ),
            InformationPost(
                title="AI & Agentic Systems Hackathon Problem Statements Released",
                tag="IMPORTANT",
                body="Explore the 4 national-level challenges for the 36-hour build sprint. Mentorship sessions schedule published.",
                posted_at=datetime.utcnow()
            ),
            InformationPost(
                title="Keynote Speaker Lineup & Panel Schedule",
                tag="SCHEDULE",
                body="Distinguished industry leads from Google, leading AI research labs, and regional founders will lead the keynote sessions.",
                posted_at=datetime.utcnow()
            )
        ]
        db.add_all(sample_notices)
        db.commit()
        posts = db.query(InformationPost).order_by(InformationPost.posted_at.desc()).all()
        
    return posts

