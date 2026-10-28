// Pruebas de Registro (src/paginas/Registro.jsx) - Vitest + React Testing Library
//
// Cómo funcionan (igual que login.spec.jsx):
//   - renderApp monta la app en /registro con los datos de localStorage que cada prueba necesite.
//   - alert es un espía (configuracion.js): se verifica con expect(window.alert)...
//   - Los usuarios nuevos se guardan en localStorage["usuariosAdmin"], así que ahí se comprueba el resultado.
//
// OJO con Campo: el mensaje por defecto (ej. "Ingresa un run válido...") SIEMPRE está en el DOM y solo
// se oculta con CSS. Por eso un campo inválido se verifica con la clase "is-invalid", y los textos solo
// se usan cuando el mensaje de error es distinto del que viene por defecto.

import { screen, fireEvent } from "@testing-library/react";
import { renderApp } from "./ayudas";
import { regionesComunas } from "../datos/comunas";

/* ------------------------------ ayudas de este archivo ------------------------------ */

const ETIQUETAS = {
  run: "Run (sin puntos ni guion, ej: 19011022K)",
  nombre: "Nombre Completo",
  email: "Correo",
  confirmarEmail: "Confirmar Correo",
  password: "Contraseña",
  confirmarPassword: "Confirmar Contraseña",
  telefono: "Teléfono (opcional)",
  region: "Región",
  comuna: "Comuna",
};

const campo = (clave) => screen.getByLabelText(ETIQUETAS[clave]);
const esInvalido = (clave) => campo(clave).className.includes("is-invalid");

// Formulario completo y válido: cada prueba cambia solo lo que quiere probar.
const FORMULARIO_VALIDO = {
  run: "123456785",
  nombre: "Juan",
  email: "juan@gmail.com",
  confirmarEmail: "juan@gmail.com",
  password: "abcd",
  confirmarPassword: "abcd",
};

// Llena los campos indicados y presiona "Registrar".
function registrar(cambios = {}) {
  const datos = { ...FORMULARIO_VALIDO, ...cambios };
  Object.entries(datos).forEach(([clave, valor]) => {
    fireEvent.change(campo(clave), { target: { value: valor } });
  });
  fireEvent.click(screen.getByRole("button", { name: "Registrar" }));
}

const usuariosGuardados = () => JSON.parse(localStorage.getItem("usuariosAdmin"));

const usuarioExistente = (extra = {}) => ({
  run: "111111111",
  correo: "otro@gmail.com",
  nombre: "Otro",
  tipo: "Cliente",
  ...extra,
});

const MSG_DOMINIO = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
const REGION = "Región Metropolitana de Santiago";


/* ======================================== 1. RUN ======================================== */

describe("Registro: validación del RUN", () => {
  const invalidos = [
    { titulo: "dígito verificador incorrecto", run: "123456786" },
    { titulo: "demasiado corto", run: "12345" },
    { titulo: "escrito con puntos y guion", run: "12.345.678-5" },
    { titulo: "vacío", run: "" },
  ];

  it.each(invalidos)("rechaza un RUN $titulo y no guarda nada", ({ run }) => {
    renderApp("/registro");

    registrar({ run });

    expect(esInvalido("run")).toBe(true);
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("rechaza un RUN ya registrado, muestra el mensaje y no agrega otro usuario", () => {
    renderApp("/registro", { storage: { usuariosAdmin: [usuarioExistente({ run: "123456785" })] } });

    registrar({ run: "123456785" });

    expect(esInvalido("run")).toBe(true);
    expect(screen.getByText("Ya existe una cuenta registrada con ese run.")).toBeTruthy();
    expect(usuariosGuardados()).toHaveLength(1);
  });

  it("acepta un RUN válido y no repetido", () => {
    renderApp("/registro");

    registrar({ run: "123456785" });

    expect(usuariosGuardados().map((u) => u.run)).toEqual(["123456785"]);
  });

  it("acepta un RUN terminado en k minúscula y lo guarda en mayúscula", () => {
    renderApp("/registro");

    registrar({ run: "10000013k" });

    expect(usuariosGuardados()[0].run).toBe("10000013K");
  });
});


/* ======================================= 2. CORREO ======================================= */

describe("Registro: validación del correo", () => {
  it("rechaza un correo con dominio no permitido", () => {
    renderApp("/registro");

    registrar({ email: "juan@hotmail.com", confirmarEmail: "juan@hotmail.com" });

    expect(esInvalido("email")).toBe(true);
    expect(screen.getByText(MSG_DOMINIO)).toBeTruthy();
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
  });

  it("rechaza un correo ya registrado aunque cambien las mayúsculas", () => {
    renderApp("/registro", { storage: { usuariosAdmin: [usuarioExistente({ correo: "Juan@Gmail.com" })] } });

    registrar({ email: "juan@gmail.com", confirmarEmail: "juan@gmail.com" });

    expect(esInvalido("email")).toBe(true);
    expect(screen.getByText("Ya existe una cuenta registrada con este correo.")).toBeTruthy();
    expect(usuariosGuardados()).toHaveLength(1);
  });

  it("marca solo la confirmación cuando los correos no coinciden", () => {
    renderApp("/registro");

    registrar({ confirmarEmail: "juan2@gmail.com" });

    expect(esInvalido("confirmarEmail")).toBe(true);
    expect(esInvalido("email")).toBe(false);
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
  });

  it.each(["ana@duoc.cl", "ana@profesor.duoc.cl", "ana@gmail.com"])("acepta el correo %s", (correo) => {
    renderApp("/registro");

    registrar({ email: correo, confirmarEmail: correo });

    expect(usuariosGuardados()[0].correo).toBe(correo);
  });

  // Requiere la bandera i en emailRegex de Registro.jsx (paso 5). Login y Contacto ya ignoran mayúsculas.
  it("acepta un correo con el dominio en mayúsculas", () => {
    renderApp("/registro");

    registrar({ email: "JUAN@GMAIL.COM", confirmarEmail: "JUAN@GMAIL.COM" });

    expect(usuariosGuardados()).toHaveLength(1);
  });
});


/* ================================== 3. REGISTRO EXITOSO ================================== */

describe("Registro: guardado del usuario y paso al login", () => {
  it("guarda un cliente nuevo con los datos limpios y avisa con alert", () => {
    renderApp("/registro");

    registrar({
      nombre: "  Juan  ",
      telefono: " +56912345678 ",
    });

    // nombre y teléfono se guardan sin espacios; región y comuna quedan vacías porque no se eligieron
    expect(usuariosGuardados()).toEqual([{
      run: "123456785",
      nombre: "Juan",
      apellidos: "",
      correo: "juan@gmail.com",
      password: "abcd",
      telefono: "+56912345678",
      fechaNacimiento: "",
      tipo: "Cliente",
      region: "",
      comuna: "",
      direccion: "",
    }]);
    expect(window.alert).toHaveBeenCalledWith("¡Registro exitoso! Ahora puedes iniciar sesión.");
  });

  it("guarda la región y la comuna elegidas", () => {
    renderApp("/registro");

    fireEvent.change(campo("region"), { target: { value: REGION } });
    fireEvent.change(campo("comuna"), { target: { value: "Santiago" } });
    registrar();

    expect(usuariosGuardados()[0]).toEqual(expect.objectContaining({ region: REGION, comuna: "Santiago" }));
  });

  it("agrega el usuario nuevo sin borrar los que ya existían", () => {
    renderApp("/registro", { storage: { usuariosAdmin: [usuarioExistente()] } });

    registrar();

    expect(usuariosGuardados().map((u) => u.run)).toEqual(["111111111", "123456785"]);
  });

  it("pasa a la pantalla de login después de registrarse", async () => {
    renderApp("/registro");

    registrar();

    expect(await screen.findByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Registro de usuario" })).toBeNull();
  });

  it("permite iniciar sesión enseguida con la cuenta recién creada", async () => {
    renderApp("/registro");

    registrar();   // juan@gmail.com / abcd (formulario válido por defecto)

    // ahora estamos en el login: se usan los mismos datos
    await screen.findByRole("button", { name: "Iniciar sesión" });
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "juan@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "abcd" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(JSON.parse(localStorage.getItem("sesionActual"))).toEqual({ correo: "juan@gmail.com", nombre: "Juan", rol: "cliente" });
    expect(window.alert).toHaveBeenLastCalledWith("¡Inicio de sesión exitoso!");
  });
});


/* ================================== 4. CONTRASEÑA Y NOMBRE ================================ */

describe("Registro: contraseña y nombre", () => {
  it.each([[3, "abc"], [11, "abcdefghijk"]])("rechaza una contraseña de %i caracteres", (largo, password) => {
    renderApp("/registro");

    registrar({ password, confirmarPassword: password });

    expect(esInvalido("password")).toBe(true);
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
  });

  it.each([[4, "abcd"], [10, "abcdefghij"]])("acepta una contraseña de exactamente %i caracteres", (largo, password) => {
    renderApp("/registro");

    registrar({ password, confirmarPassword: password });

    expect(usuariosGuardados()[0].password).toBe(password);
  });

  it("marca solo la confirmación cuando las contraseñas no coinciden", () => {
    renderApp("/registro");

    registrar({ confirmarPassword: "distinta" });

    expect(esInvalido("confirmarPassword")).toBe(true);
    expect(esInvalido("password")).toBe(false);
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
  });

  it("rechaza un nombre vacío o formado solo por espacios", () => {
    renderApp("/registro");

    registrar({ nombre: "     " });

    expect(esInvalido("nombre")).toBe(true);
    expect(localStorage.getItem("usuariosAdmin")).toBeNull();
  });
});


/* ================================== 5. REGIÓN Y COMUNA =================================== */

describe("Registro: región y comuna", () => {
  it("deja la comuna deshabilitada hasta elegir una región", () => {
    renderApp("/registro");

    expect(campo("comuna").disabled).toBe(true);
    // "Seleccione la región..." + todas las regiones del archivo de datos
    expect(campo("region").options).toHaveLength(Object.keys(regionesComunas).length + 1);
  });

  it("habilita y llena la comuna con las comunas de la región elegida", () => {
    renderApp("/registro");

    fireEvent.change(campo("region"), { target: { value: REGION } });

    expect(campo("comuna").disabled).toBe(false);
    // "Seleccione la comuna..." + las comunas de esa región
    expect(campo("comuna").options).toHaveLength(regionesComunas[REGION].length + 1);
  });

  it("reinicia la comuna al cambiar de región", () => {
    const otraRegion = Object.keys(regionesComunas).find((r) => r !== REGION);
    renderApp("/registro");

    fireEvent.change(campo("region"), { target: { value: REGION } });
    fireEvent.change(campo("comuna"), { target: { value: "Santiago" } });
    expect(campo("comuna").value).toBe("Santiago");

    fireEvent.change(campo("region"), { target: { value: otraRegion } });

    expect(campo("comuna").value).toBe("");
  });
});
