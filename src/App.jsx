import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const App = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Función de inicio de sesión
  const inicioSesion = async (data) => {
    const { email, password } = data;

    try {
      // Hacemos la llamada a la API usando Axios
      const response = await axios.post('https://backend-recetas.onrender.com/api/usuarios/login', {
        email,
        password
      });

      // Guardar el token y el id del usuario en localStorage si el login es exitoso
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); 
      console.log("Token= ",localStorage.getItem("token"))
      console.log("Id= ",localStorage.getItem("userId"))
      alert("Loggin correcto")
      // Redirigir a la página de recetas
      navigate("/misrecetas");
    } catch (error) {
      // Manejo de errores
      console.error('Error en el inicio de sesión:', error.response?.data?.message || error.message);
      alert("Error al hacer loggin")
    }
  };

  return (
    <div className="inicio">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(inicioSesion)}>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          {...register("email", { 
            required: "Correo electrónico es requerido", 
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Formato de correo electrónico inválido"
            }
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          {...register("password", { 
            required: "La contraseña es requerida", 
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres"
            }
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Entrar</button>
      </form>

      <div className="crear-usuario">
        <p>¿No tienes cuenta?</p>
        <Link to="/crearusuario" className="btn-crear-usuario">Crear Usuario</Link>
      </div>
    </div>
  );
};

export default App;
