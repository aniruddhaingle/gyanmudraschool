import { useState } from "react";
import { ArrowRight, FileCheck2, PhoneCall, ShieldCheck, Sparkles, Upload } from "lucide-react";
import Reveal from "../effects/Reveal.jsx";
import { submitAdmission } from "../services/api.js";
import { compressImage } from "../utils/compressImage.js";
import PageHero from "../components/PageHero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { admissionSession } from "../data/school.js";

const initialState = {
  firstName: "",
  lastName: "",
  fatherName: "",
  caste: "",
  gender: "",
  address: "",
  phone: "",
  classApplied: ""
};

export default function Admissions() {
  const [form, setForm] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [preparingPhoto, setPreparingPhoto] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0];
    setPhoto(null);
    if (!file) return;
    setPreparingPhoto(true);
    const ready = await compressImage(file);
    setPreparingPhoto(false);
    if (ready.size > 6 * 1024 * 1024) {
      event.target.value = "";
      setStatus({ type: "error", message: "This photo is too large. Please choose a photo under 6 MB." });
      return;
    }
    setStatus({ type: "", message: "" });
    setPhoto(ready);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (photo) payload.append("photo", photo);

    try {
      await submitAdmission(payload);
      setForm(initialState);
      setPhoto(null);
      event.target.reset();
      setStatus({ type: "success", message: "Admission enquiry submitted securely. Our team will contact you soon." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-shell admission-page">
      <PageHero eyebrow={`Admissions ${admissionSession()}`} title="Let’s make this official." text="One short form is all it takes to start a thoughtful conversation about your child’s next chapter." badge="YOU’RE INVITED" image="/images/slider2.webp" tone="purple" />
      <div className="admission-stage">
      <div className="admission-hero-panel">
        <Reveal>
          <SectionHeader
            eyebrow="Join the gang"
            title="Your child’s next big chapter starts here."
            text="Tell us a little about your learner. We’ll review the application carefully and help your family take the next step with confidence."
          />
          <div className="admission-benefits">
            <span><ShieldCheck size={18} /> Kept private</span>
            <span><FileCheck2 size={18} /> Easy upload</span>
            <span><PhoneCall size={18} /> We call you back</span>
          </div>
        </Reveal>
        <Reveal className="admission-preview" delay={120}>
          <span><Sparkles size={16} /> GOOD TO KNOW</span>
          <strong>3 min</strong>
          <p>That’s all it takes to share the basics. Keep a student photo handy and we’ll take it from there.</p>
        </Reveal>
      </div>

      <Reveal as="form" className="admission-form admission-form-modern" onSubmit={handleSubmit}>
        <div className="admission-form-top">
          <div>
            <span><Sparkles size={15} /> STEP 01 OF 01</span>
            <h2>Tell us about your learner.</h2>
            <p>Just the essentials. We&apos;ll take care of the next steps together.</p>
          </div>
          <div className="privacy-chip"><ShieldCheck size={18} /> Private &amp; parent-friendly</div>
        </div>
        <div className="form-grid modern-form-grid">
          <label className="form-field"><span>First name</span><input name="firstName" value={form.firstName} onChange={updateField} required minLength="2" placeholder="e.g. Aarav" /></label>
          <label className="form-field"><span>Last name</span><input name="lastName" value={form.lastName} onChange={updateField} required minLength="2" placeholder="e.g. Sharma" /></label>
          <label className="form-field"><span>Parent / guardian name</span><input name="fatherName" value={form.fatherName} onChange={updateField} required minLength="2" placeholder="Who should we contact?" /></label>
          <label className="form-field"><span>Phone number</span><input name="phone" value={form.phone} onChange={updateField} required pattern="[0-9+\-\s]{8,15}" placeholder="+91 00000 00000" inputMode="tel" /></label>
          <label className="form-field"><span>Class applying for</span><input name="classApplied" value={form.classApplied} onChange={updateField} required placeholder="e.g. Class 6" /></label>
          <label className="form-field">
            <span>Caste category <em>Optional</em></span>
            <select name="caste" value={form.caste} onChange={updateField}>
              <option value="">Prefer not to say</option>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
            </select>
          </label>
          <label className="form-field">
            <span>Gender</span>
            <select name="gender" value={form.gender} onChange={updateField} required>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label className="form-field photo-upload-field">
            <span>Student photo <em>JPG, PNG or WEBP</em></span>
            <input className="photo-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} required />
            <span className="photo-upload-button"><Upload size={19} /><strong>{preparingPhoto ? "Preparing photo..." : photo ? photo.name : "Add a photo"}</strong><small>{photo ? "Ready to send" : "Tap to choose · any phone photo is fine"}</small></span>
          </label>
          <label className="form-field full">
            <span>Home address</span>
            <textarea name="address" value={form.address} onChange={updateField} required rows="3" placeholder="Town, village, or full address—whatever helps us reach you." />
          </label>
        </div>
        {status.message ? <p className={`form-status ${status.type}`} role="status">{status.message}</p> : null}
        <div className="form-submit-row"><p><ShieldCheck size={17} /> Your details go straight to our admissions team.</p><button className="primary-action form-button" disabled={loading || preparingPhoto}>{loading ? "Sending your story..." : <>Send my enquiry <ArrowRight size={19} /></>}</button></div>
      </Reveal>
      </div>
    </section>
  );
}
