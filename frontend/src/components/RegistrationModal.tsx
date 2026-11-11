import React, { useState } from "react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [track, setTrack] = useState("AI & Agentic Systems");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [regId, setRegId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      email,
      phone,
      organization: organization || "Independent",
      track,
      event_slug: "paradigm-2026"
    };

    const endpoints = [
      "/api/register",
      "http://localhost:8005/api/register",
      "http://localhost:8002/api/v1/website/events/register"
    ];

    let registered = false;
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setRegId(data.id || Math.floor(1000 + Math.random() * 9000));
          setSuccess(true);
          registered = true;
          break;
        }
      } catch (err) {
        // try fallback endpoint
      }
    }

    setLoading(false);
    if (!registered) {
      setError("Unable to submit registration. Please ensure backend is running or try again.");
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setError("");
    setName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(8, 11, 15, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div
        style={{
          background: "#101820",
          border: "1px solid #29343d",
          borderRadius: "16px",
          maxWidth: "520px",
          width: "100%",
          padding: "2rem",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 30px rgba(198, 255, 77, 0.12)",
          position: "relative",
          color: "#f4f5f6",
          fontFamily: "'Space Grotesk', sans-serif"
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={resetAndClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid #29343d",
            color: "#929ba5",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1rem"
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(198, 255, 77, 0.15)",
                border: "2px solid #c6ff4d",
                color: "#c6ff4d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                margin: "0 auto 1.25rem auto"
              }}
            >
              ✓
            </div>
            <div
              className="mono"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                color: "#c6ff4d",
                marginBottom: "0.5rem"
              }}
            >
              REGISTRATION CONFIRMED / PASS #{regId}
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem", color: "#f4f5f6" }}>
              WELCOME TO PARADIGM
            </h3>
            <p style={{ color: "#929ba5", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Your seat request has been registered in the system. Our team will contact you via email and phone with access credentials and the venue agenda.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              style={{
                background: "#c6ff4d",
                color: "#080b0f",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.75rem",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.05em"
              }}
            >
              DONE / CLOSE
            </button>
          </div>
        ) : (
          <div>
            <div
              className="mono"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                color: "#c6ff4d",
                marginBottom: "0.4rem"
              }}
            >
              07 / OFFICIAL PARTICIPATION
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 600, marginBottom: "0.5rem", color: "#f4f5f6" }}>
              REGISTER FOR <em style={{ fontStyle: "italic", fontFamily: "'Instrument Serif', serif" }}>PARADIGM 2026</em>
            </h2>
            <p style={{ color: "#929ba5", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
              Berhampur, Odisha. Free registration for students, tech creators, and founders.
            </p>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fca5a5",
                  padding: "0.6rem 0.9rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  marginBottom: "1rem"
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#929ba5", marginBottom: "0.25rem" }} className="mono">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sambit Kumar"
                  style={{
                    width: "100%",
                    background: "#080b0f",
                    border: "1px solid #29343d",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    color: "#f4f5f6",
                    outline: "none",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#929ba5", marginBottom: "0.25rem" }} className="mono">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    style={{
                      width: "100%",
                      background: "#080b0f",
                      border: "1px solid #29343d",
                      borderRadius: "8px",
                      padding: "0.65rem 0.85rem",
                      color: "#f4f5f6",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#929ba5", marginBottom: "0.25rem" }} className="mono">
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: "100%",
                      background: "#080b0f",
                      border: "1px solid #29343d",
                      borderRadius: "8px",
                      padding: "0.65rem 0.85rem",
                      color: "#f4f5f6",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#929ba5", marginBottom: "0.25rem" }} className="mono">
                  COLLEGE / INSTITUTION / COMPANY
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Berhampur University / Tech Startup"
                  style={{
                    width: "100%",
                    background: "#080b0f",
                    border: "1px solid #29343d",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    color: "#f4f5f6",
                    outline: "none",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#929ba5", marginBottom: "0.25rem" }} className="mono">
                  PREFERRED TRACK
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#080b0f",
                    border: "1px solid #29343d",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    color: "#f4f5f6",
                    outline: "none",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="AI & Agentic Systems">AI & Agentic Systems</option>
                  <option value="Robotics & IoT Prototyping">Robotics & IoT Prototyping</option>
                  <option value="Full-Stack & Cloud Architecture">Full-Stack & Cloud Architecture</option>
                  <option value="Founder & Startup Pitch">Founder & Startup Pitch</option>
                  <option value="General Participant / Attendee">General Participant / Attendee</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#c6ff4d",
                  color: "#080b0f",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.85rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  marginTop: "0.5rem",
                  transition: "opacity 0.2s"
                }}
              >
                {loading ? "TRANSMITTING DATA..." : "CONFIRM REGISTRATION →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

