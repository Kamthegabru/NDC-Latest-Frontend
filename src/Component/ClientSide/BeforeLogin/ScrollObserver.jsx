"use client";

import { useEffect } from "react";

export default function ScrollObserver() {
  useEffect(() => {
    const header = document.getElementById("main-header");
    const hero = document.getElementById("how");

    if (!header || !hero) return;

    let lastScrollY = window.scrollY;
    let isHeroVisible = true;

    // Step 1: Track intersection with #home
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry.isIntersecting;

        if (isHeroVisible) {
          header.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);

    // Step 2: Scroll direction logic
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollingUp = currentScrollY < lastScrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (!isHeroVisible) {
        if (scrollingUp) {
          header.style.transform = "translateY(0)";
        } else if (scrollingDown) {
          header.style.transform = "translateY(-100%)";
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
