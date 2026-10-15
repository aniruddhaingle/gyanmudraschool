import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Images, Plus, RotateCcw, Trash2 } from "lucide-react";
import { getSiteSection, siteSections, validateSiteSection } from "../../../shared/siteContent.js";
import { useSiteEditor } from "../context/SiteContent.jsx";
import { resetSiteSection, saveSiteSection, uploadSiteImage } from "../services/api.js";
import { compressImage } from "../utils/compressImage.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

const copy = (value) => JSON.parse(JSON.stringify(value));
const emptyItem = (section) => (section.type === "strings" ? "" : Object.fromEntries(section.fields.map((field) => [field.name, ""])));

// Only the fields the editor knows about, so built-in extras (like old image paths) don't count as changes.
function pick(section, value) {
  if (section.type === "strings") return [...value];
  const pickFields = (item) => Object.fromEntries(section.fields.map((field) => [field.name, item?.[field.name] ?? ""]));
  return section.type === "object" ? pickFields(value) : value.map(pickFields);
}

function ImageField({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function choose(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadSiteImage(await compressImage(file, { maxSize: 2000 }));
      onChange(url);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="wm-image">
      <span className="wm-label">{label}</span>
      <div className="wm-image-row">
        {value ? <img src={value} alt="" /> : <div className="wm-image-empty">No photo</div>}
        <label className="gm-link wm-upload">
          <ImagePlus size={16} /> {uploading ? "Uploading..." : value ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={choose} disabled={uploading} />
        </label>
      </div>
      {error ? <p className="wm-error">{error}</p> : null}
    </div>
  );
}

function Field({ field, value, onChange }) {
  if (field.type === "image") return <ImageField label={field.label} value={value} onChange={onChange} />;
  const props = { value: value ?? "", maxLength: field.max, onChange: (e) => onChange(e.target.value) };
  return (
    <label className="wm-field">
      <span className="wm-label">{field.label}{field.optional ? <em> optional</em> : null}<small>{(value ?? "").length}/{field.max}</small></span>
      {field.type === "textarea" ? <textarea rows="3" {...props} /> : <input type={field.format === "email" ? "email" : field.format === "phone" ? "tel" : "text"} {...props} />}
    </label>
  );
}

function ItemControls({ index, count, minItems, onMove, onRemove, label }) {
  return (
    <div className="wm-item-controls">
      <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Move ${label} up`}><ArrowUp size={15} /></button>
      <button type="button" onClick={() => onMove(index, 1)} disabled={index === count - 1} aria-label={`Move ${label} down`}><ArrowDown size={15} /></button>
      <button type="button" className="danger" onClick={() => onRemove(index)} disabled={count <= minItems} aria-label={`Remove ${label}`}><Trash2 size={15} /></button>
    </div>
  );
}

function SectionEditor({ section, initial, isSaved, onSaved, onReset, onDirtyChange }) {
  const [draft, setDraft] = useState(() => copy(initial));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  const setItem = (index, value) => setDraft((list) => list.map((item, i) => (i === index ? value : item)));
  const move = (index, step) => setDraft((list) => {
    const next = [...list];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    return next;
  });
  const remove = (index) => setDraft((list) => list.filter((_, i) => i !== index));
  const add = () => setDraft((list) => [...list, emptyItem(section)]);

  async function save() {
    const checked = validateSiteSection(section.key, draft);
    if (checked.error) {
      setStatus({ type: "error", text: checked.error });
      return;
    }
    setBusy(true);
    setStatus({ type: "", text: "" });
    try {
      const { value } = await saveSiteSection(section.key, checked.value);
      onSaved(value);
      setDraft(copy(value));
      setStatus({ type: "success", text: "Saved. The website is updated." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    try {
      await resetSiteSection(section.key);
      onReset();
      setStatus({ type: "success", text: "Restored the original content." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setBusy(false);
      setConfirmReset(false);
    }
  }

  const label = (section.itemLabel || section.label || "item").toLowerCase();

  return (
    <div className="admin-panel wm-editor">
      <div className="wm-editor-head">
        <div>
          <span>{isSaved ? "EDITED" : "ORIGINAL CONTENT"}</span>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <a className="gm-link" href={section.page} target="_blank" rel="noreferrer"><ExternalLink size={15} /> View on website</a>
      </div>

      {section.type === "object" ? (
        <div className="wm-fields">
          {section.fields.map((field) => <Field key={field.name} field={field} value={draft[field.name]} onChange={(v) => setDraft((d) => ({ ...d, [field.name]: v }))} />)}
        </div>
      ) : null}

      {section.type === "strings" ? (
        <div className="wm-list">
          {draft.map((item, index) => (
            <div className="wm-string" key={index}>
              <Field field={{ label: `${section.label} ${index + 1}`, max: section.max }} value={item} onChange={(v) => setItem(index, v)} />
              <ItemControls index={index} count={draft.length} minItems={section.minItems} onMove={move} onRemove={remove} label={label} />
            </div>
          ))}
        </div>
      ) : null}

      {section.type === "list" ? (
        <div className="wm-list">
          {draft.map((item, index) => (
            <fieldset className="wm-item" key={index}>
              <legend>{section.itemLabel} {index + 1}</legend>
              <ItemControls index={index} count={draft.length} minItems={section.minItems} onMove={move} onRemove={remove} label={label} />
              <div className="wm-fields">
                {section.fields.map((field) => <Field key={field.name} field={field} value={item[field.name]} onChange={(v) => setItem(index, { ...item, [field.name]: v })} />)}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      {section.type !== "object" && draft.length < section.maxItems ? (
        <button type="button" className="gm-link wm-add" onClick={add}><Plus size={16} /> Add {label}</button>
      ) : null}

      <div className="wm-actions">
        <button type="button" className="primary-action form-button" onClick={save} disabled={busy || !dirty}>{busy ? "Saving..." : dirty ? "Save changes" : "No changes"}</button>
        {dirty ? <button type="button" className="gm-link" onClick={() => { setDraft(copy(initial)); setStatus({ type: "", text: "" }); }} disabled={busy}>Undo changes</button> : null}
        {isSaved ? <button type="button" className="gm-link" onClick={() => setConfirmReset(true)} disabled={busy}><RotateCcw size={15} /> Restore original</button> : null}
      </div>
      {status.text ? <p className={`form-status ${status.type}`} role="status">{status.text}</p> : null}

      {confirmReset ? (
        <ConfirmDialog title={`Restore “${section.title}”?`} confirmLabel="Yes, restore original" busyLabel="Restoring..." busy={busy} onConfirm={reset} onCancel={() => setConfirmReset(false)}>
          <p>Your edits to this section will be replaced with the website’s original content.</p>
        </ConfirmDialog>
      ) : null}
    </div>
  );
}

export default function WebsiteManager({ onOpenGallery }) {
  const { content, saved, setSection } = useSiteEditor();
  const [activeKey, setActiveKey] = useState(null);
  const [version, setVersion] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [pendingKey, setPendingKey] = useState(null);

  // Ask before leaving a section with unsaved edits.
  function openSection(key) {
    if (key === activeKey) return;
    if (dirty) setPendingKey(key);
    else setActiveKey(key);
  }
  const active = activeKey ? getSiteSection(activeKey) : null;

  return (
    <div className="wm">
      <section className="admin-panel wm-intro">
        <span>WEBSITE MANAGER</span>
        <h2>Change any part of the website.</h2>
        <p>Pick a section, edit the text or photos, and press <b>Save changes</b>. The website updates straight away. You can always restore the original content.</p>
      </section>

      <div className="wm-layout">
        <nav className="wm-sections" aria-label="Website sections">
          {siteSections.map((section) => (
            <button type="button" key={section.key} className={section.key === activeKey ? "active" : ""} onClick={() => openSection(section.key)}>
              <strong>{section.title}</strong>
              <small>{saved[section.key] ? "Edited" : "Original"}</small>
            </button>
          ))}
          <button type="button" onClick={() => (dirty ? setPendingKey("gallery") : onOpenGallery())}><strong><Images size={15} /> Events &amp; gallery</strong><small>Open →</small></button>
        </nav>

        {active ? (
          <SectionEditor
            key={`${active.key}-${version}`}
            section={active}
            initial={pick(active, content[active.key])}
            isSaved={Boolean(saved[active.key])}
            onSaved={(value) => setSection(active.key, value)}
            onReset={() => { setSection(active.key, null); setVersion((v) => v + 1); }}
            onDirtyChange={setDirty}
          />
        ) : (
          <div className="admin-panel wm-empty"><p>Choose a section on the left to start editing.</p><p className="wm-hint">Tip: “School details” changes the phone, email, and address everywhere on the site.</p></div>
        )}
      </div>

      {pendingKey ? (
        <ConfirmDialog
          title="Leave without saving?"
          confirmLabel="Discard changes"
          onConfirm={() => { setDirty(false); if (pendingKey === "gallery") onOpenGallery(); else setActiveKey(pendingKey); setPendingKey(null); }}
          onCancel={() => setPendingKey(null)}
        >
          <p>You have unsaved changes in “{active?.title}”. They will be lost.</p>
        </ConfirmDialog>
      ) : null}
    </div>
  );
}

