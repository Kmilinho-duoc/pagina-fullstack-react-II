import { useState } from "react";

// El formulario de suscripción solo aparecía en el footer de INDEX.html
function Newsletter() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", clase: "" });

  const suscribir = (event) => {
    event.preventDefault();
    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    if (emailRegex.test(email)) {
      setMensaje({ texto: "Correo ingresado: " + email, clase: "text-success" });
      setEmail("");
    } else {
      setMensaje({
        texto: "Ingresa un correo válido (los correos validos terminan  en @duoc.cl, @profesor.duoc.cl o @gmail.com)",
        clase: "text-danger",
      });
    }
  };

  return (
    <div className="col-lg-6 col-md-12">
      <h5>Suscribe tu correo electronico para recibir nuestras novedades</h5>
      <form onSubmit={suscribir}>
        <div className="input-group">
          <input type="email" className="form-control" placeholder="Enter Email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-primary" type="submit">Suscribir</button>
        </div>
        <small className={"d-block mt-2 " + mensaje.clase}>{mensaje.texto}</small>
      </form>
    </div>
  );
}

export default function Footer({ conNewsletter }) {
  return (
    <footer className="footer-mil-sabores mt-5 py-5">
      <div className="container">
        {conNewsletter && (
          <div className="row">
            <div className="col-lg-6 col-md-6 mb-4 mb-lg-0">
              <h5 className="font-heading">Pastelería Mil Sabores</h5>
              <p>Celebrando 50 años de dulzura y tradición.</p>
            </div>
            <Newsletter />
          </div>
        )}
        <hr className="my-4" />
        <div className="text-center">
          <small>&copy; 2026 Pastelería Mil Sabores. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}
