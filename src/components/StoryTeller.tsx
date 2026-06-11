import { useRef } from "react";
import { gsap } from "gsap";
import { Button } from "./Button";
import { AnimatedTitle } from "./AnimatedTitle";

export const StoryTeller = () => {
  const frameRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -15;
    const rotateY = ((xPos - centerX) / centerX) * 15;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <section
      id="story"
      className="min-h-[100dvh] w-full bg-transparent text-foreground relative py-20 overflow-hidden"
    >
      <div className="flex w-full flex-col items-center pb-24 relative z-10">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary">
          THE ORIVON PHILOSOPHY
        </p>

        <div className="relative w-full h-full">
          <AnimatedTitle
            title="the narrative <br /> of custom craft"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-20"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  onMouseEnter={handleMouseLeave}
                  src="/img/entrance.webp"
                  alt="entrance.webp"
                  className="object-contain w-full h-full max-h-[80vh] md:max-h-[100dvh]"
                />
              </div>
            </div>

            {/* SVG mask gooey filter */}
            <svg className="invisible absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="-mt-80 sm:-mt-60 md:-mt-48 flex w-full justify-center md:me-44 md:justify-end relative z-20">
          <div className="flex h-full w-fit flex-col items-center md:items-start px-6">
            <p className="mt-3 max-w-sm text-center font-sans text-neutral-400 text-sm sm:text-base md:text-start leading-relaxed">
              We reject standard grid templates to guide users through custom scroll narratives.
              Discover how our physical-digital synergy turns clients into long-term partners.
            </p>

            <Button
              id="realm-btn"
              title="read methodology"
              containerClass="mt-6 bg-white text-black hover:bg-neutral-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryTeller;
