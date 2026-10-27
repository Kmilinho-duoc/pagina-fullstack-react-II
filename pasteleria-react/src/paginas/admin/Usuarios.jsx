import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerUsuariosAdmin, guardarUsuariosAdmin } from "../../datos/usuariosAdmin";
import usarTitulo from "../../usarTitulo";

export default function Usuarios() {
  usarTitulo("Usuarios - Administrador");

  const [usuarios, setUsuarios] = useState(obtenerUsuariosAdmin);

  const eliminar = (run) => {
    if (confirm('¿Eliminar este usuario?')) {
      const data = usuarios.filter((u) => u.run !== run);
      guardarUsuariosAdmin(data);
      setUsuarios(data);
    }
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-heading display-5 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          <i className="bi bi-person-plus"></i> Nuevo usuario
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Run</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Comuna</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted py-4">No hay usuarios registrados.</td></tr>
            )}
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.tipo}</td>
                <td>{u.comuna || '-'}</td>
                <td className="text-end">
                  <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-secondary"><i className="bi bi-pencil"></i></Link>
                  <button className="btn btn-sm btn-outline-secondary text-danger" onClick={() => eliminar(u.run)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
