// Campo de formulario: etiqueta + control + mensaje de error (el mismo HTML de los formularios originales).
// error: texto del mensaje, o true para usar el mensaje por defecto (prop "mensaje").
export default function Campo({ id, etiqueta, componente = "input", clase = "mb-3", error, mensaje, children, ...props }) {
  const Control = componente;                       // "input", "textarea" o "select"
  const base = componente === "select" ? "form-select" : "form-control";

  return (
    <div className={clase}>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <Control id={id} name={id} className={base + (error ? " is-invalid" : "")} {...props}>
        {children}
      </Control>
      {mensaje && <div className="invalid-feedback">{typeof error === "string" ? error : mensaje}</div>}
    </div>
  );
}
