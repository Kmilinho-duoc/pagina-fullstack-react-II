import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useTienda } from "../contexto/Tienda";

const menu = [
  { ruta: "/admin", texto: "Dashboard" },
  { ruta: "/admin/productos", texto: "Productos" },
  { ruta: "/admin/usuarios", texto: "Usuarios" },
];

export default function LayoutAdmin() {
  const { sesion, cerrarSesion } = useTienda();
  const navigate = useNavigate();

  // Equivale a Js/admin-auth.js: solo entra quien tiene sesión de administrador.
  const permitido = sesion && sesion.rol === "administrador";

  const salir = () => {
    navigate("/login");
    cerrarSesion();
  };

  if (!permitido) {
    return <Navigate to="/login" replace
      state={{ aviso: "Debes iniciar sesión como Administrador para acceder a esta sección." }} />;
  }

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand font-heading" to="/">🧁 Pastelería Mil Sabores</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarAdmin">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarAdmin">
              <ul className="navbar-nav admin-nav mx-auto mb-2 mb-lg-0">
                {menu.map((m) => (
                  <li className="nav-item" key={m.ruta}>
                    <NavLink to={m.ruta} end={m.ruta === "/admin"}
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                      {m.texto}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="d-flex align-items-center gap-3">
                <span>Hola, <strong>{sesion.nombre}</strong></span>
                <button className="btn btn-cart" onClick={salir}>Cerrar sesión</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <Footer conNewsletter={false} />
    </>
  );
}
