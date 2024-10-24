import { Link } from "react-router-dom";
const PaginaNoEncontrada = () => {
  return (
    <div>
      <p>404 Not Found</p>
      <Link to="/">Inicio</Link>
    </div>
  );
};

export default PaginaNoEncontrada;