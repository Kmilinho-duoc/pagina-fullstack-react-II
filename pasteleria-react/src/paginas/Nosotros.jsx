import usarTitulo from "../usarTitulo";

export default function Nosotros() {
  usarTitulo("Sobre Nosotros - Pastelería Mil Sabores");

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="text-center font-heading display-4 mb-4">Nuestra Historia</h1>

          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD5lBD-NgzTCjUaCgkij1jWLzabDsy1v0KcRo4eD0TKlp5NwQWv0KXKnO8&s=10" className="img-fluid d-block mx-auto rounded mb-4" alt="Foto histórica de la pastelería" />

          <p className="fs-5 text-center">Pastelería 1000 Sabores celebra su <strong>50 aniversario</strong> como un referente en la repostería chilena. Famosa por su participación en un récord Guinness en 1995, cuando colaboramos en la creación de la torta más grande del mundo, buscamos ahora renovar nuestra tradición con una moderna experiencia de compra online.</p>

          <hr className="my-5" />

          <div className="row">
            <div className="col-md-6">
              <h2 className="font-heading">Misión</h2>
              <p>Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería[cite: 11].</p>
            </div>
            <div className="col-md-6">
              <h2 className="font-heading">Visión</h2>
              <p>Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía[cite: 13].</p>
            </div>
          </div>

          <hr className="my-5" />

          <h2 className="font-heading">Sobre los Desarrolladores</h2>
          <p>Este sitio web es un proyecto académico para la Escuela de Informática y Telecomunicaciones de Duoc UC.</p>
        </div>
      </div>
    </main>
  );
}
