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
        existing_cols = {
            row[1] for row in conn.execute(sqlalchemy.text("PRAGMA table_info('event_registrations')")).fetchall()
        }
        
        columns_to_add = [
            ("track", "VARCHAR(100)"),
            ("category", "VARCHAR(100)"),
            ("city", "VARCHAR(100)"),
            ("state", "VARCHAR(100)"),
            ("education_level", "VARCHAR(100)"),
            ("course", "VARCHAR(100)"),
            ("academic_stage", "VARCHAR(100)"),
            ("institution_type", "VARCHAR(100)"),
            ("participation_mode", "VARCHAR(50)"),
            ("team_name", "VARCHAR(100)"),
            ("team_members", "TEXT"),
            ("interests", "TEXT"),
            ("notes", "TEXT"),
        ]

        for col_name, col_type in columns_to_add:
            if col_name not in existing_cols:
                try:
                    conn.execute(sqlalchemy.text(f"ALTER TABLE event_registrations ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                except Exception as ex:
                    print(f"[!] Migration check for column {col_name}: {ex}")


_migrate_event_registrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
