import { Link } from "react-router-dom";
import { blogs } from "../datos/blogs";
import usarTitulo from "../usarTitulo";

export default function Blogs() {
  usarTitulo("Blogs - Pastelería Mil Sabores");

  return (
    <main className="container my-5">
      <h1 className="text-center font-heading display-4 mb-5">Noticias Importantes</h1>

      <div className="col-lg-10 mx-auto">
        {blogs.map((b) => (
          <div className="card shadow-sm border-0 mb-4" key={b.id}>
            <div className="row g-0 align-items-center">
              <div className="col-lg-7">
                <div className="card-body p-4">
                  <h3 className="font-heading">{b.titulo}</h3>
                  <p className="card-text">{b.resumen}</p>
                  <Link to={`/blogs/${b.id}`} className="btn btn-primary">Ver Caso</Link>
                </div>
              </div>
              <div className="col-lg-5">
                <img src={b.imagen} className="img-fluid rounded-end" alt={b.titulo}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
