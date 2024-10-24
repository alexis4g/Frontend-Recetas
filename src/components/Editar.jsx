import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";

const Editar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

 
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  
  const editar = async (data) => {
    const token = localStorage.getItem("token"); 

    // Convertimos las cadenas de ingredientes e instrucciones en arrays
    const recetaData = {
      ...data,
      ingredientes: data.ingredientes.split(",").map((item) => item.trim()), // Convertimos ingredientes a array
      instrucciones: data.instrucciones.split(",").map((item) => item.trim()), // Convertimos instrucciones a array
    };

    try {
     
      await axios.put(
        `https://backend-recetas.onrender.com/api/recetas/actualizar/${id}`,
        recetaData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      alert("Receta actualizada")
      console.log("Receta editada:", recetaData);
      navigate("/misrecetas"); 
    } catch (error) {
      console.error("Error al editar la receta:", error);
    }
  };


  const fetchReceta = async () => {
    try {
      const response = await axios.get(
        `https://backend-recetas.onrender.com/api/recetas/${id}`
      );

      const receta = response.data;

      // Poner los valores en el formulario usando setValue de react-hook-form
      setValue("titulo", receta.titulo);
      setValue("ingredientes", receta.ingredientes.join(", ")); // Convertimos array a string separado por comas
      setValue("instrucciones", receta.instrucciones.join(", ")); // Convertimos array a string separado por comas
      setValue("tiempoDePreparacion", receta.tiempoDePreparacion);
      setValue("nivelDeDificultad", receta.nivelDeDificultad);
    } catch (error) {
      setError("Error al cargar la receta");
    }
  };

  useEffect(() => {
    fetchReceta();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <h2>Editar Receta: </h2>
      <form onSubmit={handleSubmit(editar)}>
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

        <button type="submit">Editar Receta</button>
      </form>
    </div>
  );
};

export default Editar;
