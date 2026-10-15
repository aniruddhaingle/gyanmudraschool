import { useEffect, useState } from "react";
import { Pencil, Sparkles, Trash2, X } from "lucide-react";
import { detectEventTheme, eventThemes, getEventTheme, resolveTheme, themeStyle } from "../data/eventThemes.js";
import ThemeCover from "./ThemeCover.jsx";
import { createGalleryEvent, deleteGalleryEvent, getGalleryEvents, updateGalleryEvent } from "../services/api.js";

const emptyForm = { title: "", tag: "", note: "", themeChoice: "auto" };

export default function GalleryManager() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  // Until the admin edits the category or story themselves, they follow the detected theme.
  const [touched, setTouched] = useState({ tag: false, note: false });
  const [newPhotos, setNewPhotos] = useState([]);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const detected = detectEventTheme(form);
  const theme = form.themeChoice === "auto" ? detected : getEventTheme(form.themeChoice);

  const loadEvents = () => getGalleryEvents().then(({ events: list }) => setEvents(list)).catch((error) => setMessage(error.message));
  useEffect(() => { loadEvents(); }, []);

  // Change form fields and let untouched category/story follow the newly matched theme.
  function updateForm(changes) {
    setForm((current) => {
      const next = { ...current, ...changes };
      const matched = next.themeChoice === "auto" ? detectEventTheme(next) : getEventTheme(next.themeChoice);
      if (!touched.tag) next.tag = next.title.trim() ? matched.tag : "";
      if (!touched.note) next.note = next.title.trim() ? matched.note : "";
      return next;
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setTouched({ tag: false, note: false });
    setNewPhotos([]);
    setRemovePhotos([]);
    setFileInputKey((key) => key + 1);
  }

  function startEdit(event) {
    setEditing(event);
    setForm({ title: event.title, tag: event.tag, note: event.note, themeChoice: event.theme || "auto" });
    setTouched({ tag: true, note: true });
    setNewPhotos([]);
    setRemovePhotos([]);
    setFileInputKey((key) => key + 1);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleRemove(photo) {
    setRemovePhotos((list) => (list.includes(photo) ? list.filter((item) => item !== photo) : [...list, photo]));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData();
    data.append("title", form.title);
    data.append("tag", form.tag);
    data.append("note", form.note);
    data.append("theme", theme.key);
    newPhotos.forEach((photo) => data.append("photos", photo));
    removePhotos.forEach((photo) => data.append("removePhotos", photo));
    try {
      if (editing) {
        await updateGalleryEvent(editing._id, data);
        setMessage(`“${form.title}” has been updated.`);
      } else {
        await createGalleryEvent(data);
        setMessage(`“${form.title}” is live on the public gallery.`);
      }
      resetForm();
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(event) {
    if (!window.confirm(`Delete “${event.title}” and all of its photos? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteGalleryEvent(event._id);
      if (editing?._id === event._id) resetForm();
      setMessage(`“${event.title}” was deleted.`);
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gallery-manager">
      <form className="admin-panel" onSubmit={save}>
        <span>{editing ? "EDIT EVENT" : "PUBLIC GALLERY"}</span>
        <h2>{editing ? `Editing “${editing.title}”` : "Publish a school moment."}</h2>
        <p>Type the event name and the matching festival look, category, and story are filled in for you. Change anything you like; photos are optional and can be added later.</p>
        <div className="gm-form">
          <label>Event / festival name
            <input required minLength={2} maxLength={100} value={form.title} placeholder="e.g. Diwali Celebration 2026" onChange={(e) => updateForm({ title: e.target.value })} />
          </label>
          <div className="gm-hint">
            {form.title.trim() ? <span className="gm-detected"><Sparkles size={13} /> Detected: {detected.label}</span> : <span>Try “Holi”, “Sports Day”, “15 August”, or “दीपावली”.</span>}
          </div>
          <div className="gm-row">
            <label>Album theme
              <select value={form.themeChoice} onChange={(e) => updateForm({ themeChoice: e.target.value })}>
                <option value="auto">Automatic ({detected.label})</option>
                {eventThemes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <label>Category
              <input required minLength={2} maxLength={60} value={form.tag} onChange={(e) => { setTouched((t) => ({ ...t, tag: true })); setForm((f) => ({ ...f, tag: e.target.value })); }} />
            </label>
          </div>
          <label>Story
            <textarea required minLength={8} maxLength={600} rows="3" value={form.note} onChange={(e) => { setTouched((t) => ({ ...t, note: true })); setForm((f) => ({ ...f, note: e.target.value })); }} />
          </label>
          {form.title.trim() && form.note !== theme.note ? (
            <div className="gm-hint"><button type="button" onClick={() => setForm((f) => ({ ...f, note: theme.note }))}>Use suggested {theme.label} story</button></div>
          ) : null}

          <div className="gm-preview" style={themeStyle(theme)} aria-label="Album theme preview">
            <b aria-hidden="true">{theme.decor[3]}</b>
            <small>{theme.blessing}</small>
            <strong>{form.title || theme.label}</strong>
            <p>{theme.story}</p>
          </div>

          {editing?.photos.length ? (
            <div>
              <div className="gm-hint">Current photos — tap ✕ to remove ({removePhotos.length} selected)</div>
              <div className="gm-photos">
                {editing.photos.map((photo) => (
                  <figure key={photo} className={removePhotos.includes(photo) ? "removing" : ""}>
                    <img src={photo} alt="" />
                    <button type="button" onClick={() => toggleRemove(photo)} aria-label={removePhotos.includes(photo) ? "Keep photo" : "Remove photo"}><X size={14} /></button>
                  </figure>
                ))}
              </div>
            </div>
          ) : null}

          <label>{editing ? "Add more photos" : "Photos"} <em>Optional · JPG, PNG or WEBP · up to 15 at a time, 5 MB each</em>
            <input key={fileInputKey} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => setNewPhotos([...(e.target.files || [])])} />
          </label>

          <div className="gm-actions">
            <button className="primary-action form-button" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Publish event"}</button>
            {editing ? <button className="gm-link" type="button" onClick={resetForm}>Cancel editing</button> : null}
          </div>
          {message ? <p className="form-status">{message}</p> : null}
        </div>
      </form>

      <section className="admin-panel">
        <span>PUBLISHED EVENTS</span>
        <h2>{events.length ? `${events.length} event${events.length > 1 ? "s" : ""} on the gallery` : "Nothing published yet."}</h2>
        <div className="gm-list">
          {events.map((event) => {
            const itemTheme = resolveTheme(event);
            return (
              <article className="gm-item" key={event._id}>
                <div className="gm-thumb">{event.photos[0] ? <img src={event.photos[0]} alt="" /> : <ThemeCover theme={itemTheme} />}</div>
                <div>
                  <h3>{event.title}</h3>
                  <p>{itemTheme.label} theme · {event.photos.length} photo{event.photos.length === 1 ? "" : "s"}</p>
                </div>
                <div className="gm-item-actions">
                  <button type="button" onClick={() => startEdit(event)} disabled={busy}><Pencil size={14} /> Edit</button>
                  <button type="button" className="danger" onClick={() => remove(event)} disabled={busy}><Trash2 size={14} /> Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
