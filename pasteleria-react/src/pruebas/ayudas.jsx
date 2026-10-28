import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { TiendaProvider } from "../contexto/Tienda";

// Monta la aplicación completa con una ruta y datos iniciales controlados.
// ruta puede ser una URL o un objeto { pathname, state } de React Router.
export function renderApp(ruta = "/", { storage = {} } = {}) {
  Object.entries(storage).forEach(([clave, valor]) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  });

  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </TiendaProvider>
  );
}
