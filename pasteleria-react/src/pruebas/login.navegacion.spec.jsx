import { fireEvent, screen } from "@testing-library/react";
import { renderApp } from "./ayudas";

const AVISO_COMPRA = "Debes iniciar sesión para realizar tu compra.";

function iniciarSesionCliente() {
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "cliente@gmail.com" } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "cliente123" } });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Login: navegación", () => {
  it("muestra el aviso al redirigir desde el carrito sin sesión", async () => {
    renderApp("/carrito", { storage: { carrito: [{ id: "TC001", quantity: 1 }] } });

    fireEvent.click(screen.getByRole("button", { name: "PAGAR" }));

    expect(await screen.findByRole("heading", { name: "Pastelería Mil Sabores" })).toBeInTheDocument();
    expect(screen.getByText(AVISO_COMPRA)).toBeInTheDocument();
  });

  it("no muestra aviso cuando se entra directamente al login", () => {
    renderApp("/login");

    expect(screen.queryByText(AVISO_COMPRA)).not.toBeInTheDocument();
  });

  it("vuelve al carrito después de iniciar sesión si la redirección venía de allí", async () => {
    renderApp(
      { pathname: "/login", state: { aviso: AVISO_COMPRA, volverA: "/carrito" } },
      { storage: { carrito: [{ id: "TC001", quantity: 1 }] } }
    );

    iniciarSesionCliente();

    expect(await screen.findByRole("heading", { name: "Mi carrito de compras" })).toBeInTheDocument();
  });

  it("lleva al registro al hacer clic en '¿No tienes cuenta?'", async () => {
    renderApp("/login");

    fireEvent.click(screen.getByRole("link", { name: /Regístrate aquí/ }));

    expect(await screen.findByRole("heading", { name: "Registro de usuario" })).toBeInTheDocument();
  });
});
