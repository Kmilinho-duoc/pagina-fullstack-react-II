import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Contacto from "../paginas/Contacto";

describe("Pruebas del Componente Contacto", () => {
  beforeEach(() => {
    render(<Contacto />);
  });

  it("1. Renderiza correctamente el título y los campos principales", () => {
    expect(screen.getByText("Contáctanos")).toBeTruthy();
    expect(screen.getByLabelText(/Nombre Y Apellido/i)).toBeTruthy();
    expect(screen.getByLabelText(/Correo \(opcional\)/i)).toBeTruthy();
    expect(screen.getByLabelText(/Número Telefónico \(opcional\)/i)).toBeTruthy();
    expect(screen.getByLabelText(/Comentario/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /ENVIAR MENSAJE/i })).toBeTruthy();
  });

  it("2. Muestra errores cuando se intenta enviar el formulario vacío", () => {
    const botonEnviar = screen.getByRole("button", { name: /ENVIAR MENSAJE/i });
    fireEvent.click(botonEnviar);

    expect(screen.getByText("El nombre debe tener al menos 6 caracteres.")).toBeTruthy();
    expect(screen.getByText("El comentario es requerido.")).toBeTruthy();
  });

  it("3. Exige al menos un medio de contacto (email o teléfono)", () => {
    const inputNombre = screen.getByLabelText(/Nombre Y Apellido/i);
    const inputComentario = screen.getByLabelText(/Comentario/i);
    const botonEnviar = screen.getByRole("button", { name: /ENVIAR MENSAJE/i });

    fireEvent.change(inputNombre, { target: { value: "Juan Pérez" } });
    fireEvent.change(inputComentario, { target: { value: "Consulta sobre pasteles de boda." } });
    fireEvent.click(botonEnviar);

    const errorContacto = screen.getAllByText("Debes ingresar al menos un correo o un número telefónico.");
    expect(errorContacto.length).toBeGreaterThan(0);
  });

  it("4. Acepta el formulario si solo se proporciona el correo", () => {
    const inputNombre = screen.getByLabelText(/Nombre Y Apellido/i);
    const inputEmail = screen.getByLabelText(/Correo \(opcional\)/i);
    const inputComentario = screen.getByLabelText(/Comentario/i);
    const botonEnviar = screen.getByRole("button", { name: /ENVIAR MENSAJE/i });

    fireEvent.change(inputNombre, { target: { value: "Juan Pérez" } });
    fireEvent.change(inputEmail, { target: { value: "juan@gmail.com" } });
    fireEvent.change(inputComentario, { target: { value: "Consulta sobre pedido de novios." } });

    fireEvent.click(botonEnviar);

    expect(screen.getByText(/¡Mensaje enviado con éxito! Gracias por contactarnos./i)).toBeTruthy();
  });

  it("5. Acepta el formulario si solo se proporciona el teléfono chileno", () => {
    const inputNombre = screen.getByLabelText(/Nombre Y Apellido/i);
    const inputTelefono = screen.getByLabelText(/Número Telefónico \(opcional\)/i);
    const inputComentario = screen.getByLabelText(/Comentario/i);
    const botonEnviar = screen.getByRole("button", { name: /ENVIAR MENSAJE/i });

    fireEvent.change(inputNombre, { target: { value: "María González" } });
    fireEvent.change(inputTelefono, { target: { value: "+56912345678" } });
    fireEvent.change(inputComentario, { target: { value: "Cotización para evento." } });

    fireEvent.click(botonEnviar);

    expect(screen.getByText(/¡Mensaje enviado con éxito! Gracias por contactarnos./i)).toBeTruthy();
  });

  it("6. Limpia el formulario tras un envío exitoso", () => {
    const inputNombre = screen.getByLabelText(/Nombre Y Apellido/i);
    const inputEmail = screen.getByLabelText(/Correo \(opcional\)/i);
    const inputComentario = screen.getByLabelText(/Comentario/i);
    const botonEnviar = screen.getByRole("button", { name: /ENVIAR MENSAJE/i });

    fireEvent.change(inputNombre, { target: { value: "Carlos Tapia" } });
    fireEvent.change(inputEmail, { target: { value: "carlos@duoc.cl" } });
    fireEvent.change(inputComentario, { target: { value: "Mensaje de prueba." } });

    fireEvent.click(botonEnviar);

    expect(inputNombre.value).toBe("");
    expect(inputEmail.value).toBe("");
    expect(inputComentario.value).toBe("");
  });
});