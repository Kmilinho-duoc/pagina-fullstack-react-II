import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./componentes/Layout";
import Inicio from "./paginas/Inicio";
import Productos from "./paginas/Productos";
import DetalleProducto from "./paginas/DetalleProducto";
import Nosotros from "./paginas/Nosotros";
import Blogs from "./paginas/Blogs";
import DetalleBlog from "./paginas/DetalleBlog";
import Carrito from "./paginas/Carrito";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import Contacto from "./paginas/Contacto";
import LayoutAdmin from "./componentes/LayoutAdmin";
import HomeAdmin from "./paginas/admin/HomeAdmin";
import ProductosAdmin from "./paginas/admin/ProductosAdmin";
import ProductoForm from "./paginas/admin/ProductoForm";
import Usuarios from "./paginas/admin/Usuarios";
import UsuarioForm from "./paginas/admin/UsuarioForm";

function NoEncontrado() {
  return (
    <main className="container my-5">
      <h1 className="text-center font-heading">404 - Página no encontrada</h1>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>

      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<HomeAdmin />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/:id/editar" element={<ProductoForm />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="usuarios/:run/editar" element={<UsuarioForm />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
