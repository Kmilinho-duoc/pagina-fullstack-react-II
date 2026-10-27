import { useEffect } from "react";

// Equivale al <title> que tenía cada página HTML.
export default function usarTitulo(titulo) {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
