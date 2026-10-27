import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Campo from "../componentes/Campo";
import { useTienda } from "../contexto/Tienda";
import usarTitulo from "../usarTitulo";

// Usuarios de prueba para probar el sistema
const usuariosPrueba = [
  { correo: 'admin@duoc.cl', password: 'admin123', nombre: 'Admin Sistema', rol: 'administrador' },
  { correo: 'cliente@gmail.com', password: 'cliente123', nombre: 'Cliente Demo', rol: 'cliente' }
];

export default function Login() {
  usarTitulo("Iniciar Sesión - Pastelería Mil Sabores");

  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const { iniciarSesion } = useTienda();
  const navigate = useNavigate();
  const { state } = useLocation();   // trae el aviso cuando te redirigen desde /admin

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ingresar = (event) => {
    event.preventDefault();

    const nuevos = {};

    // Validar Correo
    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (form.email.length === 0) {
      nuevos.email = "El correo es requerido.";
    } else if (form.email.length > 100) {
      nuevos.email = "El correo no puede exceder los 100 caracteres.";
    } else if (!emailRegex.test(form.email.toLowerCase())) {
      nuevos.email = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }

    // Validar Contraseña
    if (form.password.length === 0) {
      nuevos.password = "La contraseña es requerida.";
    } else if (form.password.length < 4 || form.password.length > 10) {
      nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    setErrores(nuevos);
    const esValido = Object.keys(nuevos).length === 0;
    if (!esValido) return;

    const correoIngresado = form.email.trim().toLowerCase();
    const passwordIngresada = form.password.trim();

    // Cargar usuarios desde las posibles claves en localStorage ('usuarios' y 'usuariosAdmin')
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuariosAdminGuardados = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];

    const todosLosGuardados = [...usuariosGuardados, ...usuariosAdminGuardados];

    // Buscar primero en los de prueba, luego en los guardados en localStorage
    const usuario = usuariosPrueba.find(u => u.correo.toLowerCase() === correoIngresado && u.password === passwordIngresada) ||
      todosLosGuardados.find(u => {
        const correoUser = (u.correo || u.email || '').toLowerCase();
        return correoUser === correoIngresado && u.password === passwordIngresada;
      });

    if (!usuario) {
      setErrores({ email: true, password: true });
      alert('Correo o contraseña incorrectos.');
      return;
    }

    const rol = (usuario.rol || usuario.tipo || 'cliente').toLowerCase();

    // Guardar datos de sesión activa
    iniciarSesion({
      correo: usuario.correo || usuario.email,
      nombre: usuario.nombre || 'Cliente',
      rol: rol
    });

    // Redirección según el rol
    if (rol === 'administrador') {
      alert('¡Inicio de sesión exitoso! Ingresando al panel de administración.');
      navigate('/admin');
    } else {
      alert('¡Inicio de sesión exitoso!');
      navigate(state && state.volverA ? state.volverA : '/');
    }
  };

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">

          <div className="card p-4 shadow-sm border-0">
            <div className="card-body">

              <div className="text-center mb-4">
                <div className="login-logo-placeholder mb-3">
                  <i className="bi bi-cupcake-fill display-1" style={{ color: "var(--color-acento-2)" }}></i>
                </div>
                <h2 className="font-heading">Pastelería Mil Sabores</h2>
                <p className="text-muted">Inicia sesión en tu cuenta</p>
              </div>

              {state && state.aviso && <div className="alert alert-warning small mb-4">{state.aviso}</div>}

              <div className="alert alert-secondary small mb-4">
                <strong>Sesiones de prueba:</strong><br />
                Cliente: <code>cliente@gmail.com</code> / <code>cliente123</code><br />
                Administrador: <code>admin@duoc.cl</code> / <code>admin123</code>
              </div>

              <form noValidate onSubmit={ingresar}>

                <Campo id="email" etiqueta="Correo" type="email" required
                  value={form.email} onChange={cambiar}
                  error={errores.email} mensaje="Por favor, ingresa un correo válido." />

                <Campo id="password" etiqueta="Contraseña" type="password" required
                  value={form.password} onChange={cambiar}
                  error={errores.password} mensaje="Por favor, ingresa tu contraseña." />

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">Iniciar sesión</button>
                </div>

                <div className="text-center mt-3">
                  <Link to="/registro" state={state} className="link-secondary">¿No tienes cuenta? Regístrate aquí</Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
