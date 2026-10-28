import { fireEvent, screen } from "@testing-library/react";
import { renderApp } from "./ayudas";

const MENSAJE_DOMINIO = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
const MENSAJE_PASSWORD = "La contraseña debe tener entre 4 y 10 caracteres.";

function enviarLogin(email, password) {
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Login: validación de campos", () => {
  const casosInvalidos = [
    {
      titulo: "rechaza un correo vacío",
      email: "",
      password: "cliente123",
      campoInvalido: "Correo",
      mensaje: "El correo es requerido.",
    },
    {
      titulo: "rechaza un correo de más de 100 caracteres",
      email: `${"a".repeat(95)}@gmail.com`,
      password: "cliente123",
      campoInvalido: "Correo",
      mensaje: "El correo no puede exceder los 100 caracteres.",
    },
    {
      titulo: "rechaza un correo con dominio no permitido",
      email: "estudiante@hotmail.com",
      password: "cliente123",
      campoInvalido: "Correo",
      mensaje: MENSAJE_DOMINIO,
    },
    {
      titulo: "rechaza una contraseña vacía",
      email: "cliente@gmail.com",
      password: "",
      campoInvalido: "Contraseña",
      mensaje: "La contraseña es requerida.",
    },
    {
      titulo: "rechaza una contraseña de 3 caracteres",
      email: "cliente@gmail.com",
      password: "abc",
      campoInvalido: "Contraseña",
      mensaje: MENSAJE_PASSWORD,
    },
    {
      titulo: "rechaza una contraseña de 11 caracteres",
      email: "cliente@gmail.com",
      password: "abcdefghijk",
      campoInvalido: "Contraseña",
      mensaje: MENSAJE_PASSWORD,
    },
  ];

  it.each(casosInvalidos)("$titulo", ({ email, password, campoInvalido, mensaje }) => {
    renderApp("/login");

    enviarLogin(email, password);

    expect(screen.getByText(mensaje)).toBeInTheDocument();
    expect(screen.getByLabelText(campoInvalido)).toHaveClass("is-invalid");
    expect(localStorage.getItem("sesionActual")).toBeNull();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("no muestra errores antes de enviar el formulario", () => {
    renderApp("/login");

    expect(screen.getByLabelText("Correo")).not.toHaveClass("is-invalid");
    expect(screen.getByLabelText("Contraseña")).not.toHaveClass("is-invalid");
  });
});
