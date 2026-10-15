import { useEffect, useState } from "react";
import { Bell, ClipboardList, Images, LayoutDashboard, LogOut, Settings2, X } from "lucide-react";
import GalleryManager from "../components/GalleryManager.jsx";
import WebsiteManager from "../components/WebsiteManager.jsx";
import { getAdminSession, getAdmissions, loginAdmin, logoutAdmin, markAdmissionsSeen, updateAdmissionStatus } from "../services/api.js";

const tabs = [["overview", "Overview", LayoutDashboard], ["admissions", "Admissions", ClipboardList], ["gallery", "Events & gallery", Images], ["website", "Website manager", Settings2]];
const statuses = ["New", "Contacted", "Admitted", "Rejected"];

const plural = (count, word) => `${count} ${count === 1 ? word : word.replace(/y$/, "ie")}${count === 1 ? "" : "s"}`;
const formatDate = (value) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Enquiries that arrived after the admin last dismissed the popup.
const unseenOf = (list, seenAt) => list.filter((item) => !seenAt || new Date(item.createdAt) > new Date(seenAt));

export default function Admin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [admissions, setAdmissions] = useState([]);
  const [seenAt, setSeenAt] = useState(null);
  const [auth, setAuth] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState("overview");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const unseen = unseenOf(admissions, seenAt);
  const awaiting = admissions.filter((item) => item.status === "New");

  async function load({ showAlert = false } = {}) {
    const data = await getAdmissions();
    setAdmissions(data.admissions);
    setSeenAt(data.seenAt);
    if (showAlert && unseenOf(data.admissions, data.seenAt).length) setAlert(true);
  }

  // Stay logged in across page refreshes while the login cookie is valid.
  useEffect(() => {
    getAdminSession()
      .then(async () => { setAuth(true); await load({ showAlert: true }); })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await loginAdmin(credentials);
      setAuth(true);
      setCredentials({ email: "", password: "" });
      await load({ showAlert: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await logoutAdmin().catch(() => {});
    setAuth(false);
    setAdmissions([]);
    setSeenAt(null);
    setTab("overview");
  }

  // Closing the popup marks the current enquiries as seen, so it only returns for newer ones.
  async function closeAlert(openAdmissions = false) {
    setAlert(false);
    if (openAdmissions) setTab("admissions");
    if (!unseen.length) return;
    try {
      const data = await markAdmissionsSeen();
      setSeenAt(data.seenAt);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function changeStatus(admission, status) {
    setAdmissions((list) => list.map((item) => (item._id === admission._id ? { ...item, status } : item)));
    try {
      await updateAdmissionStatus(admission._id, status);
    } catch (error) {
      setAdmissions((list) => list.map((item) => (item._id === admission._id ? { ...item, status: admission.status } : item)));
      setMessage(error.message);
    }
  }

  if (checkingSession) return <section className="admin-auth" aria-busy="true" />;

  if (!auth) {
    return (
      <section className="admin-auth">
        <div><span>GYAN MUDRA / TEAM ONLY</span><h1>The school,<br />in your hands.</h1><p>One private space for admissions, events, photos, and website updates.</p></div>
        <form className="admin-login admin-auth-form" onSubmit={login}>
          <h2>Welcome back.</h2>
          <label>Email<input type="email" autoComplete="username" value={credentials.email} onChange={(e) => setCredentials((c) => ({ ...c, email: e.target.value }))} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={credentials.password} onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))} required /></label>
          <button className="primary-action form-button" disabled={loading}>{loading ? "Checking..." : "Open admin panel"}</button>
          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="admin-console">
      <aside className="admin-sidebar">
        <div><span>GYAN MUDRA</span><strong>Admin panel</strong></div>
        <nav>
          {tabs.map(([id, label, Icon]) => (
            <button className={tab === id ? "active" : ""} onClick={() => setTab(id)} key={id}>
              <Icon size={18} /> {label}{id === "admissions" && awaiting.length ? <b title="Awaiting follow-up">{awaiting.length}</b> : null}
            </button>
          ))}
        </nav>
        <button onClick={logout}><LogOut size={18} /> Log out</button>
      </aside>

      <main className="admin-main">
        <header>
          <div><span>ADMIN CONSOLE</span><h1>{tabs.find(([id]) => id === tab)[1]}</h1></div>
          <button className="admin-alert" onClick={() => setAlert(true)} aria-label={unseen.length ? `${plural(unseen.length, "new enquiry")}` : "Notifications"}>
            <Bell />{unseen.length ? <b>{unseen.length}</b> : null}
          </button>
        </header>
        {message && <p className="form-status">{message}</p>}

        {tab === "overview" && (
          <>
            <section className="admin-welcome">
              <span>GOOD TO SEE YOU</span>
              <h2>Everything important, right here.</h2>
              <p>{awaiting.length ? `${plural(awaiting.length, "enquiry")} still waiting for a call back.` : "Every enquiry has been followed up. Nice work!"} Your website tools are one click away.</p>
              <button className="primary-action" onClick={() => setTab("admissions")}>Review admissions</button>
            </section>
            <div className="admin-stats">
              <button onClick={() => setTab("admissions")}><strong>{admissions.length}</strong><span>Total enquiries</span></button>
              <button onClick={() => setTab("admissions")}><strong>{awaiting.length}</strong><span>Awaiting follow-up</span></button>
              <button onClick={() => setTab("gallery")}><strong>+</strong><span>Publish event</span></button>
            </div>
          </>
        )}

        {tab === "admissions" && (
          <section className="admin-panel">
            <div className="admissions-head">
              <div>
                <h2>All enquiries</h2>
                <p>Set the status after you call a family. “New” means nobody has followed up yet.</p>
              </div>
              <button className="gm-link" onClick={() => load().catch((error) => setMessage(error.message))}>Refresh</button>
            </div>
            {admissions.length ? admissions.map((item) => {
              const isUnseen = unseen.some((u) => u._id === item._id);
              return (
                <article className="admission-row" key={item._id}>
                  <div>
                    <b>{item.firstName} {item.lastName}{isUnseen ? <i className="admission-new">NEW</i> : null}</b>
                    <span>{item.classApplied} · <a href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}>{item.phone}</a> · {formatDate(item.createdAt)}</span>
                  </div>
                  <label className="admission-status">
                    <span className="sr-only">Status for {item.firstName} {item.lastName}</span>
                    <select value={item.status} data-status={item.status} onChange={(e) => changeStatus(item, e.target.value)}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                </article>
              );
            }) : <p>No admissions yet.</p>}
          </section>
        )}

        {tab === "gallery" && <GalleryManager />}

        {tab === "website" && <WebsiteManager onOpenGallery={() => setTab("gallery")} />}
      </main>

      {alert && (
        <div className="admin-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) closeAlert(); }}>
          <section role="dialog" aria-modal="true" aria-label="New admissions">
            <button onClick={() => closeAlert()} aria-label="Close"><X /></button>
            <span>NEW ADMISSIONS</span>
            <h2>{unseen.length ? `${plural(unseen.length, "new enquiry")} since your last visit.` : "You’re all caught up."}</h2>
            {unseen.slice(0, 5).map((item) => <p key={item._id}><b>{item.firstName} {item.lastName}</b> · {item.classApplied}</p>)}
            {unseen.length > 5 ? <p>…and {unseen.length - 5} more.</p> : null}
            {!unseen.length && awaiting.length ? <p>{plural(awaiting.length, "enquiry")} still marked “New” and waiting for a call back.</p> : null}
            <button className="primary-action" onClick={() => closeAlert(true)}>Open admissions</button>
          </section>
        </div>
      )}
    </section>
  );
}
