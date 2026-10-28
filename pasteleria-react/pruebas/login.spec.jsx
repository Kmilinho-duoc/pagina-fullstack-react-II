// Pruebas de Login (src/paginas/Login.jsx) - Vitest + React Testing Library
//
// Cómo funcionan:
//   - renderApp (ayudas.jsx) monta la app completa en la ruta indicada, con datos ya guardados
//     en localStorage. Así se prueba el flujo real: formulario -> sesión -> cambio de página.
//   - alert está reemplazado por un espía (configuracion.js), por eso se verifica con
//     expect(window.alert).toHaveBeenCalledWith(...).
//   - localStorage se vacía antes de cada prueba (configuracion.js).

import { screen, fireEvent } from "@testing-library/react";
import { renderApp } from "./ayudas.jsx";

/* ------------------------------ ayudas de este archivo ------------------------------ */

function campoCorreo() {
  return screen.getByLabelText("Correo");
}

function campoPassword() {
  return screen.getByLabelText("Contraseña");
}

// Escribe en el formulario y presiona "Iniciar sesión".
// (el enlace "Iniciar sesión" de la barra superior es un link, no un botón: no se confunde)
function iniciarSesionConFormulario(email, password) {
  fireEvent.change(campoCorreo(), { target: { value: email } });
  fireEvent.change(campoPassword(), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

const sesionGuardada = () => JSON.parse(localStorage.getItem("sesionActual"));

const MSG_DOMINIO = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
const MSG_PASSWORD_LARGO = "La contraseña debe tener entre 4 y 10 caracteres.";

const usuarioGuardado = (extra = {}) => ({
  run: "123456785",
  correo: "ana@gmail.com",
  password: "clave1",
  nombre: "Ana",
  tipo: "Cliente",
  ...extra,
});


/* =============================== 1. VALIDACIÓN DE CAMPOS =============================== */

describe("Login: validación de los campos", () => {
  const casos = [
    { titulo: "rechaza un correo vacío", email: "", password: "cliente123",
      campo: "Correo", otro: "Contraseña", error: "El correo es requerido." },
    { titulo: "rechaza un correo de más de 100 caracteres", email: "a".repeat(95) + "@gmail.com", password: "cliente123",
      campo: "Correo", otro: "Contraseña", error: "El correo no puede exceder los 100 caracteres." },
    { titulo: "rechaza un correo con dominio no permitido", email: "juan@hotmail.com", password: "cliente123",
      campo: "Correo", otro: "Contraseña", error: MSG_DOMINIO },
    { titulo: "rechaza una contraseña vacía", email: "cliente@gmail.com", password: "",
      campo: "Contraseña", otro: "Correo", error: "La contraseña es requerida." },
    { titulo: "rechaza una contraseña de 3 caracteres", email: "cliente@gmail.com", password: "abc",
      campo: "Contraseña", otro: "Correo", error: MSG_PASSWORD_LARGO },
    { titulo: "rechaza una contraseña de 11 caracteres", email: "cliente@gmail.com", password: "abcdefghijk",
      campo: "Contraseña", otro: "Correo", error: MSG_PASSWORD_LARGO },
  ];

  it.each(casos)("$titulo", ({ email, password, campo, otro, error }) => {
    renderApp("/login");

    iniciarSesionConFormulario(email, password);

    // se muestra el mensaje exacto y solo el campo con problema queda marcado
    expect(screen.getByText(error)).toBeTruthy();
    expect(screen.getByLabelText(campo).className).toContain("is-invalid");
    expect(screen.getByLabelText(otro).className).not.toContain("is-invalid");

    // no se llegó a buscar al usuario: no hay alert ni sesión
    expect(window.alert).not.toHaveBeenCalled();
    expect(localStorage.getItem("sesionActual")).toBeNull();
  });

  it("no muestra ningún error antes de enviar el formulario", () => {
    renderApp("/login");

    expect(campoCorreo().className).not.toContain("is-invalid");
    expect(campoPassword().className).not.toContain("is-invalid");
  });
});


/* =============================== 2. CREDENCIALES CORRECTAS ============================= */

describe("Login: credenciales correctas crean la sesión y redirigen según el rol", () => {
  const TITULO_HOME = "Tienda Online";
  const TITULO_PANEL = "¡Hola, Administrador!";

  const casos = [
    { titulo: "cliente de prueba entra a la tienda",
      email: "cliente@gmail.com", password: "cliente123", storage: {},
      sesion: { correo: "cliente@gmail.com", nombre: "Cliente Demo", rol: "cliente" },
      mensaje: "¡Inicio de sesión exitoso!", destino: TITULO_HOME },

    { titulo: "administrador de prueba entra al panel",
      email: "admin@duoc.cl", password: "admin123", storage: {},
      sesion: { correo: "admin@duoc.cl", nombre: "Admin Sistema", rol: "administrador" },
      mensaje: "¡Inicio de sesión exitoso! Ingresando al panel de administración.", destino: TITULO_PANEL },

    { titulo: "usuario creado desde el registro (tipo Cliente)",
      email: "ana@gmail.com", password: "clave1", storage: { usuariosAdmin: [usuarioGuardado()] },
      sesion: { correo: "ana@gmail.com", nombre: "Ana", rol: "cliente" },
      mensaje: "¡Inicio de sesión exitoso!", destino: TITULO_HOME },

    { titulo: "usuario guardado con tipo Administrador entra al panel",
      email: "jefa@duoc.cl", password: "jefa1",
      storage: { usuariosAdmin: [usuarioGuardado({ correo: "jefa@duoc.cl", password: "jefa1", nombre: "Jefa", tipo: "Administrador" })] },
      sesion: { correo: "jefa@duoc.cl", nombre: "Jefa", rol: "administrador" },
      mensaje: "¡Inicio de sesión exitoso! Ingresando al panel de administración.", destino: TITULO_PANEL },

    { titulo: "ignora las mayúsculas del correo",
      email: "CLIENTE@GMAIL.COM", password: "cliente123", storage: {},
      sesion: { correo: "cliente@gmail.com", nombre: "Cliente Demo", rol: "cliente" },
      mensaje: "¡Inicio de sesión exitoso!", destino: TITULO_HOME },

    { titulo: "acepta una contraseña de exactamente 4 caracteres",
      email: "ana@gmail.com", password: "1234",
      storage: { usuariosAdmin: [usuarioGuardado({ password: "1234" })] },
      sesion: { correo: "ana@gmail.com", nombre: "Ana", rol: "cliente" },
      mensaje: "¡Inicio de sesión exitoso!", destino: TITULO_HOME },
  ];

  it.each(casos)("$titulo", async ({ email, password, storage, sesion, mensaje, destino }) => {
    renderApp("/login", { storage });

    iniciarSesionConFormulario(email, password);

    // 1) se guardó la sesión con el rol correcto
    expect(sesionGuardada()).toEqual(sesion);
    // 2) se avisó al usuario
    expect(window.alert).toHaveBeenCalledWith(mensaje);
    // 3) se cambió de página: ya no está el formulario y se ve la pantalla de destino
    expect(await screen.findByRole("heading", { name: destino })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Iniciar sesión" })).toBeNull();
  });

  it("acepta una contraseña de exactamente 10 caracteres", () => {
    renderApp("/login");

    iniciarSesionConFormulario("cliente@gmail.com", "cliente123");   // "cliente123" tiene 10 caracteres

    expect(sesionGuardada()).not.toBeNull();
  });
});


/* =============================== 3. CREDENCIALES INCORRECTAS =========================== */

describe("Login: credenciales incorrectas", () => {
  const casos = [
    { titulo: "correo registrado con contraseña equivocada",
      email: "cliente@gmail.com", password: "incorrecta", storage: {} },
    { titulo: "correo que no existe",
      email: "nadie@gmail.com", password: "cliente123", storage: {} },
    { titulo: "contraseña con mayúsculas distintas",
      email: "cliente@gmail.com", password: "CLIENTE123", storage: {} },
    { titulo: "usuario guardado con otra contraseña",
      email: "ana@gmail.com", password: "clave2", storage: { usuariosAdmin: [usuarioGuardado()] } },
  ];

  it.each(casos)("rechaza: $titulo", ({ email, password, storage }) => {
    renderApp("/login", { storage });

    iniciarSesionConFormulario(email, password);

    expect(window.alert).toHaveBeenCalledWith("Correo o contraseña incorrectos.");
    expect(campoCorreo().className).toContain("is-invalid");
    expect(campoPassword().className).toContain("is-invalid");
    expect(localStorage.getItem("sesionActual")).toBeNull();
    // sigue en la página de login
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
  });
});


/* =============================== 4. AVISO Y VOLVER AL CARRITO ========================== */

describe("Login: aviso y regreso a la página de origen", () => {
  const AVISO_COMPRA = "Debes iniciar sesión para realizar tu compra.";

  it("muestra el aviso que trae la redirección (por ejemplo, al intentar pagar sin sesión)", () => {
    renderApp({ pathname: "/login", state: { aviso: AVISO_COMPRA, volverA: "/carrito" } });

    expect(screen.getByText(AVISO_COMPRA)).toBeTruthy();
  });

  it("no muestra ningún aviso cuando se entra directamente", () => {
    renderApp("/login");

    expect(screen.queryByText(AVISO_COMPRA)).toBeNull();
  });

  it("después de iniciar sesión vuelve al carrito si venía de allí", async () => {
    renderApp({ pathname: "/login", state: { aviso: AVISO_COMPRA, volverA: "/carrito" } });

    iniciarSesionConFormulario("cliente@gmail.com", "cliente123");

    expect(await screen.findByRole("heading", { name: "Mi carrito de compras" })).toBeTruthy();
  });
});


/* =============================== 5. ENLACE A REGISTRO ================================== */

describe("Login: enlace a registro", () => {
  it("lleva a la página de registro al hacer click en '¿No tienes cuenta?'", async () => {
    renderApp("/login");

    fireEvent.click(screen.getByRole("link", { name: /Regístrate aquí/ }));

    expect(await screen.findByRole("heading", { name: "Registro de usuario" })).toBeTruthy();
  });
});
