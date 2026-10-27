import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useTienda } from "../contexto/Tienda";

const menu = [
  { ruta: "/", texto: "Home" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/blogs", texto: "Blogs" },
  { ruta: "/contacto", texto: "Contacto" },
];

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { totalItems, sesion, cerrarSesion } = useTienda();

  const salir = (event) => {
    event.preventDefault();
    cerrarSesion();
    navigate("/login");
  };

  return (
    <>
      <header>
        <div className="sub-nav text-end pe-4 py-1">
          {sesion && sesion.nombre ? (
            <>
              <span className="me-2 fw-bold text-dark">
                <i className="bi bi-person-circle me-1"></i>Hola, {sesion.nombre}
              </span> |
              <a href="#" id="btn-logout" className="ms-2 text-danger text-decoration-none" onClick={salir}>Cerrar sesión</a>
            </>
          ) : (
            <>
              <Link to="/login" className="text-decoration-none">Iniciar sesión</Link> | <Link to="/registro" className="text-decoration-none">Registrar usuario</Link>
            </>
          )}
        </div>

        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand font-heading" to="/">
              🧁 Pastelería Mil Sabores
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMilSabores" aria-controls="navbarMilSabores" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarMilSabores">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                {menu.map((m) => (
                  <li className="nav-item" key={m.ruta}>
                    <NavLink to={m.ruta} end={m.ruta === "/"}
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                      {m.texto}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="d-flex">
                <Link to="/carrito" className="btn btn-cart" id="carrito-btn">
                  <i className="bi bi-cart"></i> Carrito ({totalItems})
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <Footer conNewsletter={pathname === "/"} />
    </>
  );
}
