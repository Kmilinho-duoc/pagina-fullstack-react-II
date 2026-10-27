// Reglas de Js/contacto.js (validarFormularioContacto), pero sin tocar el DOM.
// Recibe { nombre, email, numerot, comentario } y devuelve { campo: "mensaje" }
// solo con los campos inválidos ({} si todo está bien).
export function validarContacto(valores) {
    const errores = {};
    const nombre = valores.nombre.trim();
    const email = valores.email.trim();
    const numerot = valores.numerot.trim();
    const comentario = valores.comentario.trim();

    // 1. VALIDACIÓN DEL NOMBRE
    if (nombre.length < 6) {
        errores.nombre = "El nombre debe tener al menos 6 caracteres.";
    } else if (nombre.length > 100) {
        errores.nombre = "El nombre no puede exceder los 100 caracteres.";
    }

    // 2. VALIDACIÓN DE CORREO Y TELÉFONO
    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    const telefonoRegex = /^(?:\+569 ?\d{4} ?\d{4}|569 ?\d{4} ?\d{4}|\+569\d{8}|569\d{8})$/;

    if (email === '' && numerot === '') {
        errores.email = "Debes ingresar al menos un correo o un número telefónico.";
        errores.numerot = "Debes ingresar al menos un correo o un número telefónico.";
    } else {
        if (email !== '') {
            if (email.length > 100) {
                errores.email = "El correo no puede exceder los 100 caracteres.";
            } else if (!emailRegex.test(email)) {
                errores.email = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            }
        }

        if (numerot !== '' && !telefonoRegex.test(numerot)) {
            errores.numerot = "Por favor, ingresa un número telefónico chileno válido (+569 1234 5678).";
        }
    }

    // 3. VALIDACIÓN DEL COMENTARIO
    if (comentario.length === 0) {
        errores.comentario = "El comentario es requerido.";
    } else if (comentario.length > 500) {
        errores.comentario = "El comentario no puede exceder los 500 caracteres.";
    }

    return errores;
}
