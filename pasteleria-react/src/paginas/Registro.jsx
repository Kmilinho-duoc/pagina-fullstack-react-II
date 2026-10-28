import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Campo from "../componentes/Campo";
import { regionesComunas } from "../datos/comunas";
import { guardarUsuariosAdmin } from "../datos/usuariosAdmin";
import { validarRun } from "../utilidades/validarRun";
import usarTitulo from "../usarTitulo";

const formVacio = {
  run: "", nombre: "", email: "", confirmarEmail: "", password: "",
  confirmarPassword: "", telefono: "", region: "", comuna: ""
};

export default function Registro() {
  usarTitulo("Registro - Pastelería Mil Sabores");

  const [form, setForm] = useState(formVacio);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm(name === "region" ? { ...form, region: value, comuna: "" } : { ...form, [name]: value });
  };

  const registrar = (event) => {
    event.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];
    const nuevos = {};

    // Validar RUN
    const runLimpio = form.run.trim().toUpperCase();
    if (runLimpio.length < 7 || runLimpio.length > 9 || !validarRun(runLimpio)) {
      nuevos.run = 'Ingresa un run válido (7 a 9 caracteres, sin puntos ni guion).';
    } else if (usuarios.some(u => u.run === runLimpio)) {
      nuevos.run = 'Ya existe una cuenta registrada con ese run.';
    }

    if (form.nombre.trim().length === 0) nuevos.nombre = true;

    // Normalizar correos a minúsculas
    const emailLimpio = form.email.trim().toLowerCase();
    const confirmarEmailLimpio = form.confirmarEmail.trim().toLowerCase();

    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!emailRegex.test(emailLimpio)) {
      nuevos.email = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    } else if (usuarios.some(u => (u.correo || u.email || '').toLowerCase() === emailLimpio)) {
      nuevos.email = "Ya existe una cuenta registrada con este correo.";
    }

    if (form.email !== form.confirmarEmail) nuevos.confirmarEmail = true;
    if (form.password.length < 4 || form.password.length > 10) nuevos.password = true;
    if (form.password !== form.confirmarPassword) nuevos.confirmarPassword = true;

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    guardarUsuariosAdmin([...usuarios, {
      run: runLimpio,
      nombre: form.nombre.trim(),
      apellidos: '',
      correo: emailLimpio,
      password: form.password,
      telefono: form.telefono.trim(),
      fechaNacimiento: '',
      tipo: 'Cliente',
      region: form.region,
      comuna: form.comuna,
      direccion: ''
    }]);

    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    navigate('/login', { state });
  };

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-lg-8 col-xl-6 mx-auto">
          <div className="card p-4 shadow-sm border-0">
            <div className="card-body">
              <div className="text-center mb-4">
                <h2 className="font-heading">Registro de usuario</h2>
              </div>

              <form noValidate onSubmit={registrar}>
                <Campo id="run" etiqueta="Run (sin puntos ni guion, ej: 19011022K)" type="text" minLength="7" maxLength="9" required
                  value={form.run} onChange={cambiar} error={errores.run}
                  mensaje="Ingresa un run válido (7 a 9 caracteres, sin puntos ni guion)." />

                <Campo id="nombre" etiqueta="Nombre Completo" type="text" required
                  value={form.nombre} onChange={cambiar} error={errores.nombre}
                  mensaje="Por favor, ingresa tu nombre." />

                <Campo id="email" etiqueta="Correo" type="email" required
                  value={form.email} onChange={cambiar} error={errores.email}
                  mensaje="Por favor, ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)." />

                <Campo id="confirmarEmail" etiqueta="Confirmar Correo" type="email" required
                  value={form.confirmarEmail} onChange={cambiar} error={errores.confirmarEmail}
                  mensaje="Los correos no coinciden." />

                <Campo id="password" etiqueta="Contraseña" type="password" required
                  value={form.password} onChange={cambiar} error={errores.password}
                  mensaje="La contraseña debe tener entre 4 y 10 caracteres." />

                <Campo id="confirmarPassword" etiqueta="Confirmar Contraseña" type="password" required
                  value={form.confirmarPassword} onChange={cambiar} error={errores.confirmarPassword}
                  mensaje="Las contraseñas no coinciden." />

                <Campo id="telefono" etiqueta="Teléfono (opcional)" type="tel"
                  value={form.telefono} onChange={cambiar} />

                <div className="row">
                  <Campo id="region" etiqueta="Región" componente="select" clase="col-md-6 mb-3" required
                    value={form.region} onChange={cambiar} mensaje="Por favor, selecciona una región.">
                    <option value="" disabled>Seleccione la región...</option>
                    {Object.keys(regionesComunas).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Campo>

                  <Campo id="comuna" etiqueta="Comuna" componente="select" clase="col-md-6 mb-3" required
                    disabled={!form.region} value={form.comuna} onChange={cambiar}
                    mensaje="Por favor, selecciona una comuna.">
                    <option value="" disabled>Seleccione la comuna...</option>
                    {(regionesComunas[form.region] || []).map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </Campo>
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">Registrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}