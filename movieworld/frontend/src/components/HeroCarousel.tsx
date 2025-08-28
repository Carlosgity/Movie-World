import React, { useEffect, useRef, useState } from "react";
import "./HeroCarousel.css";

export type HeroSlide = {
  id: number | string;
  title: string;
  genre: string;
  duration: string;     
  imdb: string;         
  overview: string;
  backdropUrl: string;  
};

type Props = {
  slides: HeroSlide[];
  autoMs?: number;     
};

const HeroCarousel: React.FC<Props> = ({ slides, autoMs = 4000 }) => {
  const [idx, setIdx] = useState(0);
  const [watched, setWatched] = useState(false);
  const timer = useRef<number | null>(null);
  const hovering = useRef(false);
  const total = slides.length;

  function next() {
    if (total === 0) return;
    setIdx(function (p) { return (p + 1) % total; });
  }
  function goTo(i: number) {
    if (i < 0 || i >= total) return;
    setIdx(i);
  }

  useEffect(function () {
    if (total === 0) return;
    function tick() {
      if (!hovering.current) next();
      timer.current = window.setTimeout(tick, autoMs);
    }
    timer.current = window.setTimeout(tick, autoMs);
    return function cleanup() {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [autoMs, total]);

  if (total === 0) return null;
  const s = slides[idx];

  return (
    <section
      className="hero"
      style={{ backgroundImage: "url(" + s.backdropUrl + ")" }}
      onMouseEnter={function () { hovering.current = true; }}
      onMouseLeave={function () { hovering.current = false; }}
      aria-label="Featured movies carousel"
    >
      {/* dark overlay */}
      <div className="hero__shade" />

      {/* content block (left/bottom like your image) */}
      <div className="hero__content">
        <h2 className="hero__title">{s.title}</h2>

        <div className="hero__meta">
          <span>Genre: {s.genre}</span>
          <span>Duration: {s.duration}</span>
          <span>IMDB: {s.imdb}</span>
        </div>

        <p className="hero__overview">{s.overview}</p>

       
      </div>

      
      <div className="hero__progress">
        {slides.map(function (_slide, i) {
          return (
            <button
              key={_slide.id}
              className={"hero__bar" + (i === idx ? " active" : "")}
              onClick={function () { goTo(i); }}
              aria-label={"Go to slide " + (i + 1)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HeroCarousel;
