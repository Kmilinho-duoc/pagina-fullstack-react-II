import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { TiendaProvider } from '../contexto/Tienda';

// ruta: '/login', '/carrito', etc. (o { pathname, state })
// storage: { carrito: [...], sesionActual: {...} } se guarda ANTES de renderizar
export function renderApp(ruta = '/', { storage = {} } = {}) {
  Object.entries(storage).forEach(([clave, valor]) => {
    localStorage.setItem(clave, JSON.stringify(valor));
  });

  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </TiendaProvider>
  );
}