import { useState } from "react";
import Campo from "../componentes/Campo";
import { validarContacto } from "../utilidades/validarContacto";
import usarTitulo from "../usarTitulo";

const formVacio = { nombre: "", email: "", numerot: "", comentario: "" };

export default function Contacto() {
  usarTitulo("Contacto - Pastelería Mil Sabores");

  const [form, setForm] = useState(formVacio);
  const [enviado, setEnviado] = useState(false);
  const [tocado, setTocado] = useState(false);   // el original valida desde el primer input / blur / envío

  // Dato derivado: los errores se calculan a partir del formulario, no se guardan en estado.
  const errores = tocado ? validarContacto(form) : {};

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTocado(true);
    setEnviado(false);
  };

  const enviar = (event) => {
    event.preventDefault();
    if (Object.keys(validarContacto(form)).length > 0) {
      setTocado(true);
      return;
    }
    setForm(formVacio);      // mensaje válido: se limpia el formulario y se avisa arriba
    setTocado(false);
    setEnviado(true);
  };

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">

          {/* FORMULARIO DE CONTACTO */}
          <div className="card p-4 shadow-sm border-0">
            <div className="card-body">

              <div className="text-center mb-4">
                <div className="login-logo-placeholder mb-3">
                  <i className="bi bi-envelope-heart-fill display-1" style={{ color: "var(--color-acento-2)" }}></i>
                </div>
                <h2 className="font-heading">Contáctanos</h2>
                <p className="text-muted">FORMULARIO DE CONTACTO</p>
              </div>

              {enviado && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle"></i> ¡Mensaje enviado con éxito! Gracias por contactarnos.
                </div>
              )}

              <form noValidate onSubmit={enviar} onBlur={() => !enviado && setTocado(true)}>

                <Campo id="nombre" etiqueta="Nombre Y Apellido" type="text" required
                  value={form.nombre} onChange={cambiar} error={errores.nombre}
                  mensaje="Por favor, ingresa tu nombre." />

                <Campo id="email" etiqueta="Correo (opcional)" type="email" placeholder="ejemplo@gmail.com"
                  value={form.email} onChange={cambiar} error={errores.email}
                  mensaje="Por favor, ingresa un correo válido." />

                <Campo id="numerot" etiqueta="Número Telefónico (opcional)" type="text" placeholder="+569 XXXX XXXX "
                  value={form.numerot} onChange={cambiar} error={errores.numerot}
                  mensaje="Por favor, ingresa un número telefónico chileno válido." />

                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle"></i>
                  <strong> Importante:</strong> Debes proporcionar al menos uno de los dos medios de contacto, ya sea correo electrónico y/o número teléfonico .
                </div>

                <Campo id="comentario" etiqueta="Comentario" componente="textarea" rows="5" required
                  value={form.comentario} onChange={cambiar} error={errores.comentario}
                  mensaje="Por favor, ingresa tu comentario." />

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">ENVIAR MENSAJE</button>
                </div>

              </form>
            </div>
          </div>

          {/* TARJETA DE CONTACTO DIRECTO */}
          <div className="card p-4 shadow-sm border-0 mt-4">
            <div className="card-body text-center">

              <div className="mb-3">
                <i className="bi bi-telephone-fill display-5" style={{ color: "var(--color-acento-2)" }}></i>
              </div>

              <h3 className="font-heading">¿Necesitas contactarnos directamente?</h3>

              <p className="text-muted">
                Si gustas, también puedes contactarte con nosotros
                directamente a través de nuestros números telefónicos.
              </p>

              <div className="mt-4">
                <p className="mb-2">
                  <i className="bi bi-telephone-fill"></i> <strong>Teléfono:</strong> +569 1234 5678
                </p>
                <p className="mb-2">
                  <i className="bi bi-whatsapp"></i> <strong>WhatsApp:</strong> +569 8765 4321
                </p>
              </div>

              <p className="text-muted mt-3 mb-0">Estamos disponibles para responder tus consultas.</p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
