import { Link, Navigate, useParams } from "react-router-dom";
import { blogs } from "../datos/blogs";
import usarTitulo from "../usarTitulo";

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));   // el parámetro llega como texto

  usarTitulo(blog ? `${blog.titulo} - Blog` : "Blogs - Pastelería Mil Sabores");

  if (!blog) return <Navigate to="/blogs" replace />;

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="font-heading display-4 mb-3">{blog.titulo}</h1>
          <p className="text-muted">Publicado el {blog.fecha}</p>

          <img src={blog.imagen} className="imagen-cuadrada rounded" alt={blog.titulo} />

          <h3 className="mt-4">{blog.subtitulo}</h3>
          {blog.parrafos.map((texto, i) => (
            <p key={i} className={i === 0 ? "fs-5" : undefined}>{texto}</p>
          ))}

          <Link to="/blogs" className="btn btn-outline-primary mt-4">
            <i className="bi bi-arrow-left"></i> Volver a Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}
