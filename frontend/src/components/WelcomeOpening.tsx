import { useEffect, useRef } from "react";
import gsap from "gsap";

interface WelcomeOpeningProps {
  onRevealHero: () => void;
  onComplete: () => void;
}

export function WelcomeOpening({ onRevealHero, onComplete }: WelcomeOpeningProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Screen 1 refs
  const screen1Ref = useRef<HTMLDivElement>(null);
  const brand1Ref = useRef<HTMLSpanElement>(null);
  const s1Line1Ref = useRef<HTMLSpanElement>(null);
  const s1Line2Ref = useRef<HTMLSpanElement>(null);

  // Screen 2 refs
  const screen2Ref = useRef<HTMLDivElement>(null);
  const brand2Ref = useRef<HTMLSpanElement>(null);
  const s2Line1Ref = useRef<HTMLSpanElement>(null);
  const s2Line2Ref = useRef<HTMLSpanElement>(null);

  // Stage tracking: 1 = Screen 1, 2 = Screen 2, 3 = Exiting to Hero, 4 = Done
  const currentStageRef = useRef<number>(1);
  const isTransitioningRef = useRef<boolean>(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastTransitionTimeRef = useRef<number>(0);

  useEffect(() => {
    // If reduced motion is requested, immediately reveal hero and complete
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onRevealHero();
      onComplete();
      return;
    }

    const clearTimer = () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };

    // Forward declaration of functions for mutual recursion / reference
    const advanceToHero = () => {
      if (currentStageRef.current >= 3 || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      currentStageRef.current = 3;
      clearTimer();

      // Clean up window listeners
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);

      if (activeTimelineRef.current && activeTimelineRef.current.isActive()) {
        activeTimelineRef.current.kill();
      }

      const exitTl = gsap.timeline();
      activeTimelineRef.current = exitTl;

      exitTl
        .to([s2Line1Ref.current, s2Line2Ref.current, brand2Ref.current], {
          yPercent: -45,
          opacity: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: "power3.inOut",
        })
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.65,
            ease: "power2.inOut",
          },
          "-=0.3",
        )
        .call(() => {
          onRevealHero();
        }, undefined, "-=0.25")
        .call(() => {
          currentStageRef.current = 4;
          onComplete();
        });
    };

    const startStage2Entrance = () => {
      if (!screen2Ref.current) return;
      screen2Ref.current.style.display = "flex";

      if (activeTimelineRef.current && activeTimelineRef.current.isActive()) {
        activeTimelineRef.current.kill();
      }

      const entranceTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          isTransitioningRef.current = false;
          lastTransitionTimeRef.current = Date.now();
          autoTimerRef.current = setTimeout(() => {
            advanceToHero();
          }, 3000);
        },
      });
      activeTimelineRef.current = entranceTl;

      // Reset initial styles
      gsap.set(brand2Ref.current, { opacity: 0, y: 12 });
      gsap.set(s2Line1Ref.current, { yPercent: 125, opacity: 0 });
      gsap.set(s2Line2Ref.current, { yPercent: 125, opacity: 0 });

      // 1. Brand label
      entranceTl.to(
        brand2Ref.current,
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
        0.05,
      );

      // 2. WELCOME TO AN EXCITING EVENT
      entranceTl.to(
        s2Line1Ref.current,
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
        0.15,
      );

      // 3. PARADIGM
      entranceTl.to(
        s2Line2Ref.current,
        { yPercent: 0, opacity: 1, duration: 1.25, ease: "power4.out" },
        0.32,
      );
    };

    const advanceToStage2 = () => {
      if (currentStageRef.current !== 1 || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      clearTimer();

      if (activeTimelineRef.current && activeTimelineRef.current.isActive()) {
        activeTimelineRef.current.kill();
      }

      const exitTl = gsap.timeline({
        onComplete: () => {
          if (screen1Ref.current) {
            screen1Ref.current.style.display = "none";
          }
          currentStageRef.current = 2;
          lastTransitionTimeRef.current = Date.now();
          startStage2Entrance();
        },
      });
      activeTimelineRef.current = exitTl;

      exitTl.to([s1Line1Ref.current, s1Line2Ref.current, brand1Ref.current], {
        yPercent: -45,
        opacity: 0,
        duration: 0.55,
        stagger: 0.04,
        ease: "power3.inOut",
      });
    };

    // User interaction handler to skip remaining hold or advance immediately
    const triggerSkip = () => {
      // Cooldown to prevent residual inertial trackpad/touch swipe momentum from double-skipping
      if (Date.now() - lastTransitionTimeRef.current < 450) return;
      if (isTransitioningRef.current) return;

      if (currentStageRef.current === 1) {
        advanceToStage2();
      } else if (currentStageRef.current === 2) {
        advanceToHero();
      }
    };

    // Mouse wheel / trackpad scroll handler
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 6 || Math.abs(e.deltaX) > 10) {
        triggerSkip();
      }
    };

    // Touch swipe handler
    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY;
      const deltaX = Math.abs(touchStartX - currentX);
      if (Math.abs(deltaY) > 15 || deltaX > 25) {
        triggerSkip();
      }
    };

    // Keyboard navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", "Space", "Enter"].includes(e.code)) {
        triggerSkip();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    // Initial entrance for Stage 1 (Screen 1: Namaste Berhampur)
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          isTransitioningRef.current = false;
          lastTransitionTimeRef.current = Date.now();
          autoTimerRef.current = setTimeout(() => {
            advanceToStage2();
          }, 3000);
        },
      });
      activeTimelineRef.current = entranceTl;

      // 1. Subtle brand mono identifier
      entranceTl.fromTo(
        brand1Ref.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
        0.08,
      );

      // 2. NAMASTE
      entranceTl.fromTo(
        s1Line1Ref.current,
        { yPercent: 125, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
        0.2,
      );

      // 3. BERHAMPUR.
      entranceTl.fromTo(
        s1Line2Ref.current,
        { yPercent: 125, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.25, ease: "power4.out" },
        0.38,
      );
    }, overlayRef);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimer();
      ctx.revert();
    };
  }, [onRevealHero, onComplete]);

  return (
    <div className="welcome-overlay" ref={overlayRef} aria-live="polite">
      {/* SCREEN 1: City Welcome */}
      <div className="welcome-screen welcome-screen-1" ref={screen1Ref}>
        <div className="welcome-brand-mask">
          <span className="welcome-brand mono" ref={brand1Ref}>
            PARADIGM®
          </span>
        </div>
        <h1 className="welcome-heading">
          <span className="welcome-line-mask">
            <span className="welcome-line-inner welcome-line-1" ref={s1Line1Ref}>
              NAMASTE
            </span>
          </span>
          <span className="welcome-line-mask">
            <span className="welcome-line-inner welcome-line-2" ref={s1Line2Ref}>
              <em>BERHAMPUR.</em>
            </span>
          </span>
        </h1>
      </div>

      {/* SCREEN 2: Event Welcome */}
      <div
        className="welcome-screen welcome-screen-2"
        ref={screen2Ref}
        style={{ display: "none" }}
      >
        <div className="welcome-brand-mask">
          <span className="welcome-brand mono" ref={brand2Ref}>
            ODISHA / 2026
          </span>
        </div>
        <div className="welcome-event-heading">
          <span className="welcome-line-mask">
            <span className="welcome-line-inner welcome-event-sub" ref={s2Line1Ref}>
              WELCOME TO AN EXCITING EVENT
            </span>
          </span>
          <span className="welcome-line-mask">
            <span className="welcome-line-inner welcome-event-brand" ref={s2Line2Ref}>
              PARADIGM
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
