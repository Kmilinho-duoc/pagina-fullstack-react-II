import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductosAdmin } from "../datos/catalogoAdmin";
import { useTienda } from "../contexto/Tienda";
import usarTitulo from "../usarTitulo";

export default function DetalleProducto() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito, cantidadEnCarrito } = useTienda();

  // Catálogo administrado (localStorage): refleja precios y productos que edita el administrador.
  const producto = obtenerProductosAdmin().find((p) => p.id === id);

  usarTitulo(producto ? `${producto.nombre} - Pastelería Mil Sabores` : "Producto - Pastelería Mil Sabores");

  const anadir = () => {
    const n = parseInt(cantidad, 10);
    if (n > 0 && agregarAlCarrito(producto.id, n) > 0) {
      alert("Producto(s) añadido(s) al carrito");
    }
  };

  if (!producto) {
    return (
      <main className="container my-5" id="detalle-producto-container">
        <h1 className="text-center">Producto no encontrado</h1>
      </main>
    );
  }

  const stock = Number(producto.stock);
  const enCarrito = cantidadEnCarrito(producto.id);
  const disponible = stock - enCarrito;   // unidades que todavía se pueden añadir

  return (
    <main className="container my-5" id="detalle-producto-container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-7">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>

        <div className="col-lg-5">
          <h1>{producto.nombre}</h1>
          <h2 className="price-text display-6 my-3">${producto.precio.toLocaleString("es-CL")} CLP</h2>
          <p className="fs-5">{producto.descripcion}</p>
          <p className="text-muted mb-0">
            {stock > 0 ? `Stock disponible: ${stock} ${stock === 1 ? "unidad" : "unidades"}` : "Agotado"}
            {enCarrito > 0 && ` (${enCarrito} en tu carrito)`}
          </p>
          <div className="d-flex align-items-center my-4">
            <label htmlFor="cantidad" className="form-label me-3 fs-5">Cantidad:</label>
            <input type="number" className="form-control" id="cantidad" min="1" max={disponible} disabled={disponible <= 0} style={{ width: "100px" }}
              value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-lg" onClick={anadir} disabled={disponible <= 0}>
            <i className="bi bi-cart-plus"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
