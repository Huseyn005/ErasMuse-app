import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
<div className="erasmuse-header">
  <img src="/images/erasmuse-icon.jpg" alt="ERASMuse logo" />
  <span>ERASMuse</span>
</div>

createRoot(document.getElementById("root")!).render(<App />);
