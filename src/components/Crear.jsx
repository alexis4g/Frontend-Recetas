import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";

const Crear = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const crear = async (data) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Convertimos las cadenas de ingredientes e instrucciones en arrays
    const recetaData = {
      ...data,
      ingredientes: data.ingredientes.split(",").map((item) => item.trim()), // Convertimos ingredientes a array
      instrucciones: data.instrucciones.split(",").map((item) => item.trim()), // Convertimos instrucciones a array
      autor: userId, // Incluimos el ID del usuario logueado como autor de la receta
    };

    try {
      await axios.post("https://backend-recetas.onrender.com/api/recetas/crear", recetaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Receta creada:", recetaData);

      navigate("/misrecetas");
    } catch (error) {
      console.error("Error al crear la receta:", error);
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <h2>Crear Nueva Receta</h2>

      <form onSubmit={handleSubmit(crear)}>
        <div>
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            {...register("titulo", { required: "El título es obligatorio" })}
          />
          {errors.titulo && <p>{errors.titulo.message}</p>}
        </div>

        <div>
          <label htmlFor="ingredientes">
            Ingredientes (separados por coma)
          </label>
          <input
            type="text"
            id="ingredientes"
            {...register("ingredientes", {
              required: "Los ingredientes son obligatorios",
            })}
          />
          {errors.ingredientes && <p>{errors.ingredientes.message}</p>}
        </div>

        <div>
          <label htmlFor="instrucciones">
            Instrucciones (separadas por coma)
          </label>
          <textarea
            id="instrucciones"
            {...register("instrucciones", {
              required: "Las instrucciones son obligatorias",
            })}
          ></textarea>
          {errors.instrucciones && <p>{errors.instrucciones.message}</p>}
        </div>

        <div>
          <label htmlFor="tiempoDePreparacion">
            Tiempo de Preparación (en minutos)
          </label>
          <input
            type="number"
            id="tiempoDePreparacion"
            {...register("tiempoDePreparacion", {
              required: "El tiempo de preparación es obligatorio",
              valueAsNumber: true,
              min: { value: 1, message: "El tiempo debe ser mayor a 0" },
            })}
          />
          {errors.tiempoDePreparacion && (
            <p>{errors.tiempoDePreparacion.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="nivelDeDificultad">Nivel de Dificultad</label>
          <select id="nivelDeDificultad" {...register("nivelDeDificultad")}>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        <button type="submit">Crear Receta</button>
      </form>
    </div>
  );
};

export default Crear;
