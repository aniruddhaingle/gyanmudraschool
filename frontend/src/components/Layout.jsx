import { NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { school } from "../data/school.js";
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

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <CursorGlow />
      <MotionBackdrop />
      <div className="topbar">
        <span><Mail size={15} /> {school.email}</span>
        <span><Phone size={15} /> {school.phone}</span>
        <span><MapPin size={15} /> {school.location}</span>
      </div>

      <header className="site-header">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><img src="/images/gyan-mudra-logo.jpeg" alt="Gyan Mudra Academy logo" /></span>
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
          {navItems.slice(0, 5).map(([label, path]) => <NavLink key={path} to={path}>{label} <ArrowUpRight size={15} /></NavLink>)}
        </div>
        <div className="footer-grid">
          <span><MapPin size={18} /> {school.address}</span>
          <span><Phone size={18} /> {school.phone}</span>
          <span><Mail size={18} /> {school.email}</span>
          <span><ShieldCheck size={18} /> Private, parent-friendly admissions</span>
        </div>
      </footer>
    </div>
  );
}
