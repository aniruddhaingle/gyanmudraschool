import { themeStyle } from "../data/eventThemes.js";

// Stand-in cover for an event that has no photos yet.
export default function ThemeCover({ theme }) {
  return (
    <div className="theme-cover" style={themeStyle(theme)} aria-hidden="true">
      <b>{theme.decor[0]}</b>
      <span>{theme.label}</span>
    </div>
  );
}
