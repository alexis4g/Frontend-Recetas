import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CrearUsuario = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

 
  const crearUsuario = async (data) => {
    const { nombre, email, password, confirmPassword } = data;

    
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      
      const response = await axios.post('https://backend-recetas.onrender.com/api/usuarios/crear', {
        nombre,
        email,
        password,
      });

     
      console.log('Usuario creado:', response.data);
      alert("Usuario creado con exito")
      navigate("/");
    } catch (error) {
      
      console.error('Error creando usuario:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="crear-usuario">
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit(crearUsuario)}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            {...register("email", { 
              required: "Correo electrónico es obligatorio",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Formato de correo electrónico inválido"
              }
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Por favor confirma tu contraseña",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default CrearUsuario;
