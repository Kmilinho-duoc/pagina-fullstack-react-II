import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ProductosAdmin from "../paginas/admin/ProductosAdmin";
import * as catalogoAdmin from "../datos/catalogoAdmin";

vi.mock("../datos/catalogoAdmin", () => ({
  obtenerProductosAdmin: vi.fn(),
  guardarProductosAdmin: vi.fn(),
}));

describe("Pruebas del Componente ProductosAdmin", () => {
  const productosPrueba = [
    {
      id: "P001",
      nombre: "Torta de Mil Hojas",
      categoria: "Tortas Tradicionales",
      precio: 15000,
      stock: 10,
      stockCritico: 5,
    },
    {
      id: "P002",
      nombre: "Kuchen de Manzana",
      categoria: "Pie y Kuchen",
      precio: 8000,
      stock: 2,
      stockCritico: 5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderConRouter = (componente) => {
    return render(<BrowserRouter>{componente}</BrowserRouter>);
  };

  it("1. Agregar: permite navegar al formulario de creación de nuevo producto", () => {
    catalogoAdmin.obtenerProductosAdmin.mockReturnValue(productosPrueba);
    renderConRouter(<ProductosAdmin />);

    const botonNuevo = screen.getByRole("link", { name: /Nuevo producto/i });
    expect(botonNuevo).toBeTruthy();
    expect(botonNuevo.getAttribute("href")).toBe("/admin/productos/nuevo");
  });

  it("2. Eliminar: elimina un producto tras confirmar la alerta de confirmación", () => {
    catalogoAdmin.obtenerProductosAdmin.mockReturnValue(productosPrueba);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderConRouter(<ProductosAdmin />);

    const botonesEliminar = screen.getAllByRole("button");
    fireEvent.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalledWith("¿Eliminar este producto?");
    expect(catalogoAdmin.guardarProductosAdmin).toHaveBeenCalledWith([productosPrueba[1]]);
  });

  it("3. Formatear: formatea los precios en formato de moneda ($)", () => {
    catalogoAdmin.obtenerProductosAdmin.mockReturnValue(productosPrueba);
    renderConRouter(<ProductosAdmin />);

    const precioFormateado = screen.getByText(/\$15/i);
    expect(precioFormateado).toBeTruthy();
  });

  it("4. Cálculo de stock: evalúa dinámicamente si el stock es Normal o Stock crítico", () => {
    catalogoAdmin.obtenerProductosAdmin.mockReturnValue(productosPrueba);
    renderConRouter(<ProductosAdmin />);

    expect(screen.getByText("Normal")).toBeTruthy();
    expect(screen.getByText("Stock crítico")).toBeTruthy();
  });

  it("5. Navegación: verifica las rutas hacia la edición de productos existentes", () => {
    catalogoAdmin.obtenerProductosAdmin.mockReturnValue(productosPrueba);
    renderConRouter(<ProductosAdmin />);

    const enlacesEditar = screen.getAllByRole("link").filter(l => l.getAttribute("href")?.includes("/editar"));
    expect(enlacesEditar[0].getAttribute("href")).toBe("/admin/productos/P001/editar");
    expect(enlacesEditar[1].getAttribute("href")).toBe("/admin/productos/P002/editar");
  });
});