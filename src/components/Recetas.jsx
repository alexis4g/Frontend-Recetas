import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import axios from "axios";
import { FaMedal } from "react-icons/fa";

const Recetas = () => {
  const [recetas, setRecetas] = useState([]);

  const [filtros, setFiltros] = useState({
    ingrediente: "",
    nivel: "",
    maxTiempo: "",
  });

  const obtenerRecetas = async () => {
    const { ingrediente, nivel, maxTiempo } = filtros;
    try {
      const response = await axios.get(
        ` https://backend-recetas.onrender.com/api/recetas/buscar?ingrediente=${ingrediente}&nivel=${nivel}&maxTiempo=${maxTiempo}`
      );
      setRecetas(response.data);
    } catch (err) {
      console.error("Error al obtener recetas:", err);
    }
  };

  // Función para manejar el cambio en los inputs de filtro
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  // Función para enviar el formulario de filtros
  const handleSubmit = (e) => {
    e.preventDefault();
    obtenerRecetas();
  };

  const borrarFiltros = () => {
    const filtrosReiniciados = { ingrediente: "", nivel: "", maxTiempo: "" };
    setFiltros(filtrosReiniciados);
    obtenerRecetas();
  };

  useEffect(() => {
    obtenerRecetas();
  }, []);

  // Función para obtener el ícono con el color basado en el nivel de cocina
  const obtenerIconoPorNivel = (nivel) => {
    switch (nivel) {
      case "principiante":
        return <FaMedal style={{ color: "#cd7f32" }} />; // Bronce
      case "intermedio":
        return <FaMedal style={{ color: "silver" }} />; // Plata
      case "avanzado":
        return <FaMedal style={{ color: "gold" }} />; // Oro
      default:
        return null;
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <h1>Recetas</h1>
      <form onSubmit={handleSubmit}>
        {" "}
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
        <h2>No hay recetas</h2>
      ) : (
        <ul>
          {recetas.map((r) => (
            <li key={r._id}>
              <h1>
                Autor:{" "}
                {r.autor && r.autor.nombre
                  ? r.autor.nombre.toUpperCase() + " "
                  : "Desconocido "}
                {r.autor && r.autor.nivelDeCocina
                  ? obtenerIconoPorNivel(r.autor.nivelDeCocina)
                  : null}
              </h1>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recetas;
