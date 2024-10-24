import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import MisRecetas from './components/MisRecetas.jsx'
import Recetas from './components/Recetas.jsx'
import Perfil from './components/Perfil.jsx';
import Editar from './components/Editar.jsx';
import Crear from './components/Crear.jsx'
import PaginaNoEncontrada from './components/PaginaNoEncontrada.jsx';
import CrearUsuario from './components/CrearUsuario.jsx'
import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([{
  path: "/", // Indica la ruta raíz de la web, por ejemplo: http://to.com
  element: <App />, // Indica el elemento que se deberá renderizar cuando se pida la ruta anterior 
  errorElement: <PaginaNoEncontrada />, // Página de error
},{
  path: "/misrecetas",
  element: <MisRecetas />,
},{
  path: "/recetas",
  element: <Recetas />,
},{
  path: "/perfil",
  element: <Perfil />,
},{
  path: "/editar/:id",
  element: <Editar />,
},{
  path: "/crear",
  element: <Crear />,
},{
  path: "/crearusuario",
  element: <CrearUsuario />,
},
]); // Array de objetos


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
