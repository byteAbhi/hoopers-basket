const tl = gsap.timeline();

tl.from(".line ", 1.8, {
  y: 200,
  ease: "power4.out",
  delay: 2,
  skewY: 7,
  stagger: {
    amount: 0.3,
  },
});

//tournament collab des
const t = gsap.timeline();

t.from(".line-1 ", 1.8, {
  y: 300,
  ease: "power4.out",
  delay: 1,
  skewY: 7,
  stagger: {
    amount: 0.3,
  },
  scrollTrigger: {
    trigger: ".t-plyr h1",
    scrub: 1,
    delay: 0.2,
    start: "30% center",
    end: "60% center ",
    ease: "power1.inOut",
    // markers: true,
  },
});

gsap.from(".t-plyr h1", {
  y: 100,
  ease: "power4.out",
  delay: 1,
  skewY: 1,

  stagger: {
    amount: 0.3,
  },
  scrollTrigger: {
    trigger: ".t-plyr h1",
    scrub: 3,
    delay: 0.1,
    start: "top center",
    end: "bottom center ",
    ease: "power1.inOut",
    // markers: true,
  },
});
