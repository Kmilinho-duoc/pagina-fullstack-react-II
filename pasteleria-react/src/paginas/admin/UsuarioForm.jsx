import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Campo from "../../componentes/Campo";
import { regionesComunas } from "../../datos/comunas";
import { obtenerUsuariosAdmin, guardarUsuariosAdmin } from "../../datos/usuariosAdmin";
import { validarRun } from "../../utilidades/validarRun";
import usarTitulo from "../../usarTitulo";

const formVacio = {
  run: "", nombre: "", apellidos: "", correo: "", password: "", fechaNacimiento: "",
  tipo: "", region: "", comuna: "", direccion: ""
};

export default function UsuarioForm() {
  usarTitulo("Usuario - Administrador");

  const { run: runEditar } = useParams();        // si hay run en la URL, se edita; si no, se crea
  const navigate = useNavigate();
  const usuarioActual = runEditar ? obtenerUsuariosAdmin().find((u) => u.run === runEditar) : null;

  const [form, setForm] = useState(() =>
    usuarioActual
      ? {
          run: usuarioActual.run,
          nombre: usuarioActual.nombre,
          apellidos: usuarioActual.apellidos,
          correo: usuarioActual.correo,
          password: usuarioActual.password || '',
          fechaNacimiento: usuarioActual.fechaNacimiento || '',
          tipo: usuarioActual.tipo,
          region: usuarioActual.region || '',
          comuna: usuarioActual.comuna || '',
          direccion: usuarioActual.direccion || ''
        }
      : formVacio
  );
  const [errores, setErrores] = useState({});

  if (runEditar && !usuarioActual) return <Navigate to="/admin/usuarios" replace />;

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm(name === "region" ? { ...form, region: value, comuna: "" } : { ...form, [name]: value });
  };

  const guardar = (event) => {
    event.preventDefault();

    const data = obtenerUsuariosAdmin();
    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    const nuevos = {};

    // Run: requerido, válido, sin puntos ni guion, min 7 max 9
    const runLimpio = form.run.trim().toUpperCase();
    if (runLimpio.length < 7 || runLimpio.length > 9 || !validarRun(runLimpio)) {
      nuevos.run = true;
    } else if (!runEditar && data.some(u => u.run === runLimpio)) {
      nuevos.run = 'Ya existe un usuario con ese RUN.';
    }

    // Nombre: requerido, max 50
    if (form.nombre.trim().length === 0 || form.nombre.length > 50) nuevos.nombre = true;

    // Apellidos: requerido, max 100
    if (form.apellidos.trim().length === 0 || form.apellidos.length > 100) nuevos.apellidos = true;

    // Correo: requerido, max 100, dominio permitido
    if (form.correo.length === 0 || form.correo.length > 100 || !emailRegex.test(form.correo)) nuevos.correo = true;

    // Contraseña: requerida, entre 4 y 10 caracteres
    if (form.password.length < 4 || form.password.length > 10) nuevos.password = true;

    // Tipo de usuario: requerido
    if (!form.tipo) nuevos.tipo = true;

    // Dirección: requerida, max 300
    if (form.direccion.trim().length === 0 || form.direccion.length > 300) nuevos.direccion = true;

    // Región / Comuna: requeridas
    if (!form.region) nuevos.region = true;
    if (!form.comuna) nuevos.comuna = true;

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const nuevoUsuario = {
      run: runEditar ? usuarioActual.run : runLimpio,
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
      tipo: form.tipo,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim()
    };

    guardarUsuariosAdmin(
      runEditar
        ? data.map((u) => (u.run === runEditar ? nuevoUsuario : u))
        : [...data, nuevoUsuario]
    );
    alert(runEditar ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
    navigate('/admin/usuarios');
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-heading display-5 mb-0">{runEditar ? 'Editar usuario' : 'Nuevo usuario'}</h1>
        <Link to="/admin/usuarios" className="btn btn-cart"><i className="bi bi-arrow-left"></i> Volver</Link>
      </div>

      <div className="card" style={{ maxWidth: "760px" }}>
        <div className="card-body">
          <form noValidate onSubmit={guardar}>

            <Campo id="run" etiqueta="Run (sin puntos ni guion, ej: 19011022K)" type="text" minLength="7" maxLength="9" required readOnly={!!runEditar}
              value={form.run} onChange={cambiar} error={errores.run}
              mensaje="Ingresa un run válido (7 a 9 caracteres, sin puntos ni guion)." />

            <div className="row">
              <Campo id="nombre" etiqueta="Nombre" type="text" maxLength="50" required clase="col-md-6 mb-3"
                value={form.nombre} onChange={cambiar} error={errores.nombre}
                mensaje="El nombre es requerido (máximo 50 caracteres)." />

              <Campo id="apellidos" etiqueta="Apellidos" type="text" maxLength="100" required clase="col-md-6 mb-3"
                value={form.apellidos} onChange={cambiar} error={errores.apellidos}
                mensaje="Los apellidos son requeridos (máximo 100 caracteres)." />
            </div>

            <Campo id="correo" etiqueta="Correo" type="email" maxLength="100" required
              value={form.correo} onChange={cambiar} error={errores.correo}
              mensaje="Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com." />

            <Campo id="password" etiqueta="Contraseña" type="password" minLength="4" maxLength="10" required
              value={form.password} onChange={cambiar} error={errores.password}
              mensaje="La contraseña debe tener entre 4 y 10 caracteres." />

            <div className="row">
              <Campo id="fechaNacimiento" etiqueta="Fecha de nacimiento (opcional)" type="date" clase="col-md-6 mb-3"
                value={form.fechaNacimiento} onChange={cambiar} />

              <Campo id="tipo" etiqueta="Tipo de usuario" componente="select" required clase="col-md-6 mb-3"
                value={form.tipo} onChange={cambiar} error={errores.tipo}
                mensaje="Selecciona un tipo de usuario.">
                <option value="" disabled>Seleccione el perfil...</option>
                <option value="Administrador">Administrador</option>
                <option value="Cliente">Cliente</option>
              </Campo>
            </div>

            <div className="row">
              <Campo id="region" etiqueta="Región" componente="select" required clase="col-md-6 mb-3"
                value={form.region} onChange={cambiar} error={errores.region}
                mensaje="Selecciona una región.">
                <option value="" disabled>Seleccione la región...</option>
                {Object.keys(regionesComunas).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </Campo>

              <Campo id="comuna" etiqueta="Comuna" componente="select" required clase="col-md-6 mb-3"
                disabled={!form.region} value={form.comuna} onChange={cambiar} error={errores.comuna}
                mensaje="Selecciona una comuna.">
                <option value="" disabled>Seleccione la comuna...</option>
                {(regionesComunas[form.region] || []).map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </Campo>
            </div>

            <Campo id="direccion" etiqueta="Dirección" type="text" maxLength="300" required
              value={form.direccion} onChange={cambiar} error={errores.direccion}
              mensaje="La dirección es requerida (máximo 300 caracteres)." />

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">Guardar</button>
              <Link to="/admin/usuarios" className="btn btn-cart">Cancelar</Link>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
