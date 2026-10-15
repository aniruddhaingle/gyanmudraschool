import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

// Site-styled replacement for window.confirm. Cancel is focused first so Enter never deletes by accident.
export default function ConfirmDialog({ title, children, confirmLabel = "Confirm", busyLabel = "Working...", busy = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => { cancelRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !busy) onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="confirm-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="confirm-icon" aria-hidden="true"><AlertTriangle size={26} /></div>
        <span>PLEASE CONFIRM</span>
        <h2 id="confirm-dialog-title">{title}</h2>
        <div className="confirm-body">{children}</div>
        <div className="confirm-actions">
          <button ref={cancelRef} type="button" className="confirm-cancel" onClick={onCancel} disabled={busy}>Keep it</button>
          <button type="button" className="confirm-danger" onClick={onConfirm} disabled={busy}>{busy ? busyLabel : confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
