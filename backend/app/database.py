import os
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Path to the separate-management-dashboard database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MGMT_DB_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "..", "..", "..", "separate-management-dashboard", "database", "edutrack.db")
)
FALLBACK_DB_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "..", "database", "edutrack.db")
)

# Use management database if present, else fallback
if os.path.exists(MGMT_DB_PATH):
    DB_PATH = MGMT_DB_PATH
else:
    DB_PATH = FALLBACK_DB_PATH
    os.makedirs(os.path.dirname(FALLBACK_DB_PATH), exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"[*] Event Page Backend connected to database: {DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def _migrate_event_registrations():
    """Add missing columns to the shared event_registrations table without
    destroying existing data. Safe to run on every startup."""
    with engine.connect() as conn:
        has_track = conn.execute(
            sqlalchemy.text(
                "SELECT COUNT(*) FROM pragma_table_info('event_registrations') "
                "WHERE name = 'track'"
            )
        ).scalar()
        if not has_track:
            conn.execute(
                sqlalchemy.text("ALTER TABLE event_registrations ADD COLUMN track VARCHAR(100)")
            )
            conn.commit()


_migrate_event_registrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
