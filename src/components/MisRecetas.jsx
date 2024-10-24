import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import axios from "axios";

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]); 
  const [filtros, setFiltros] = useState({
    ingrediente: "",
    nivel: "",
    maxTiempo: "",
  }); 
  
  
  const userId = localStorage.getItem("userId"); 

 
  const obtenerRecetas = async () => {
    
    const { ingrediente, nivel, maxTiempo } = filtros;

    try {
      const response = await axios.get(
        ` https://backend-recetas.onrender.com/api/recetas/buscar?ingrediente=${ingrediente}&nivel=${nivel}&maxTiempo=${maxTiempo}&usuarioId=${userId}`);
      setRecetas(response.data); 
      setLoading(false);
    } catch (err) {
      setError("Error al obtener las recetas");
      
    }
  };

  // Manejamos el cambio en los filtros
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

   // Función para borrar los filtros
   const borrarFiltros = () => {
    const filtrosReiniciados = { ingrediente: "", nivel: "", maxTiempo: "" }; 
    setFiltros(filtrosReiniciados);
    obtenerRecetas(); 
  };

  
  const eliminarReceta = async (eliminarId) => {
    // Mostrar una alerta de confirmación
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta receta?"
    );

    if (confirmacion) {
      try {
        await axios.delete(
          `https://backend-recetas.onrender.com/api/recetas/eliminar/${eliminarId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
          }
        );
        obtenerRecetas(); 
      } catch (err) {
        setError("Error al eliminar la receta");
      }
      console.log(eliminarId);
    } else {
      console.log("Eliminación cancelada");
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    obtenerRecetas(); 
  };

  
  useEffect(() => {
    obtenerRecetas(); 
  }, []);

  

 

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <h1>Mis Recetas</h1>
      <Link to="/crear">Crear</Link>

     
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ingrediente">Ingrediente:</label>
          <input
            type="text"
            id="ingrediente"
            name="ingrediente"
            value={filtros.ingrediente}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="nivel">Nivel de dificultad:</label>
          <select
            id="nivel"
            name="nivel"
            value={filtros.nivel}
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
        <div>
          <label htmlFor="maxTiempo">
            Tiempo máximo de preparación (minutos):
          </label>
          <input
            type="number"
            id="maxTiempo"
            name="maxTiempo"
            value={filtros.maxTiempo}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Buscar</button>
        <button
          type="button"
          onClick={borrarFiltros}
          style={{ marginLeft: "10px" }}
        >
          Borrar Filtros
        </button>
      </form>

      {recetas.length === 0 ? (
        <div>
          <h2>No tiene recetas</h2>
        </div>
      ) : (
        <ul>
          {recetas.map((r) => (
            <li key={r.id}>
              <h2>{r.titulo}</h2>
              <p>
                <strong>Ingredientes:</strong> {r.ingredientes.join(", ")}
              </p>
              <p>
                <strong>Instrucciones:</strong>
              </p>
              <ol>
                {r.instrucciones.map((instruccion, index) => (
                  <li key={index}>{instruccion}</li>
                ))}
              </ol>
              <p>
                <strong>Tiempo de Preparación:</strong> {r.tiempoDePreparacion}{" "}
                minutos
              </p>
              <p>
                <strong>Nivel de Dificultad:</strong> {r.nivelDeDificultad}
              </p>
              <div>
                <Link to={`/editar/${r._id}`}>Editar</Link>
                <button onClick={() => eliminarReceta(r._id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisRecetas;
