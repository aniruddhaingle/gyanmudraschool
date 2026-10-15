import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { school } from "../data/school.js";
import CursorGlow from "../effects/CursorGlow.jsx";
import MotionBackdrop from "../effects/MotionBackdrop.jsx";

// The admin panel stays at /admin but is not advertised in the public menu.
const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Admissions", "/admissions"],
  ["Gallery", "/gallery"],
  ["Leadership", "/leadership"]
];

const pageInfo = {
  "/": [`${school.name}, Palsud | School in Barwani`, `${school.name}, Palsud (Barwani): joyful learning, strong basics, and JNV, EMRS and Olympiad preparation. Admissions open.`],
  "/about": [`About Us | ${school.name}`, `How ${school.name} teaches, what we celebrate, and the facilities our students use every day.`],
  "/admissions": [`Admissions | ${school.name}`, `Apply online to ${school.name}, Palsud. One short form, and our team will call you back.`],
  "/gallery": [`Gallery | ${school.name}`, `Photos from festivals, events, and everyday school life at ${school.name}.`],
  "/leadership": [`Leadership | ${school.name}`, `Meet the principal and team who guide students at ${school.name}.`],
  "/admin": [`Admin | ${school.name}`, ""]
};

const phoneHref = `tel:${school.phone.replace(/[^+\d]/g, "")}`;
const mailHref = `mailto:${school.email}`;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef(null);

  // New page: start at the top, and update the browser tab title and description.
  useEffect(() => {
    window.scrollTo(0, 0);
    const path = pathname.replace(/(.)\/$/, "$1");
    const [title, description] = pageInfo[path] || [`Page not found | ${school.name}`, ""];
    document.title = title;
    if (description) document.querySelector("meta[name=description]")?.setAttribute("content", description);
  }, [pathname]);

  // Close the mobile menu with Escape or a tap outside it.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onPointer = (e) => { if (!headerRef.current?.contains(e.target)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onPointer); };
  }, [open]);

  return (
    <div className="app-shell">
      <CursorGlow />
      <MotionBackdrop />
      <div className="topbar">
        <span><a href={mailHref}><Mail size={15} /> {school.email}</a></span>
        <span><a href={phoneHref}><Phone size={15} /> {school.phone}</a></span>
        <span><MapPin size={15} /> {school.location}</span>
      </div>

      <header className="site-header" ref={headerRef}>
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><img src="/images/gyan-mudra-logo-800.webp" alt="Gyan Mudra Academy logo" width="64" height="64" /></span>
          <span>
            <strong>{school.name}</strong>
            <small>{school.location}</small>
          </span>
        </NavLink>

        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav id="primary-navigation" className={open ? "nav-links open" : "nav-links"}>
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="campus-ticker" aria-label="School updates">
        <div>
          <span>✦ ADMISSIONS OPEN</span><span>SCIENCE + SPORTS + STORIES</span><span>✦ LEARN LOUDLY</span><span>BIG IDEAS LIVE HERE</span><span>✦ ADMISSIONS OPEN</span><span>SCIENCE + SPORTS + STORIES</span><span>✦ LEARN LOUDLY</span><span>BIG IDEAS LIVE HERE</span>
        </div>
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-big-copy">
          <span>SEE YOU ON CAMPUS ✦</span>
          <h3>{school.name}</h3>
          <p>{school.tagline} A bright, grounded place for curious minds, kind hearts, and seriously good days.</p>
        </div>
        <div className="footer-links">
          {navItems.map(([label, path]) => <NavLink key={path} to={path}>{label} <ArrowUpRight size={15} /></NavLink>)}
        </div>
        <div className="footer-grid">
          <span><MapPin size={18} /> {school.address}</span>
          <span><a href={phoneHref}><Phone size={18} /> {school.phone}</a></span>
          <span><a href={mailHref}><Mail size={18} /> {school.email}</a></span>
          <span><ShieldCheck size={18} /> Private, parent-friendly admissions</span>
        </div>
      </footer>
    </div>
  );
}
