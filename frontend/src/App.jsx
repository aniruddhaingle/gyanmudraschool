import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Admissions from "./pages/Admissions.jsx";
import Gallery from "./pages/Gallery.jsx";
import Leadership from "./pages/Leadership.jsx";
import Admin from "./pages/Admin.jsx";

function NotFound() {
  return <main className="page-section"><h1>Page not found</h1><p>The page you requested does not exist.</p></main>;
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
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
