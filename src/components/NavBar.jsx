import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/misrecetas" className="nav-link">
        Mis recetas
      </NavLink>
      <NavLink to="/recetas" className="nav-link">
        Recetas
      </NavLink>
      <NavLink to="/perfil" className="nav-link">
        Perfil
      </NavLink>

      <NavLink to="/" className="nav-link" onClick={handleLogout}>
        Cerrar Sesión
      </NavLink>
    </nav>
  );
};

export default Navbar;
