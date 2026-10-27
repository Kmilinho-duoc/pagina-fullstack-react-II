import { productos } from "./inventario";

/* Mismas funciones de datos de Js/admin-productos.js.
   Los datos se guardan en localStorage ("productosAdmin"),
   usando como base inicial el arreglo "productos" de inventario. */

export function obtenerProductosAdmin() {
    let data = JSON.parse(localStorage.getItem('productosAdmin'));
    if (!data) {
        data = productos.map(function(p) {
            return {
                id: p.id,
                categoria: p.categoria,
                nombre: p.nombre,
                descripcion: '',
                precio: p.precio,
                stock: 20,
                stockCritico: 5,
                imagen: p.imagen
            };
        });
        localStorage.setItem('productosAdmin', JSON.stringify(data));
    }
    return data;
}

export function guardarProductosAdmin(data) {
    localStorage.setItem('productosAdmin', JSON.stringify(data));
}

export function obtenerCategorias() {
    const base = obtenerProductosAdmin().map(p => p.categoria);
    return [...new Set(base)];
}
