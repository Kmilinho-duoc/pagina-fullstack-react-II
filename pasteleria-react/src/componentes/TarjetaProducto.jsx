import { Link } from "react-router-dom";

// Tarjeta del catálogo: mismo HTML que generaba productos.js
// disponible = unidades que todavía se pueden añadir al carrito (stock menos lo que ya hay en el carrito)
export default function TarjetaProducto({ producto, disponible, onAgregar }) {
  const agregar = (event) => {
    event.preventDefault();      // no navegar al detalle
    event.stopPropagation();
    onAgregar(producto.id);
  };

  return (
    <div className="col">
      <Link to={`/productos/${producto.id}`} className="card-link">
        <div className="card h-100">
          <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />

          <div className="card-body">
            <h5 className="card-title">{producto.nombre}</h5>
            {Number(producto.stock) <= 0 && <span className="badge text-bg-secondary">Agotado</span>}
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="price-text">${producto.precio.toLocaleString("es-CL")} CLP</span>

            <button className="btn btn-primary btn-add-cart" onClick={agregar} disabled={disponible <= 0}>
              <i className="bi bi-cart-plus"></i>
              <span className="visually-hidden">Añadir al carrito</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
