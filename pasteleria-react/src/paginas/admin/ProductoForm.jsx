import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Campo from "../../componentes/Campo";
import { obtenerProductosAdmin, guardarProductosAdmin, obtenerCategorias } from "../../datos/catalogoAdmin";
import usarTitulo from "../../usarTitulo";

const formVacio = {
  codigo: "", nombre: "", descripcion: "", precio: "", stock: "",
  stockCritico: "", categoria: "", imagen: ""
};

export default function ProductoForm() {
  usarTitulo("Producto - Administrador");

  const { id: idEditar } = useParams();          // si hay id en la URL, se edita; si no, se crea
  const navigate = useNavigate();
  const productoActual = idEditar ? obtenerProductosAdmin().find((p) => p.id === idEditar) : null;

  const [form, setForm] = useState(() =>
    productoActual
      ? {
          codigo: productoActual.id,
          nombre: productoActual.nombre,
          descripcion: productoActual.descripcion || '',
          precio: productoActual.precio,
          stock: productoActual.stock,
          stockCritico: productoActual.stockCritico,
          categoria: productoActual.categoria,
          imagen: productoActual.imagen || ''
        }
      : formVacio
  );
  const [errores, setErrores] = useState({});

  if (idEditar && !productoActual) return <Navigate to="/admin/productos" replace />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = (event) => {
    event.preventDefault();

    const data = obtenerProductosAdmin();
    const nuevos = {};

    // Código: requerido, texto, min 3, sin límite máximo
    if (form.codigo.trim().length < 3) {
      nuevos.codigo = true;
    } else if (!idEditar && data.some(p => p.id.toLowerCase() === form.codigo.trim().toLowerCase())) {
      nuevos.codigo = 'Ya existe un producto con ese código.';
    }

    // Nombre: requerido, max 100
    if (form.nombre.trim().length === 0 || form.nombre.length > 100) nuevos.nombre = true;

    // Descripción: opcional, max 500
    if (form.descripcion.length > 500) nuevos.descripcion = true;

    // Precio: requerido, min 0, decimales permitidos
    if (form.precio === '' || Number(form.precio) < 0) nuevos.precio = true;

    // Stock: requerido, min 0, solo enteros
    if (form.stock === '' || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) nuevos.stock = true;

    // Stock crítico: opcional, min 0, solo enteros
    if (form.stockCritico !== '' && (Number(form.stockCritico) < 0 || !Number.isInteger(Number(form.stockCritico)))) {
      nuevos.stockCritico = true;
    }

    // Categoría: requerida
    if (!form.categoria) nuevos.categoria = true;

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const nuevoProducto = {
      id: idEditar ? productoActual.id : form.codigo.trim(),
      categoria: form.categoria,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
      stockCritico: form.stockCritico !== '' ? parseInt(form.stockCritico, 10) : '',
      imagen: form.imagen.trim()
    };

    guardarProductosAdmin(
      idEditar
        ? data.map((p) => (p.id === idEditar ? nuevoProducto : p))
        : [...data, nuevoProducto]
    );
    alert(idEditar ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
    navigate('/admin/productos');
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-heading display-5 mb-0">{idEditar ? 'Editar producto' : 'Nuevo producto'}</h1>
        <Link to="/admin/productos" className="btn btn-cart"><i className="bi bi-arrow-left"></i> Volver</Link>
      </div>

      <div className="card" style={{ maxWidth: "720px" }}>
        <div className="card-body">
          <form noValidate onSubmit={guardar}>

            <Campo id="codigo" etiqueta="Código de producto" type="text" minLength="3" required readOnly={!!idEditar}
              value={form.codigo} onChange={cambiar} error={errores.codigo}
              mensaje="El código es requerido (mínimo 3 caracteres)." />

            <Campo id="nombre" etiqueta="Nombre" type="text" maxLength="100" required
              value={form.nombre} onChange={cambiar} error={errores.nombre}
              mensaje="El nombre es requerido (máximo 100 caracteres)." />

            <Campo id="descripcion" etiqueta="Descripción (opcional)" componente="textarea" rows="3" maxLength="500"
              value={form.descripcion} onChange={cambiar} error={errores.descripcion}
              mensaje="La descripción no puede superar los 500 caracteres." />

            <div className="row">
              <Campo id="precio" etiqueta="Precio (CLP)" type="number" min="0" step="0.01" required clase="col-md-4 mb-3"
                value={form.precio} onChange={cambiar} error={errores.precio}
                mensaje="Ingresa un precio válido (mínimo 0)." />

              <Campo id="stock" etiqueta="Stock" type="number" min="0" step="1" required clase="col-md-4 mb-3"
                value={form.stock} onChange={cambiar} error={errores.stock}
                mensaje="Ingresa un stock válido (entero, mínimo 0)." />

              <Campo id="stockCritico" etiqueta="Stock crítico (opcional)" type="number" min="0" step="1" clase="col-md-4 mb-3"
                value={form.stockCritico} onChange={cambiar} error={errores.stockCritico}
                mensaje="Debe ser un número entero mayor o igual a 0." />
            </div>

            <Campo id="categoria" etiqueta="Categoría" componente="select" required
              value={form.categoria} onChange={cambiar} error={errores.categoria}
              mensaje="Selecciona una categoría.">
              <option value="" disabled>Seleccione la categoría...</option>
              {obtenerCategorias().map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Campo>

            <Campo id="imagen" etiqueta="Imagen (URL o ruta, opcional)" type="text" placeholder="/Assets/mi-producto.jpg"
              value={form.imagen} onChange={cambiar} />

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">Guardar</button>
              <Link to="/admin/productos" className="btn btn-cart">Cancelar</Link>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
