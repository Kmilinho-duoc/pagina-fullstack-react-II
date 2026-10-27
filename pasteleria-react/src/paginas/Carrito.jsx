import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProductosAdmin, guardarProductosAdmin } from "../datos/catalogoAdmin";
import { useTienda } from "../contexto/Tienda";
import usarTitulo from "../usarTitulo";

const costoEnvio = 3500;

// { idProducto: stock } a partir del catálogo del administrador
const stocksDe = (lista) => Object.fromEntries(lista.map((p) => [p.id, Number(p.stock)]));

export default function Carrito() {
  usarTitulo("Mi Carrito - Pastelería Mil Sabores");

  const { carrito, dispatch, agregarAlCarrito, sesion } = useTienda();
  const navigate = useNavigate();

  // Catálogo administrado (localStorage): el carrito muestra siempre los precios vigentes.
  const listaProductos = obtenerProductosAdmin();

  // Si el stock bajó desde que agregaste los productos, el carrito se ajusta al stock disponible.
  useEffect(() => {
    dispatch({ tipo: "ajustar", stocks: stocksDe(listaProductos) });
  }, []);

  // Cada línea del carrito junto con los datos de su producto (si el producto ya no existe, se omite)
  const lineas = carrito
    .map((item) => ({ item, producto: listaProductos.find((p) => p.id === item.id) }))
    .filter((l) => l.producto);

  const subtotal = lineas.reduce((suma, l) => suma + l.producto.precio * l.item.quantity, 0);
  // Si el carrito está vacío, no tiene sentido cobrar el envío.
  const envio = carrito.length === 0 ? 0 : costoEnvio;

  const pagar = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Para comprar hay que haber iniciado sesión; después del login se vuelve al carrito.
    if (!sesion) {
      navigate("/login", { state: { aviso: "Debes iniciar sesión para realizar tu compra.", volverA: "/carrito" } });
      return;
    }

    // El stock pudo cambiar mientras tenías el carrito abierto: se revisa antes de cobrar.
    const catalogo = obtenerProductosAdmin();
    const stocks = stocksDe(catalogo);
    if (carrito.some((item) => item.quantity > (stocks[item.id] || 0))) {
      dispatch({ tipo: "ajustar", stocks });
      alert("Algunos productos ya no tienen stock suficiente. Ajustamos tu carrito.");
      return;
    }

    // Se descuenta del stock lo que se compró.
    guardarProductosAdmin(catalogo.map((p) => {
      const linea = carrito.find((item) => item.id === p.id);
      return linea ? { ...p, stock: Number(p.stock) - linea.quantity } : p;
    }));

    alert("¡Compra realizada con éxito! Gracias por tu compra en Pastelería Mil Sabores.");
    dispatch({ tipo: "vaciar" });
    navigate("/");
  };

  return (
    <main className="container my-5">
      <h1 className="font-heading display-4 mb-4">Mi carrito de compras</h1>

      <div className="row">

        <div className="col-lg-8">
          <div id="carrito-items-container">
            {carrito.length === 0 && <p>Tu carrito está vacío.</p>}

            {lineas.map(({ item, producto }) => (
              <div className="card mb-3 shadow-sm border-0" key={item.id}>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <img src={producto.imagen} className="img-fluid rounded" alt={producto.nombre}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                    </div>
                    <div className="col-md-4">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text text-muted">{producto.categoria}</p>
                    </div>
                    <div className="col-md-3 d-flex align-items-center justify-content-center">
                      <button className="btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch({ tipo: "disminuir", id: producto.id })}>-</button>
                      <input type="text" className="form-control text-center mx-2" value={item.quantity} readOnly
                        style={{ width: "60px" }} />
                      <button className="btn btn-outline-secondary btn-sm"
                        disabled={item.quantity >= Number(producto.stock)}
                        onClick={() => agregarAlCarrito(producto.id, 1)}>+</button>
                    </div>
                    <div className="col-md-2 d-flex align-items-center justify-content-end">
                      <span className="fs-5 price-text">${(producto.precio * item.quantity).toLocaleString("es-CL")}</span>
                    </div>
                    <div className="col-md-1 d-flex align-items-center justify-content-end">
                      <button className="btn btn-outline-danger btn-sm"
                        onClick={() => dispatch({ tipo: "eliminar", id: producto.id })}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0" style={{ backgroundColor: "#faf6f0" }}>
            <div className="card-body">
              <h4 className="mb-3">Resumen del Pedido</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Envío:</span>
                <span>${envio.toLocaleString("es-CL")}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-4 fw-bold">
                <span>TOTAL:</span>
                <span>${(subtotal + envio).toLocaleString("es-CL")}</span>
              </div>

              <div className="my-4">
                <label htmlFor="cupon" className="form-label">Cupón de descuento:</label>
                <div className="input-group">
                  <input type="text" className="form-control" id="cupon" placeholder="Ingrese el cupón" />
                  <button className="btn btn-secondary">APLICAR</button>
                </div>
              </div>

              <div className="d-grid">
                <button type="button" className="btn btn-primary btn-lg" onClick={pagar}>PAGAR</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
