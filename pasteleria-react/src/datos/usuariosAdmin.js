/* Mismas funciones de datos de Js/admin-usuarios.js.
   Los datos se guardan en localStorage ("usuariosAdmin"). */

export function obtenerUsuariosAdmin() {
    let data = JSON.parse(localStorage.getItem('usuariosAdmin'));
    if (!data) {
        data = [
            { run: '191100220', nombre: 'Admin', apellidos: 'Sistema', correo: 'admin@duoc.cl', fechaNacimiento: '1990-01-01', tipo: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Av. Siempre Viva 123' },
            { run: '112223339', nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', fechaNacimiento: '1995-05-05', tipo: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Calle Falsa 456' }
        ];
        localStorage.setItem('usuariosAdmin', JSON.stringify(data));
    } else {
        const clienteDemo = data.find(function(usuario) {
            return usuario.correo === 'cliente@gmail.com';
        });

        if (clienteDemo && (clienteDemo.region !== 'Región Metropolitana de Santiago' || clienteDemo.comuna !== 'Santiago')) {
            clienteDemo.region = 'Región Metropolitana de Santiago';
            clienteDemo.comuna = 'Santiago';
            localStorage.setItem('usuariosAdmin', JSON.stringify(data));
        }
    }
    return data;
}

export function guardarUsuariosAdmin(data) {
    localStorage.setItem('usuariosAdmin', JSON.stringify(data));
}
