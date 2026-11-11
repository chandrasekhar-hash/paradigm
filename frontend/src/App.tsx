import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useCinematicMotion } from "./hooks/useCinematicMotion";
import RegistrationModal from "./components/RegistrationModal";

const HeroCanvas = lazy(() =>
  import("./components/ExperienceCanvas").then((module) => ({ default: module.HeroCanvas })),
);
const NetworkCanvas = lazy(() =>
  import("./components/ExperienceCanvas").then((module) => ({ default: module.NetworkCanvas })),
);

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>
);

const Mark = () => (
  <a className="wordmark" href="#top" aria-label="PARADIGM home">
    PARADIGM<span>®</span>
  </a>
);

const navItems = [
  ["ABOUT", "manifesto"],
  ["PROGRAMS", "programs"],
  ["PARTICIPATION", "participation"],
  ["NOTICES", "notices"],
  ["CONTACT", "contact"],
];

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-35% 0px -55%" },
    );
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
        <Mark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <a className={active === id ? "active" : ""} href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <button className="nav-cta" type="button" onClick={() => setRegOpen(true)}>
          REGISTER NOW <Arrow diagonal />
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>
      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <div className="mobile-menu-meta mono">NAVIGATION / PARADIGM®</div>
        <nav aria-label="Mobile navigation">
          {navItems.map(([label, id], index) => (
            <a href={`#${id}`} key={id} onClick={close}>
              <span className="mono">0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <button className="button button-lime mobile-register" type="button" onClick={() => { setRegOpen(true); close(); }}>
          REGISTER FOR PARADIGM <Arrow />
        </button>
        <div className="mobile-location mono">BERHAMPUR / ODISHA / INDIA</div>
      </div>
    </>
  );
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label mono">
      <span>{index}</span>
      <span>{children}</span>
    </div>
  );
}

function Hero({ progress }: { progress: React.MutableRefObject<{ value: number }> }) {
  return (
    <section className="hero" id="top">
      <div className="hero-scene" aria-hidden="true">
        <Suspense fallback={<div className="scene-loading mono">INITIALISING / 3D</div>}>
          <HeroCanvas progress={progress} />
        </Suspense>
      </div>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-brand-kinetic" aria-hidden="true">
        {"PARADIGM".split("").map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </div>
      <div className="hero-location mono">
        <span className="status-dot" />
        BERHAMPUR, ODISHA / INDIA
      </div>
      <div className="hero-copy">
        <div className="eyebrow mono">AI &amp; LOCAL DEVELOPMENT / BERHAMPUR</div>
        <h1>
          <span className="hero-line-mask">
            <span className="hero-line-inner">THINK BEYOND</span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line-inner">
              THE <em>KNOWN.</em>
            </span>
          </span>
        </h1>
        <p>
          A gathering of thinkers, innovators, researchers and creators challenging conventional
          thinking and shaping new possibilities.
        </p>
        <div className="hero-actions">
          <a className="button button-light" href="#manifesto">
            EXPLORE PARADIGM <Arrow />
          </a>
          <a className="text-link" href="#register">
            REGISTER NOW <Arrow diagonal />
          </a>
        </div>
      </div>
      <div className="hero-index mono">
        <span>PARADIGM / 001</span>
        <span>CHANGE THE PERSPECTIVE</span>
      </div>
      <a className="scroll-cue mono" href="#manifesto">
        <span>SCROLL TO SHIFT</span>
        <i />
      </a>
      <div className="hero-transition-mask" aria-hidden="true" />
    </section>
  );
}

const participants = [
  {
    number: "01",
    title: "CLASSES 8–10",
    description: "Curiosity-led exploration for students across diverse learning environments.",
    detail:
      "Government schools / Shishu Mandir & Odia-medium private schools / English-medium schools",
    tags: ["DISCOVERY", "IDEATION"],
    art: "rings",
  },
  {
    number: "02",
    title: "CLASSES 11–12 + DROPOUTS",
    description: "Real-world thinking, practical problem-solving and exposure to innovation.",
    detail:
      "Eligible participants may receive an admission discount. Exact conditions to be confirmed.",
    tags: ["PROBLEM SOLVING", "EXPOSURE"],
    art: "beam",
  },
  {
    number: "03",
    title: "DIPLOMA + ITI",
    description: "Applied skills meet experimentation through collaborative building.",
    detail: "Proposed team size: 2–4 members where applicable.",
    tags: ["HACKATHON", "STUDENT INNOVATION"],
    art: "grid",
  },
  {
    number: "04",
    title: "UNDERGRADUATE",
    description: "A space to test ambitious ideas, create prototypes and challenge assumptions.",
    detail: "Proposed team size: 2–4 members where applicable.",
    tags: ["HACKATHON", "STUDENT INNOVATION"],
    art: "sphere",
  },
  {
    number: "05",
    title: "POSTGRADUATE + PhD",
    description: "Rigorous inquiry, research exchange and ideas with potential for wider impact.",
    detail: "Proposed team size: 2–4 members where applicable.",
    tags: ["RESEARCH", "INVESTOR PITCH"],
    art: "wave",
  },
];

function ParticipantPanel({ item, index }: { item: (typeof participants)[number]; index: number }) {
  return (
    <article
      className="participant-panel"
      data-participant-index={index}
      style={{ zIndex: participants.length - index }}
    >
      <div className="panel-top">
        <span className="panel-number">{item.number}</span>
        <span className="mono">PARTICIPANT GROUP</span>
      </div>
      <div className={`panel-art art-${item.art}`} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="panel-content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <small>{item.detail}</small>
        <div className="tag-row">
          {item.tags.map((tag) => (
            <span className="tag mono" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <a href="#register" className="panel-link mono">
          REGISTER INTEREST <Arrow diagonal />
        </a>
      </div>
    </article>
  );
}

const programs = [
  [
    "01",
    "HACKATHON",
    "Collaborative problem-solving, experimentation and working prototypes.",
    "BUILD / TEST / ITERATE",
  ],
  [
    "02",
    "STUDENT INNOVATION",
    "Encouraging students to explore original ideas and practical solutions.",
    "QUESTION / CREATE / APPLY",
  ],
  [
    "03",
    "RESEARCH",
    "Exploration, research presentations and evidence-based thinking.",
    "OBSERVE / ANALYSE / SHARE",
  ],
  [
    "04",
    "INVESTOR PITCH",
    "Presenting ideas, opportunities and potential impact.",
    "FRAME / PRESENT / CONNECT",
  ],
];

interface Notice {
  id: number;
  title: string;
  tag: string;
  body: string;
  posted_at: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchNotices = () => {
    setLoading(true);
    setFetchError(false);
    fetch("/api/notices")
      .then((r) => { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then((data: Notice[]) => { setNotices(data); setLoading(false); })
      .catch(() => { setFetchError(true); setLoading(false); });
  };

  useEffect(() => { fetchNotices(); }, []);

  return (
    <div className="notice-board">
      <div className="notice-content" aria-live="polite">
        {loading && (
          <div className="state-message loading-state">
            <div className="loader-lines"><i /><i /><i /></div>
            <span className="mono">CONNECTING TO NOTICE SOURCE</span>
            <h3>LOADING ANNOUNCEMENTS</h3>
          </div>
        )}
        {!loading && fetchError && (
          <div className="state-message">
            <span className="state-code mono">ERR / SOURCE UNAVAILABLE</span>
            <h3>NOTICES COULDN&rsquo;T LOAD.</h3>
            <p>Please try again when the external source is available.</p>
            <button className="button button-outline" type="button" onClick={fetchNotices}>
              TRY AGAIN <Arrow />
            </button>
          </div>
        )}
        {!loading && !fetchError && notices.length === 0 && (
          <div className="state-message">
            <span className="state-code mono">00 / EMPTY</span>
            <h3>NO ANNOUNCEMENTS <em>YET.</em></h3>
            <p>Stay tuned for updates from PARADIGM.</p>
          </div>
        )}
        {!loading && !fetchError && notices.length > 0 && (
          <div className="notice-preview">
            {notices.map((n) => (
              <div className="notice-row" key={n.id}>
                <div className="notice-meta mono">
                  {new Date(n.posted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} / {n.tag.toUpperCase()}
                </div>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
              </div>
            ))}
            <div className="notice-categories mono">
              <span>PARADIGM 2026</span><span>REGISTRATION</span><span>SCHEDULE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceChrome() {
  const cursor = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    const render = () => {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      if (cursor.current) cursor.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };
    const hover = (event: MouseEvent) => {
      const interactive = (event.target as HTMLElement).closest("a, button");
      cursor.current?.classList.toggle("is-hovering", Boolean(interactive));
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", hover);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", hover);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={cursor}>
        <span>VIEW</span>
      </div>
      <div className="cursor-dot" ref={dot} />
      <div className="experience-progress" aria-hidden="true">
        <span className="mono">PROGRESS</span>
        <i>
          <b style={{ transform: `scaleY(${progress})` }} />
        </i>
        <strong className="mono">{String(Math.round(progress * 100)).padStart(2, "0")}</strong>
      </div>
    </>
  );
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const heroProgress = useRef({ value: 0 });
  const networkProgress = useRef({ value: 0 });
  const [regOpen, setRegOpen] = useState(false);
  useCinematicMotion(root, heroProgress, networkProgress);

  return (
    <div ref={root}>
      <ExperienceChrome />
      <Navigation />
      <main>
        <Hero progress={heroProgress} />

        <section className="manifesto" id="manifesto">
          <div className="manifesto-stage">
            <div className="manifesto-side">
              <SectionLabel index="02">THE MANIFESTO</SectionLabel>
            </div>
            <div className="manifesto-lines">
              <p>
                EVERY IDEA BEGINS WITH <em>A QUESTION.</em>
              </p>
              <p>
                EVERY QUESTION OPENS <em>A POSSIBILITY.</em>
              </p>
              <p>
                EVERY POSSIBILITY CAN <em>CHANGE SOMETHING.</em>
              </p>
            </div>
            <div className="manifesto-final">
              <span className="mono">A CHANGE IN PERSPECTIVE / NOT JUST AN EVENT</span>
              <h2>
                PARADIGM IS A <em>CHANGE</em>
                <br />
                IN PERSPECTIVE.
              </h2>
            </div>
            <div className="manifesto-counter mono">QUESTION / POSSIBILITY / CHANGE</div>
          </div>
          <div className="manifesto-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </section>

        <section className="participation" id="participation">
          <div className="section-intro">
            <SectionLabel index="03">WHO IT’S FOR</SectionLabel>
            <h2>
              DIFFERENT MINDS.
              <br />
              <em>ONE PLATFORM.</em>
            </h2>
            <p>
              A platform designed for curious minds at different stages of their educational
              journey.
            </p>
          </div>
          <div className="participant-stack-stage">
            <div className="panel-scroll participant-stack">
              {participants.map((item, index) => (
                <ParticipantPanel item={item} index={index} key={item.number} />
              ))}
            </div>
            <div className="participant-progress" aria-live="polite">
              <span className="mono">
                <b className="participant-progress-current">01</b> / 05
              </span>
              <strong className="participant-progress-name mono">CLASSES 8–10</strong>
              <i aria-hidden="true">
                <b className="participant-progress-fill" />
              </i>
              <small className="mono">ACTIVE CATEGORY</small>
            </div>
          </div>
          <div className="scroll-note mono">SCROLL TO ADVANCE — 05 GROUPS</div>
        </section>

        <section className="programs" id="programs">
          <div className="programs-heading">
            <SectionLabel index="04">THE PROGRAMS</SectionLabel>
            <h2>
              IDEAS INTO <em>ACTION.</em>
            </h2>
          </div>
          <div className="program-list">
            {programs.map(([number, title, copy, meta]) => (
              <article className="program-row" key={number}>
                <span className="program-number mono">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="program-meta mono">{meta}</span>
                <span className="program-arrow">
                  <Arrow diagonal />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="theme" id="theme">
          <div className="theme-copy">
            <SectionLabel index="05">CENTRAL THEME</SectionLabel>
            <h2>
              AI &amp; LOCAL
              <br />
              <em>DEVELOPMENT.</em>
            </h2>
            <p>
              Technology with a purpose.
              <br />
              Ideas that address real-world challenges.
            </p>
            <div className="theme-key mono">
              <span>01 / TECHNOLOGY</span>
              <span>02 / COMMUNITY</span>
              <span>03 / OUTCOMES</span>
            </div>
          </div>
          <Suspense
            fallback={<div className="network-scene-loading mono">CONSTRUCTING NETWORK / 3D</div>}
          >
            <NetworkCanvas progress={networkProgress} />
          </Suspense>
        </section>

        <section className="notices" id="notices">
          <div className="notices-heading">
            <SectionLabel index="06">ANNOUNCEMENTS</SectionLabel>
            <h2>
              WHAT’S HAPPENING
              <br />
              AT <em>PARADIGM?</em>
            </h2>
            <p className="mono">LIVE CONTENT / EXTERNAL API READY</p>
          </div>
          <NoticeBoard />
        </section>

        <section className="registration" id="register">
          <div className="registration-top mono">
            <span>07 / TAKE PART</span>
            <span>BERHAMPUR, ODISHA</span>
          </div>
          <h2>
            YOUR IDEAS
            <br />
            DESERVE A <em>PLATFORM.</em>
          </h2>
          <div className="registration-bottom">
            <p>Be part of something that challenges conventional thinking.</p>
            <button
              className="register-button"
              type="button"
              title="Registration destination to be connected"
            >
              REGISTER FOR PARADIGM <Arrow />
            </button>
          </div>
          <div className="registration-ring" aria-hidden="true" />
        </section>
      </main>

      <footer id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <Mark />
            <p>
              An innovation, research and technology initiative for curious minds ready to think
              beyond the known.
            </p>
            <span className="mono">BERHAMPUR / ODISHA / INDIA</span>
          </div>
          <div className="footer-links">
            <div>
              <span className="mono">EXPLORE</span>
              <a href="#manifesto">About</a>
              <a href="#programs">Programs</a>
              <a href="#participation">Participation</a>
            </div>
            <div>
              <span className="mono">CONNECT</span>
              <a href="#notices">Announcements</a>
              <span>Contact / TBC</span>
              <span>Instagram / TBC</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom mono">
          <span>© PARADIGM® / YEAR TO BE CONFIRMED</span>
          <span>THINK BEYOND THE KNOWN.</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
      <RegistrationModal isOpen={regOpen} onClose={() => setRegOpen(false)} />
    </div>
  );
}
