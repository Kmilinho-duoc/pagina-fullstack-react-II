# Pastelería React - Sistema de Gestión y Catálogo

Aplicación web interactiva desarrollada para una pastelería, construida con **React**, estilizada con **Bootstrap** y testeada mediante **Vitest** y **React Testing Library**. El proyecto incluye la gestión de productos en panel de administración, catálogo dinámico y validación de reglas de negocio.

---

## Tecnologías Utilizadas

* **Frontend:** [React](https://react.dev/) (Vite)
* **Estilos:** [Bootstrap 5](https://getbootstrap.com/)
* **Enrutamiento:** [React Router](https://reactrouter.com/)
* **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Pruebas Unitarias

Las pruebas del sistema verifican el correcto funcionamiento de los componentes y las reglas de negocio clave:

* **Navegación:** Verificación de rutas hacia los formularios de creación y edición.
* **Eliminación:** Confirmación y eliminación de productos mediante alertas.
* **Formateo:** Renderizado correcto de precios en formato de moneda (`$`).
* **Cálculo de Stock:** Evaluación dinámica de estado de inventario (`Normal` vs `Stock crítico`).

### Ejecutar los tests

Para correr la suite de pruebas unitarias:

```bash
npx vitest src/pruebas/productosAdmin.spec.jsx

```

O ejecutar el runner en modo de escucha:

```bash
npm run test

```

---

##  Instalación y Configuración

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/pasteleria-react.git
cd pasteleria-react

```


2. **Instalar dependencias:**
```bash
npm install

```


3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev

```



---

## Estructura del Proyecto

```text
pasteleria-react/
├── src/
│   ├── componentes/      # Componentes reutilizables de UI
│   ├── paginas/          # Vistas principales (Admin, Productos, etc.)
│   ├── pruebas/          # Archivos de pruebas (.spec.jsx)
│   ├── App.jsx           # Configuración de rutas
│   └── main.jsx          # Punto de entrada
├── package.json
└── vite.config.js

```
