import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './componentes/privateRoute';
import './App.scss';
import Home from './vistas/home';
import EditarPerfil from './vistas/editarPerfil';
import BusquedaVista from './vistas/busquedaVista';
import GestionTutorias from './vistas/gestionTutorias';
import Login from './vistas/login';
import { TutorRoute } from './componentes/tutorRoute';
import { useEffect, useState } from 'react';
import Registro from './vistas/registro';
import axios from 'axios';
import { SearchContextProvider } from './context/searchContext';

function App() {
/*  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1); //8
  const [pageCount, setPageCount] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const handleSearch = (filtros, order, searchTerm, page, pageSize, pageCount, totalResults, setTotalResults, setPageCount, setSearchResults) => {
    console.log("HANDLESEARCH");
    console.log("FILTROS:", filtros);
    console.log("order:", order)
    console.log("searchTerm:", searchTerm)
    if (!searchTerm) return;
    const data = [
      {
        "type": "asignatura",
        "ids": filtros?.asignatura
      },
      {
        "type": "universidades",
        "ids": filtros?.universidades
      },
      {
        "type": "valoracion",
        "ids": filtros?.valoracion
      }
    ];
    const orderData = {
      "mayorValoracion": order?.mayorValoracion,
      "menorPrecio": order?.menorPrecio
    }
    console.log("FILTROS:", filtros);
    console.log("order:", orderData)
    console.log("PAGE:", page)
    console.log("PAGESIZE:", pageSize)
    console.log("PAGECOUNT:", pageCount)
    console.log("TOTALRESULTS:", totalResults)
    const urlBase = import.meta.env.VITE_BACK_URL;
    axios.post(`${urlBase}usuario/lista/usuarios`, {
      palabra: searchTerm,
      filters: data,
      order: orderData,
      limit: pageSize,
      page: page
    })
      .then(response => {
        const data = response.data;
        setSearchResults(data.data);
        setPageCount(data.pageCount);
        setTotalResults(data.itemCount);
        console.log("data:", data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  */
  return (
    <>
        <Router>
            <SearchContextProvider>
          <Routes>
            <Route path="/" >
              <Route index element={<Home />}></Route>
              <Route path=':idUsuario' element={<PrivateRoute><EditarPerfil /></PrivateRoute>}></Route>
              <Route path='search' element={<BusquedaVista />}></Route>
              <Route path='tutorias' element={<TutorRoute><GestionTutorias /></TutorRoute>}></Route>
              <Route path='login' element={<Login />}></Route>
              <Route path='registro' element={<Registro />}></Route>
            </Route>
            <Route path='*' element={<h1>404 Not Found</h1>}></Route>
          </Routes>
          </SearchContextProvider>
        </Router>
      {/* <RegistroVista></RegistroVista> */}
      {/* <ProductosVista></ProductosVista> */}
    </>
  )
}

export default App;