import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { TiendaProvider } from "./contexto/Tienda";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TiendaProvider>
      <App />
    </TiendaProvider>
  </BrowserRouter>
);
