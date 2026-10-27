import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerProductosAdmin, guardarProductosAdmin } from "../../datos/catalogoAdmin";
import usarTitulo from "../../usarTitulo";

export default function ProductosAdmin() {
  usarTitulo("Productos - Administrador");

  const [productos, setProductos] = useState(obtenerProductosAdmin);

  const eliminar = (id) => {
    if (confirm('¿Eliminar este producto?')) {
      const data = productos.filter((p) => p.id !== id);
      guardarProductosAdmin(data);
      setProductos(data);
    }
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-heading display-5 mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Nuevo producto
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted py-4">No hay productos registrados.</td></tr>
            )}
            {productos.map((p) => {
              const critico = p.stockCritico !== '' && p.stockCritico !== undefined && p.stock <= Number(p.stockCritico);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                  <td>{p.stock}</td>
                  <td>{critico ? 'Stock crítico' : 'Normal'}</td>
                  <td className="text-end">
                    <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-secondary"><i className="bi bi-pencil"></i></Link>
                    <button className="btn btn-sm btn-outline-secondary text-danger" onClick={() => eliminar(p.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
