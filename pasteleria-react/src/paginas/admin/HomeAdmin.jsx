import { Link } from "react-router-dom";
import usarTitulo from "../../usarTitulo";

export default function HomeAdmin() {
  usarTitulo("Administrador - Pastelería Mil Sabores");

  return (
    <main className="container my-5">
      <h1 className="font-heading display-5 mb-2">¡Hola, Administrador!</h1>
      <p className="mb-4">Desde aquí puedes gestionar los productos y usuarios de la tienda.</p>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <p className="card-text">Revisa, crea y edita el catálogo de productos de la tienda.</p>
              <Link to="/admin/productos" className="btn btn-primary">Ver productos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text">Revisa, crea y edita los usuarios registrados en el sistema.</p>
              <Link to="/admin/usuarios" className="btn btn-primary">Ver usuarios</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
