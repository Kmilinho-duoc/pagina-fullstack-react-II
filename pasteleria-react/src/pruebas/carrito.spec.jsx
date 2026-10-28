import { screen, fireEvent, within } from "@testing-library/react";
import { renderApp } from "./ayudas";
import { productos } from "../datos/inventario";
import { obtenerProductosAdmin } from "../datos/catalogoAdmin";

// -------------------------Ingreso de datos de prueba-------------------------

// Busqueda de precios por id
const precio = (id) => productos.find((p) => p.id === id).precio;

const ENVIO = 3500;
const CARRITO_BASE = [{ id: "TC001", quantity: 2 }, { id: "PI001", quantity: 1 }];
const SUBTOTAL_BASE = precio("TC001") * 2 + precio("PI001") * 1;   // 45.000 × 2 + 5.000 × 1 = 95.000
const SESION = { correo: "cliente@gmail.com", nombre: "Cliente Demo", rol: "cliente" };

const NOMBRE = { TC001: "Torta Cuadrada de Chocolate", PI001: "Mousse de Chocolate" };

const MSG_VACIO = "Tu carrito está vacío.";
const AVISO_COMPRA = "Debes iniciar sesión para realizar tu compra.";
const MSG_EXITO = "¡Compra realizada con éxito! Gracias por tu compra en Pastelería Mil Sabores.";

// Catálogo (productosAdmin) con 20 unidades de cada producto
function catalogoCon(stocks = {}) {
  return obtenerProductosAdmin().map((p) => (p.id in stocks ? { ...p, stock: stocks[p.id] } : p));
}

// Abre /carrito con lo indicado ya guardado. Sin "productosAdmin", el catálogo parte con 20 de cada uno.
function renderCarrito({ carrito = CARRITO_BASE, sesion, productosAdmin } = {}) {
  const storage = { carrito };
  if (sesion) storage.sesionActual = sesion;
  if (productosAdmin) storage.productosAdmin = productosAdmin;
  return renderApp("/carrito", { storage });
}

const digitos = (texto) => texto.replace(/\D/g, "");
// Valor del resumen que está al lado de su etiqueta ("Subtotal:", "Envío:", "TOTAL:"), solo dígitos
const valorDe = (etiqueta) => digitos(screen.getByText(etiqueta).nextElementSibling.textContent);

const pagar = () => fireEvent.click(screen.getByRole("button", { name: "PAGAR" }));

// Tarjeta de una línea del carrito y sus controles
const lineaDe = (nombre) => within(screen.getByText(nombre).closest(".card"));
const cantidadDe = (nombre) => lineaDe(nombre).getByRole("textbox").value;
const botonMenos = (nombre) => lineaDe(nombre).getByRole("button", { name: "-" });
const botonMas = (nombre) => lineaDe(nombre).getByRole("button", { name: "+" });
const botonEliminar = (nombre) => {
  const botones = lineaDe(nombre).getAllByRole("button");   // [-, +, papelera]
  return botones[botones.length - 1];
};

const carritoGuardado = () => JSON.parse(localStorage.getItem("carrito"));
const stockDe = (id) => JSON.parse(localStorage.getItem("productosAdmin")).find((p) => p.id === id).stock;


// ===================================== 1. Precios totales ===================================== 

describe("Carrito: precios totales", () => {
  it("calcula subtotal, envío y total con los precios del catálogo", () => {
    renderCarrito();   // TC001 ×2 + PI001 ×1

    expect(valorDe("Subtotal:")).toBe(String(SUBTOTAL_BASE));
    expect(valorDe("Envío:")).toBe(String(ENVIO));
    expect(valorDe("TOTAL:")).toBe(String(SUBTOTAL_BASE + ENVIO));
  });

  it("con el carrito vacío muestra el mensaje y el envío es $0", () => {
    renderCarrito({ carrito: [] });

    expect(screen.getByText(MSG_VACIO)).toBeTruthy();
    expect(valorDe("Subtotal:")).toBe("0");
    expect(valorDe("Envío:")).toBe("0");
    expect(valorDe("TOTAL:")).toBe("0");
  });

  it("no muestra el mensaje de carrito vacío cuando hay productos", () => {
    renderCarrito();

    expect(screen.queryByText(MSG_VACIO)).toBeNull();
    expect(screen.getByText(NOMBRE.TC001)).toBeTruthy();
    expect(screen.getByText(NOMBRE.PI001)).toBeTruthy();
  });
});


// ===================================== 2. Pagar ===================================== 

describe("Carrito: pagar", () => {
  it("con el carrito vacío avisa con un alert y no cambia de página", () => {
    renderCarrito({ carrito: [], sesion: SESION });

    pagar();

    expect(window.alert).toHaveBeenCalledWith(MSG_VACIO);
    expect(screen.getByRole("heading", { name: "Mi carrito de compras" })).toBeTruthy();
  });

  it("sin sesión lleva a /login con el aviso y no cobra nada", async () => {
    renderCarrito({ productosAdmin: catalogoCon() });

    pagar();

    // 1) se llega al login y se ve el aviso que trae la redirección
    expect(await screen.findByText(AVISO_COMPRA)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();

    // 2) no se cobró: sin alert, stock intacto y carrito intacto
    expect(window.alert).not.toHaveBeenCalled();
    expect(stockDe("TC001")).toBe(20);
    expect(stockDe("PI001")).toBe(20);
    expect(carritoGuardado()).toEqual(CARRITO_BASE);
  });

  it("sin sesión: después de iniciar sesión vuelve al carrito (volverA) con los mismos productos", async () => {
    renderCarrito();

    pagar();
    await screen.findByText(AVISO_COMPRA);
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "cliente@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "cliente123" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByRole("heading", { name: "Mi carrito de compras" })).toBeTruthy();
    expect(valorDe("Subtotal:")).toBe(String(SUBTOTAL_BASE));
  });

  it("con sesión: descuenta el stock comprado, vacía el carrito, avisa y vuelve al Home", async () => {
    // TC001 con 5 unidades y PI001 con 1: se compran 2 y 1 → quedan 3 y 0
    renderCarrito({ sesion: SESION, productosAdmin: catalogoCon({ TC001: 5, PI001: 1 }) });

    pagar();

    // 1) el stock baja según lo comprado; lo que no se compró no cambia
    expect(stockDe("TC001")).toBe(3);
    expect(stockDe("PI001")).toBe(0);
    expect(stockDe("TC002")).toBe(20);

    // 2) el carrito queda vacío
    expect(carritoGuardado()).toEqual([]);

    // 3) se avisó que la compra fue exitosa
    expect(window.alert).toHaveBeenCalledWith(MSG_EXITO);
    
    // 4) se llegó al Home: ya no está la página del carrito
    expect(await screen.findByRole("heading", { name: "Tienda Online" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Mi carrito de compras" })).toBeNull();
  });
});


// ===================================== 3. Botones (+) | (−) | (ELIMINAR) ===================================== 

describe("Carrito: botones + , − y eliminar", () => {
  it("el botón − baja una unidad cuando hay más de una", () => {
    renderCarrito();

    fireEvent.click(botonMenos(NOMBRE.TC001));   // TC001: 2 → 1

    expect(cantidadDe(NOMBRE.TC001)).toBe("1");
    expect(valorDe("Subtotal:")).toBe(String(SUBTOTAL_BASE - precio("TC001")));
    expect(carritoGuardado()).toEqual([{ id: "TC001", quantity: 1 }, { id: "PI001", quantity: 1 }]);
  });

  it("el botón − con 1 unidad quita la línea completa", () => {
    renderCarrito();

    fireEvent.click(botonMenos(NOMBRE.PI001));   // PI001 tenía 1 unidad

    expect(screen.queryByText(NOMBRE.PI001)).toBeNull();
    expect(screen.getByText(NOMBRE.TC001)).toBeTruthy();   // la otra línea sigue
    expect(carritoGuardado()).toEqual([{ id: "TC001", quantity: 2 }]);
  });

  it("el botón + suma una unidad", () => {
    renderCarrito();

    fireEvent.click(botonMas(NOMBRE.TC001));   // TC001: 2 → 3 (hay 20 en stock)

    expect(cantidadDe(NOMBRE.TC001)).toBe("3");
    expect(valorDe("Subtotal:")).toBe(String(SUBTOTAL_BASE + precio("TC001")));
  });

  it("el botón + se deshabilita al llegar al stock y ya no suma más", () => {
    renderCarrito({ productosAdmin: catalogoCon({ TC001: 3 }) });   // hay 3 y el carrito tiene 2

    expect(botonMas(NOMBRE.TC001).disabled).toBe(false);
    fireEvent.click(botonMas(NOMBRE.TC001));                        // 2 → 3 = el stock

    expect(cantidadDe(NOMBRE.TC001)).toBe("3");
    expect(botonMas(NOMBRE.TC001).disabled).toBe(true);

    fireEvent.click(botonMas(NOMBRE.TC001));                        // ya no sube
    expect(cantidadDe(NOMBRE.TC001)).toBe("3");
  });

  it("el botón + empieza deshabilitado si el carrito ya tiene todo el stock", () => {
    renderCarrito({ productosAdmin: catalogoCon({ TC001: 2 }) });   // hay 2 y el carrito tiene 2

    expect(botonMas(NOMBRE.TC001).disabled).toBe(true);
    expect(botonMas(NOMBRE.PI001).disabled).toBe(false);            // el otro producto sí puede subir
  });

  it("el botón eliminar quita solo esa línea y recalcula el subtotal", () => {
    renderCarrito();

    fireEvent.click(botonEliminar(NOMBRE.TC001));

    expect(screen.queryByText(NOMBRE.TC001)).toBeNull();
    expect(screen.getByText(NOMBRE.PI001)).toBeTruthy();
    expect(valorDe("Subtotal:")).toBe(String(precio("PI001")));
    expect(carritoGuardado()).toEqual([{ id: "PI001", quantity: 1 }]);
  });

  it("al eliminar la última línea aparece el mensaje de carrito vacío y el envío vuelve a $0", () => {
    renderCarrito({ carrito: [{ id: "PI001", quantity: 1 }] });

    fireEvent.click(botonEliminar(NOMBRE.PI001));

    expect(screen.getByText(MSG_VACIO)).toBeTruthy();
    expect(valorDe("Envío:")).toBe("0");
    expect(valorDe("TOTAL:")).toBe("0");
  });
});


// ===================================== 4. Ajuste del stock =====================================


describe("Carrito: al abrirlo se ajusta al stock del catálogo", () => {
  const casos = [
    { titulo: "si el stock bajó, recorta la cantidad al stock",
      catalogo: () => catalogoCon({ TC001: 1 }),
      esperado: [{ id: "TC001", quantity: 1 }, { id: "PI001", quantity: 1 }], quitados: [] },

    { titulo: "si el stock llegó a 0, quita la línea",
      catalogo: () => catalogoCon({ PI001: 0 }),
      esperado: [{ id: "TC001", quantity: 2 }], quitados: ["PI001"] },

    { titulo: "si el producto ya no existe en el catálogo, lo quita del carrito",
      catalogo: () => catalogoCon().filter((p) => p.id !== "PI001"),
      esperado: [{ id: "TC001", quantity: 2 }], quitados: ["PI001"] },
  ];

  it.each(casos)("$titulo", ({ catalogo, esperado, quitados }) => {
    renderCarrito({ productosAdmin: catalogo() });

    // lo que quedó guardado en el carrito (no solo lo que se ve en pantalla)
    expect(carritoGuardado()).toEqual(esperado);
    quitados.forEach((id) => expect(screen.queryByText(NOMBRE[id])).toBeNull());
  });

  it("recortado al stock, la pantalla muestra la cantidad ajustada", () => {
    renderCarrito({ productosAdmin: catalogoCon({ TC001: 1 }) });   // el carrito tenía 2

    expect(cantidadDe(NOMBRE.TC001)).toBe("1");
  });

  it("si el stock alcanza, no toca el carrito", () => {
    renderCarrito({ productosAdmin: catalogoCon() });               // 20 de cada uno

    expect(carritoGuardado()).toEqual(CARRITO_BASE);
    expect(cantidadDe(NOMBRE.TC001)).toBe("2");
  });
});
