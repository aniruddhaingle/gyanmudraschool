import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Admissions from "./pages/Admissions.jsx";
import Gallery from "./pages/Gallery.jsx";
import Leadership from "./pages/Leadership.jsx";

// The admin panel (editors, managers) is only downloaded when someone opens /admin.
const Admin = lazy(() => import("./pages/Admin.jsx"));

function NotFound() {
  return (
    <section className="not-found">
      <span>ERROR 404</span>
      <h1>This page went on a field trip.</h1>
      <p>We couldn’t find the page you were looking for. It may have moved, or the link may be mistyped.</p>
      <nav aria-label="Helpful links">
        <Link to="/">Go to home</Link>
        <Link to="/admissions">Admissions</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/admin" element={<Suspense fallback={<section className="admin-auth" aria-busy="true" />}><Admin /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
