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

const usuarioGuardado = (extra = {}) => ({
  run: "123456785",
  correo: "ana@gmail.com",
  password: "clave1",
  nombre: "Ana",
  tipo: "Cliente",
  ...extra,
});

/* =============================== CREDENCIALES CORRECTAS ================================ */

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


/* ============================== CREDENCIALES INCORRECTAS =============================== */

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

