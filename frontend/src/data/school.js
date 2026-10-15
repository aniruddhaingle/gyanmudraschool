export const school = {
  name: "Gyan Mudra Academy",
  location: "Palsud, Barwani",
  email: "gyanmudraacademy@gmail.com",
  phone: "+91 9111334655",
  address: "Gyan Mudra Academy, Palsud, Barwani",
  tagline: "Big questions. Bright futures.",
  heroImage: "/images/banner.webp"
};

// Indian school sessions start in April; from October onwards families are applying for the next session.
export function admissionSession(date = new Date()) {
  const start = date.getMonth() >= 9 ? date.getFullYear() + 1 : date.getFullYear();
  return `${start}–${String(start + 1).slice(-2)}`;
}

export const heroSlides = [
  {
    image: "/images/banner.webp",
    kicker: "Your next era starts here",
    title: "Learn loud. Dream bigger.",
    text: "A joyful school experience where strong basics, brave ideas, and real-world confidence grow side by side."
  },
  {
    image: "/images/slider2.webp",
    kicker: "Not your average classroom",
    title: "Less cramming. More aha! moments.",
    text: "Students explore, question, make, practise, and explain—because the best learning sticks when it feels alive."
  },
  {
    image: "/images/slider4.webp",
    kicker: "Main-character energy",
    title: "Find your thing. Then go for it.",
    text: "From JNV and EMRS prep to sport, science, speaking, and creativity, there’s more than one way to shine."
  }
];

export const highlights = [
  { value: "20+", label: "years of showing up for learners" },
  { value: "100%", label: "care, safety & good-energy culture" },
  { value: "5+", label: "big pathways to explore" },
  { value: "360", label: "ways to learn, play & grow" }
];

export const programs = [
  {
    title: "The Big Begin",
    range: "Primary years",
    text: "Stories, numbers, hands-on discovery, and confidence-building routines for little learners with huge imaginations.",
    image: "/images/2_1.webp"
  },
  {
    title: "Level Up Years",
    range: "Classes 6-8",
    text: "Deeper concepts, practical science, projects, speaking skills, and the kind of study habits that make progress feel possible.",
    image: "/images/slider369.webp"
  },
  {
    title: "Future Moves",
    range: "JNV · EMRS · Olympiads",
    text: "Focused practice, doubt-solving, mock tests, and steady mentoring for learners ready to take their next shot.",
    image: "/images/slider69.webp"
  }
];

export const campusShowcase = [
  {
    title: "Idea Lab",
    text: "A space for visual learning, sharp questions, and ‘wait, I get it now!’ moments.",
    image: "/images/slider1.webp",
    tone: "large"
  },
  {
    title: "Stage + Squad",
    text: "Debates, assemblies, projects, teams, and plenty of room for every voice.",
    image: "/images/bg8.webp",
    tone: "dark"
  },
  {
    title: "Calm & Cared For",
    text: "Clean spaces, clear routines, and adults who notice the little things.",
    image: "/images/5.webp",
    tone: "light"
  },
  {
    title: "Next-Level Prep",
    text: "Mentored prep for JNV, EMRS, scholarships, and Olympiads—one doable step at a time.",
    image: "/images/slider69.webp",
    tone: "accent"
  }
];

export const experience = [
  { time: "08:30", title: "Start with the vibe", text: "Assembly, news, a thought for the day, and a chance to step up to the mic." },
  { time: "10:00", title: "Deep-dive time", text: "Clear teaching, quick feedback, practice, and those satisfying lightbulb moments." },
  { time: "12:30", title: "Make something happen", text: "Science, computers, library finds, art, debates, and collaborative project time." },
  { time: "15:30", title: "Move, play, reset", text: "Sport, teamwork, healthy competition, and a calm finish to a full day." }
];

export const testimonials = [
  {
    quote: "The school feels organised, warm, and genuinely invested in how children are doing—not just what they score.",
    name: "A parent’s take",
    role: "Primary years"
  },
  {
    quote: "Practice is regular, doubts are welcomed, and students know exactly what to try next. That changes everything.",
    name: "Learning, with direction",
    role: "Competitive-prep focus"
  },
  {
    quote: "It has the structure families want and the spark children need. That balance is rare.",
    name: "From our community",
    role: "Palsud"
  }
];

export const facilities = [
  "Smart classrooms that make ideas easier to see",
  "Science and computer spaces for hands-on discovery",
  "A library for quiet focus and big imagination",
  "Sport and movement built into the school rhythm",
  "A clean, monitored campus where students feel at ease"
];

export const achievements = [
  "JNV selections worth celebrating",
  "EMRS admissions that open new doors",
  "Scholarship and Olympiad momentum",
  "Science, debate, and sport moments on the rise"
];

export const leadership = [
  {
    name: "Anand Rao Ingle",
    role: "Principal & Director",
    image: "/images/principal.webp",
    summary:
      "A calm, clear-headed academic leader who makes maths, discipline, and daily progress feel possible.",
    detail:
      "Mr. Anand Rao Ingle brings a practical, student-first approach to classroom excellence, everyday confidence, and honest parent partnership.",
    education: "M.Sc. Mathematics, M.Ed",
    email: "anandraoingle13@gmail.com"
  },
  {
    name: "Sushma Ingle",
    role: "Secretary",
    image: "/images/secretary.webp",
    summary:
      "The steady force behind planning, community connection, and a school experience that keeps getting better.",
    detail:
      "The secretary’s office helps keep the academy safe, responsive, and ready for what learners and families need next.",
    education: "School management and community leadership",
    email: school.email
  }
];

export const galleryEvents = [
  {
    title: "Janmashtami",
    theme: "janmashtami",
    tag: "FESTIVAL CELEBRATION",
    note: "A joyful Janmashtami celebration filled with colourful costumes, Krishna-inspired performances, and beautiful student moments.",
    cover: "/gallery/janmashtami/janmashtami-03.jpeg",
    photos: [
      "/gallery/janmashtami/janmashtami-01.jpeg", "/gallery/janmashtami/janmashtami-02.jpeg", "/gallery/janmashtami/janmashtami-03.jpeg", "/gallery/janmashtami/janmashtami-04.jpeg", "/gallery/janmashtami/janmashtami-05.jpeg", "/gallery/janmashtami/janmashtami-06.jpeg", "/gallery/janmashtami/janmashtami-07.jpeg", "/gallery/janmashtami/janmashtami-08.jpeg", "/gallery/janmashtami/janmashtami-09.jpeg", "/gallery/janmashtami/janmashtami-10.jpeg", "/gallery/janmashtami/janmashtami-11.jpeg"
    ]
  }
];
