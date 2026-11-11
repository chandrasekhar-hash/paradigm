import { useLayoutEffect, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProgressRef = MutableRefObject<{ value: number }>;

export function useCinematicMotion(
  root: RefObject<HTMLElement | null>,
  heroProgress: ProgressRef,
  networkProgress: ProgressRef,
) {
  useLayoutEffect(() => {
    if (!root.current) return;
    const interactionCleanups: Array<() => void> = [];

    const context = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(
          ".hero-line-inner, .hero-copy > p, .hero-actions, .manifesto-lines p, .manifesto-final",
          {
            clearProps: "all",
          },
        );
        return;
      }

      const media = gsap.matchMedia();

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".hero-brand-kinetic span", {
          yPercent: 120,
          rotate: 7,
          stagger: 0.035,
          duration: 1.2,
        })
        .from(".hero-line-inner", { yPercent: 115, rotate: 3, stagger: 0.13, duration: 1.25 }, 0.2)
        .from(".hero-copy > p", { opacity: 0, y: 30, duration: 0.9 }, 0.75)
        .from(".hero-actions", { opacity: 0, y: 24, duration: 0.8 }, 0.9)
        .from(
          ".hero-location, .hero-index, .scroll-cue",
          { opacity: 0, duration: 0.8, stagger: 0.1 },
          1,
        );

      media.add("(min-width: 768px)", () => {
        const hero = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=90%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });
        hero
          .to(heroProgress.current, { value: 1, ease: "none" }, 0)
          .to(".hero-copy", { yPercent: -35, scale: 0.88, opacity: 0.1, ease: "power2.in" }, 0.08)
          .to(".hero-brand-kinetic", { scale: 1.55, opacity: 0, letterSpacing: "0.14em" }, 0.05)
          .to(".hero-grid", { scale: 1.25, opacity: 0.12 }, 0)
          .to(
            ".hero-transition-mask",
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut" },
            0.72,
          );

        const statements = gsap.utils.toArray<HTMLElement>(".manifesto-lines p");
        gsap.set(statements, { yPercent: 115, opacity: 0 });
        gsap.set(statements[0], { yPercent: 0, opacity: 1 });
        gsap.set(".manifesto-final", { yPercent: 100, opacity: 0 });
        const manifesto = gsap.timeline({
          scrollTrigger: {
            trigger: ".manifesto",
            start: "top top",
            end: "+=220%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
        });
        statements.forEach((statement, index) => {
          if (index > 0)
            manifesto.to(statements[index - 1], { yPercent: -105, opacity: 0, scale: 0.72 }, index);
          manifesto.to(statement, { yPercent: 0, opacity: 1, scale: 1, duration: 0.65 }, index);
          manifesto.to(
            statement.querySelector("em"),
            { letterSpacing: "0.025em", duration: 0.55 },
            index + 0.15,
          );
        });
        manifesto
          .to(statements.at(-1)!, { yPercent: -105, opacity: 0, scale: 0.72 }, statements.length)
          .to(".manifesto-final", { yPercent: 0, opacity: 1, duration: 0.8 }, statements.length)
          .to(".manifesto", { backgroundColor: "#dce1dd", duration: 0.6 }, statements.length + 0.2);
      });

      media.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".manifesto-lines p, .program-row").forEach((element) => {
          gsap.from(element, {
            y: 55,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });
      });

      const participantCards = gsap.utils.toArray<HTMLElement>(".participant-panel");
      const participantProgress = document.querySelector<HTMLElement>(
        ".participant-progress-current",
      );
      const participantProgressName = document.querySelector<HTMLElement>(
        ".participant-progress-name",
      );
      const participantProgressFill = document.querySelector<HTMLElement>(
        ".participant-progress-fill",
      );
      if (participantCards.length) {
        const compact = window.matchMedia("(max-width: 767px)").matches;
        let activeCard = -1;
        const setActiveCard = (index: number) => {
          if (activeCard === index && participantProgress?.textContent !== "") return;
          activeCard = index;
          if (participantProgress)
            participantProgress.textContent = String(index + 1).padStart(2, "0");
          if (participantProgressName) {
            participantProgressName.textContent =
              participantCards[index].querySelector("h3")?.textContent ?? "";
          }
          participantCards.forEach((card, cardIndex) => {
            card.inert = cardIndex !== index;
            card.classList.toggle("is-active", cardIndex === index);
          });
        };

        participantCards.forEach((card, index) => {
          gsap.set(card, {
            position: "absolute",
            inset: 0,
            zIndex: participantCards.length - index,
            yPercent: index === 0 ? 0 : compact ? 4 + index * 1.1 : 5 + index * 1.35,
            scale: index === 0 ? 1 : 1 - index * (compact ? 0.012 : 0.018),
            rotateX: index === 0 ? 0 : compact ? -0.4 * index : -0.8 * index,
            rotateZ: 0,
            opacity: 1,
            visibility: "visible",
            transformPerspective: compact ? 700 : 1400,
            transformOrigin: "50% 100%",
          });
        });
        setActiveCard(0);

        const cardStepDuration = 1.05;
        const firstTransitionAt = 0.38;
        const handoffOffset = 0.34;
        const handoffTimes = participantCards
          .slice(0, -1)
          .map((_, index) => index * cardStepDuration + firstTransitionAt + handoffOffset);

        const stackTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".participation",
            start: "top top",
            end: () => `+=${window.innerHeight * (compact ? 3.2 : 3.6)}`,
            scrub: compact ? 0.3 : 0.45,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const sequenceTime = self.progress * stackTimeline.duration();
              const index = handoffTimes.filter(
                (handoffTime) => sequenceTime >= handoffTime,
              ).length;
              setActiveCard(index);
              if (participantProgressFill) {
                participantProgressFill.style.transform = `scaleY(${self.progress})`;
              }
            },
          },
        });

        participantCards.slice(0, -1).forEach((card, index) => {
          const incoming = participantCards[index + 1];
          const position = index * cardStepDuration + firstTransitionAt;
          stackTimeline
            .to(
              card,
              {
                yPercent: compact ? -108 : -118,
                scale: compact ? 0.94 : 0.87,
                rotateX: compact ? 2 : 7,
                rotateZ: compact ? -0.3 : index % 2 === 0 ? -1.2 : 1.2,
                opacity: 0,
                ease: "power2.inOut",
                duration: 0.68,
              },
              position,
            )
            .to(
              card.querySelector(".panel-art"),
              { yPercent: -18, scale: 0.9, ease: "power2.inOut", duration: 0.6 },
              position,
            )
            .to(
              incoming,
              {
                yPercent: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                ease: "power3.out",
                duration: 0.75,
              },
              position + 0.06,
            )
            .fromTo(
              incoming.querySelector(".panel-number"),
              { xPercent: compact ? 5 : 12, opacity: 0.35 },
              { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.55 },
              position + 0.16,
            );
        });
        stackTimeline.to({}, { duration: 0.7 });

        interactionCleanups.push(() => {
          participantCards.forEach((card) => {
            card.inert = false;
            card.classList.remove("is-active");
          });
        });
      }

      gsap.utils.toArray<HTMLElement>(".program-row").forEach((row, index) => {
        gsap.from(row, {
          clipPath: "inset(0 0 100% 0)",
          y: 40,
          duration: 0.9,
          delay: index * 0.03,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });

      gsap.to(networkProgress.current, {
        value: 1,
        ease: "none",
        scrollTrigger: { trigger: ".theme", start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
      gsap.fromTo(
        ".network-canvas-shell",
        { clipPath: "circle(12% at 50% 50%)", scale: 0.75 },
        {
          clipPath: "circle(72% at 50% 50%)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".theme", start: "top 72%", end: "center 48%", scrub: 0.5 },
        },
      );
      gsap.from(".theme-copy > *", {
        y: 45,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: ".theme", start: "top 62%", end: "center center", scrub: 0.8 },
      });
      gsap.from(".notices", {
        clipPath: "inset(10% 4% 10% 4% round 2px)",
        scale: 0.94,
        scrollTrigger: { trigger: ".notices", start: "top bottom", end: "top 18%", scrub: 0.8 },
      });
      gsap.from(".registration", {
        clipPath: "inset(18% 7% 18% 7%)",
        scale: 0.9,
        scrollTrigger: {
          trigger: ".registration",
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      });
      gsap.to(".registration-ring", {
        rotate: 120,
        scale: 1.35,
        scrollTrigger: {
          trigger: ".registration",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (window.matchMedia("(pointer: fine)").matches) {
        root.current
          ?.querySelectorAll<HTMLElement>(".button, .nav-cta, .register-button")
          .forEach((element) => {
            const moveX = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
            const moveY = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
            const move = (event: PointerEvent) => {
              const box = element.getBoundingClientRect();
              moveX((event.clientX - box.left - box.width / 2) * 0.16);
              moveY((event.clientY - box.top - box.height / 2) * 0.16);
            };
            const leave = () => {
              moveX(0);
              moveY(0);
            };
            element.addEventListener("pointermove", move);
            element.addEventListener("pointerleave", leave);
            interactionCleanups.push(() => {
              element.removeEventListener("pointermove", move);
              element.removeEventListener("pointerleave", leave);
            });
          });
      }
    }, root);

    return () => {
      interactionCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [heroProgress, networkProgress, root]);
}
