import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { obtenerProductosAdmin } from "../datos/catalogoAdmin";

/* Estado compartido por toda la app: carrito y sesión.
   Los datos se guardan en localStorage con las mismas claves del proyecto original:
   "carrito" (arreglo de { id, quantity }) y "sesionActual" ({ correo, nombre, rol }). */

function carritoReducer(carrito, accion) {
  switch (accion.tipo) {
    case "agregar": {
      const existe = carrito.some((item) => item.id === accion.id);
      return existe
        ? carrito.map((item) =>
            item.id === accion.id ? { ...item, quantity: item.quantity + accion.cantidad } : item
          )
        : [...carrito, { id: accion.id, quantity: accion.cantidad }];
    }
    case "disminuir":
      // con 1 unidad, disminuir equivale a quitar el producto
      return carrito.flatMap((item) => {
        if (item.id !== accion.id) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      });
    case "eliminar":
      return carrito.filter((item) => item.id !== accion.id);
    case "ajustar":
      // recorta cada línea al stock disponible; si el stock es 0 (o el producto ya no existe) la quita
      return carrito.flatMap((item) => {
        const stock = accion.stocks[item.id] || 0;
        return stock > 0 ? [{ ...item, quantity: Math.min(item.quantity, stock) }] : [];
      });
    case "vaciar":
      return [];
    default:
      return carrito;
  }
}

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [carrito, dispatch] = useReducer(
    carritoReducer,
    null,
    () => JSON.parse(localStorage.getItem("carrito")) || []
  );
  const [sesion, setSesion] = useState(() => JSON.parse(localStorage.getItem("sesionActual")));

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);   // dato derivado

  const cantidadEnCarrito = (id) => {
    const linea = carrito.find((item) => item.id === id);
    return linea ? linea.quantity : 0;
  };

  // Nunca deja más unidades en el carrito que el stock del producto.
  // Devuelve cuántas unidades se agregaron realmente (0 si ya no queda stock).
  const agregarAlCarrito = (id, cantidad = 1) => {
    const producto = obtenerProductosAdmin().find((p) => p.id === id);
    const stock = producto ? Number(producto.stock) : 0;
    const agregables = Math.min(cantidad, stock - cantidadEnCarrito(id));
    if (agregables <= 0) return 0;
    dispatch({ tipo: "agregar", id, cantidad: agregables });
    return agregables;
  };

  const iniciarSesion = (datos) => {
    localStorage.setItem("sesionActual", JSON.stringify(datos));
    setSesion(datos);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("sesionActual");
    setSesion(null);
  };

  return (
    <TiendaContext.Provider
      value={{ carrito, dispatch, totalItems, agregarAlCarrito, cantidadEnCarrito, sesion, iniciarSesion, cerrarSesion }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

export const useTienda = () => useContext(TiendaContext);
