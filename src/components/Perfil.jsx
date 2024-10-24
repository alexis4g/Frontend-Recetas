import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // useForm para el formulario de nombre y email
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // useForm para el formulario de cambio de contraseña
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const obtenerUsuario = async () => {
    try {
      const response = await axios.get(
        `https://backend-recetas.onrender.com/api/usuarios/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsuario(response.data);
      reset(response.data); // Cargar los datos en el formulario
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  const modificarUsuario = async (data) => {
    try {
      await axios.put(
        `https://backend-recetas.onrender.com/api/usuarios/modificar/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Datos del usuario modificados:", data);
    } catch (error) {
      console.error("Error al modificar los datos del usuario:", error);
    }
  };

  const cambiarPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      console.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.put(
        `https://backend-recetas.onrender.com/api/usuarios/modificar/${userId}`,
        {
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Contraseña cambiada:", data.password);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  const eliminarCuenta = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      try {
        await axios.delete(
          `https://backend-recetas.onrender.com/api/usuarios/eliminar/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Cuenta eliminada");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
      }
    }
  };

  useEffect(() => {
    if (userId && token) {
      obtenerUsuario();
    }
  }, [userId, token]);

  if (!usuario) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <h2>Modificar Datos del Usuario</h2>

      <form onSubmit={handleSubmit(modificarUsuario)}>
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
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Formato de correo electrónico inválido",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>

      <h2>Cambiar Contraseña</h2>

      <form onSubmit={handleSubmitPassword(cambiarPassword)}>
        <div>
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            {...registerPassword("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          {passwordErrors.password && <p>{passwordErrors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            {...registerPassword("confirmPassword", {
              required: "Por favor confirma tu contraseña",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            })}
          />
          {passwordErrors.confirmPassword && (
            <p>{passwordErrors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit">Cambiar Contraseña</button>
      </form>

      <h2>Eliminar Cuenta</h2>
      <button
        onClick={eliminarCuenta}
        style={{ backgroundColor: "red", marginBottom: "2rem" }}
      >
        Eliminar Cuenta
      </button>
    </div>
  );
};

export default Perfil;
