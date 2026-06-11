import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass } from "lucide-react";
import { Button } from "../Button";
import { motion } from "framer-motion";
import { InteractiveCrystal } from "./InteractiveCrystal";

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)",
        borderRadius: "0% 0% 40% 10%",
      });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <div
        id="video-frame"
        className="relative z-10 h-[100dvh] w-full overflow-hidden bg-background"
      >
        {/* Textured background crystal cave layer */}
        <div className="absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.16] pointer-events-none select-none">
          <img
            src="/img/entrance.webp"
            alt="Cave backdrop"
            className="w-full h-full object-cover filter grayscale contrast-125 scale-[1.05]"
          />
        </div>

        {/* Floating WebGL interactive crystal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] pointer-events-auto"
          >
            <InteractiveCrystal />
          </motion.div>
        </div>

        <h1 className="hero-heading absolute bottom-5 right-5 z-40 text-foreground/95 font-sans font-black uppercase text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none select-none pointer-events-none">
          STU<span className="font-serif italic text-secondary font-normal lowercase">d</span>IO
        </h1>

        <div className="absolute left-0 top-0 z-40 w-full h-full pointer-events-none">
          <div className="mt-28 px-5 sm:px-10">
            <h1 className="hero-heading text-foreground/95 font-sans font-black uppercase text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none select-none">
              REDEFI
              <span className="font-serif italic text-secondary font-normal lowercase">n</span>E
            </h1>

            <p className="mb-8 mt-4 max-w-sm font-sans text-muted-foreground text-sm sm:text-base leading-relaxed">
              Crafting tactile digital products <br /> Shaping aesthetic brand narratives
            </p>

            <Button
              id="watch-work"
              title="Explore Work"
              leftIcon={
                <Compass
                  className="h-4 w-4 text-secondary animate-spin"
                  style={{ animationDuration: "6s" }}
                />
              }
              containerClass="bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5 pointer-events-auto shadow-glow-cyan"
            />
          </div>
        </div>
      </div>

      <h1 className="hero-heading absolute bottom-5 right-5 text-foreground/80 font-sans font-black uppercase text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none select-none pointer-events-none">
        STU<span className="font-serif italic text-secondary font-normal lowercase">d</span>IO
      </h1>
    </div>
  );
};

export default CinematicHero;
