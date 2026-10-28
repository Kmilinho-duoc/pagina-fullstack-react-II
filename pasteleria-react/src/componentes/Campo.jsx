export default function Campo({
  id,
  etiqueta,
  type = "text",
  required = false,
  value,
  onChange,
  error,
  mensaje,
  componente = "input",
  clase = "mb-3",
  children,
  ...props
}) {
  const ComponenteRender = componente;
  const tieneError = Boolean(error);

  // Si 'error' es un string (un mensaje personalizado), lo muestra.
  // De lo contrario, muestra el 'mensaje' que se le pasó por prop.
  const mensajeFinal = typeof error === "string" ? error : mensaje;

  return (
    <div className={clase}>
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>
      <ComponenteRender
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={`form-control ${tieneError ? "is-invalid" : ""}`}
        {...props}
      >
        {children}
      </ComponenteRender>
      {tieneError && mensajeFinal && (
        <div className="invalid-feedback">
          {mensajeFinal}
        </div>
      )}
    </div>
  );
}