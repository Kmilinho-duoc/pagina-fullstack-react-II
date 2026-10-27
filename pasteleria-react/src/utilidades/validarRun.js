/* ===========================================================
   Validación de RUN chileno (sin puntos ni guion, ej: 19011022K)
   Usado por registro.js y admin-usuarios.js
   =========================================================== */

export function validarRun(run) {
    if (!/^[0-9]{6,8}[0-9Kk]$/.test(run)) return false;

    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo[i], 10);
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

    return dv === dvEsperado;
}
