import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { siteDefaults } from "../data/school.js";
import { getSiteContent } from "../services/api.js";

const SiteContentContext = createContext(null);

// The server puts saved content into the page (<script id="site-content">) so the first
// render already shows it. In development (Vite) it isn't there, so fetch it instead.
function readEmbeddedContent() {
  try {
    const node = document.getElementById("site-content");
    return node ? JSON.parse(node.textContent) : null;
  } catch {
    return null;
  }
}

export function SiteContentProvider({ children }) {
  const [embedded] = useState(readEmbeddedContent);
  const [saved, setSaved] = useState(() => embedded || {});

  useEffect(() => {
    if (embedded) return;
    getSiteContent().then(({ sections }) => setSaved(sections || {})).catch(() => {});
  }, [embedded]);

  // Website manager calls this after saving (value) or resetting (null) a section.
  const setSection = useCallback((key, value) => {
    setSaved((current) => {
      const next = { ...current };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    content: { ...siteDefaults, ...saved },
    saved,
    setSection
  }), [saved, setSection]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

// Current website content: saved sections, falling back to the built-in defaults.
export function useSite() {
  return useContext(SiteContentContext).content;
}

export function useSiteEditor() {
  return useContext(SiteContentContext);
}
