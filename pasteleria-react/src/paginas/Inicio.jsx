import { Link } from "react-router-dom";
import { obtenerProductosAdmin } from "../datos/catalogoAdmin";
import usarTitulo from "../usarTitulo";

export default function Inicio() {
  usarTitulo("Pastelería Mil Sabores - Inicio");

  return (
    <main className="container my-5">
      <section className="hero-section row align-items-center">
        <div className="col-lg-6">
          <h1 className="font-heading display-4">Tienda Online</h1>
          <p className="fs-5">Famosos por nuestra participación en el récord Guinness de 1999, celebramos 50 años de tradición. Descubre nuestras delicias y vive una experiencia dulce y memorable.</p>
          <Link to="/productos" className="btn btn-primary btn-lg">Ver productos</Link>
        </div>
        <div className="col-lg-6 mt-4 mt-lg-0">
          <img src="/Assets/Torta Circular de Manjar.jpg" />
        </div>
      </section>

      <section className="productos-section mt-5 pt-5">
        <h2 className="text-center font-heading mb-4">Nuestras Delicias</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {obtenerProductosAdmin().slice(0, 4).map((p) => (
            <div className="col" key={p.id}>
              <div className="card h-100">
                <img src={p.imagen} className="card-img-top" alt={p.nombre} />
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                </div>
                <div className="card-footer">
                  <span className="price-text">${p.precio.toLocaleString("es-CL")} CLP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
