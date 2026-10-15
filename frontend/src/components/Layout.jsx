import { NavLink, Outlet, useLocation, useNavigationType } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "../context/SiteContent.jsx";
import CursorGlow from "../effects/CursorGlow.jsx";
import MotionBackdrop from "../effects/MotionBackdrop.jsx";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Admissions", "/admissions"],
  ["Gallery", "/gallery"],
  ["Leadership", "/leadership"],
  ["Admin", "/admin"]
];

// The footer lists only the public pages.
const footerItems = navItems.filter(([, path]) => path !== "/admin");

const pageInfoFor = (school) => ({
  "/": [`${school.name}, Palsud | School in Barwani`, `${school.name}, Palsud (Barwani): joyful learning, strong basics, and JNV, EMRS and Olympiad preparation. Admissions open.`],
  "/about": [`About Us | ${school.name}`, `How ${school.name} teaches, what we celebrate, and the facilities our students use every day.`],
  "/admissions": [`Admissions | ${school.name}`, `Apply online to ${school.name}, Palsud. One short form, and our team will call you back.`],
  "/gallery": [`Gallery | ${school.name}`, `Photos from festivals, events, and everyday school life at ${school.name}.`],
  "/leadership": [`Leadership | ${school.name}`, `Meet the principal and team who guide students at ${school.name}.`],
  "/admin": [`Admin | ${school.name}`, ""]
});


export default function Layout() {
  const [open, setOpen] = useState(false);
  const { school, ticker } = useSite();
  const phoneHref = `tel:${school.phone.replace(/[^+\d]/g, "")}`;
  const mailHref = `mailto:${school.email}`;
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const headerRef = useRef(null);

  // Every link click (even to the page you're already on) starts at the top. This runs before the
  // new page is drawn, so it never flashes scrolled down. Back/forward keeps the browser's position.
  useLayoutEffect(() => {
    if (navigationType !== "POP") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [key, navigationType]);

  // Update the browser tab title and description for each page.
  useEffect(() => {
    const path = pathname.replace(/(.)\/$/, "$1");
    const [title, description] = pageInfoFor(school)[path] || [`Page not found | ${school.name}`, ""];
    document.title = title;
    if (description) document.querySelector("meta[name=description]")?.setAttribute("content", description);
  }, [pathname, school]);

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
          {/* Listed twice so the scrolling loop is seamless. */}
          {[...ticker, ...ticker].map((message, index) => <span key={index} aria-hidden={index >= ticker.length || undefined}>{message}</span>)}
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
          {footerItems.map(([label, path]) => <NavLink key={path} to={path}>{label} <ArrowUpRight size={15} /></NavLink>)}
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
