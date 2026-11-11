from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class PublicEvent(Base):
    __tablename__ = "public_events"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    type = Column(String(50), default="summit")
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=True)
    mode = Column(String(50), default="in_person")
    location = Column(String(200), default="Berhampur, Odisha, India")
    registration_open = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="published")
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("public_events.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=False)
    organization = Column(String(200), nullable=True)
    track = Column(String(100), nullable=True)
    status = Column(String(50), default="registered")
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("PublicEvent", back_populates="registrations")


class InformationPost(Base):
    __tablename__ = "information_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    tag = Column(String(100), nullable=True)
    body = Column(Text, nullable=True)
    posted_at = Column(DateTime, default=datetime.utcnow)

