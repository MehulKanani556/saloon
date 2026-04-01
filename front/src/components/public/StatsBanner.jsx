import React, { useState, useEffect, useRef } from 'react';

const StatsCounter = ({ target, label, duration = 3000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end) * 5;

    let timer = setInterval(() => {
      start += 5;
      setCount(prev => Math.min(start, end));
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <div ref={sectionRef} className="flex flex-col items-center">
      <h3 className="text-3xl md:text-5xl font-black text-primary tracking-wide mb-2">
        {isVisible ? count : 0}{target.includes('+') ? '+' : target.includes('★') ? '★' : ''}
      </h3>
      <p className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
};

const StatsBanner = () => {
  return (
    <div className="bg-secondary py-8 md:py-16 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x md:divide-white/10">
          <StatsCounter target="500+" label="Happy Clients" />
          <StatsCounter target="20+" label="Premium Services" />
          <StatsCounter target="10+" label="Expert Artists" />
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;

