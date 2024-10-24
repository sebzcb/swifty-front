import {  useEffect, useState } from 'react';
import { Container, Box, Typography, MenuItem, Select, Pagination, FormControl, InputLabel } from '@mui/material';
import Filtros from '../componentes/search/filtros';
import TutorCard from '../componentes/tutorCard';
import Navbar from '../componentes/navBar';
import BusquedaBarra from '../componentes/search/busquedaBarra';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../context/searchContext';
import LoadingComponent from '../utils/LoadingComponente';
import { Sort } from '@mui/icons-material';
import useIsMobile from '../utils/useIsMobile';

const BusquedaVista = () => {
  const { search, searchParams, searchResults, dataShow, loading, updateSearchParams, DIRECTION, ORDER } = useSearchContext();
  //elimina duplicados de asignaturas
  const formatedResults = searchResults.map((result) => {
    let resultsAux = result.asignaturas; //array 
    if(!resultsAux) return result;
  //  console.log("Asignaturas:", resultsAux);
    const asignaturasArray = resultsAux.split(',');
    //console.log("Asignaturas:", asignaturasArray);
    //eliminar duplicados del array
    const asignaturasSet = new Set(asignaturasArray);
    //console.log("Asignaturas:", asignaturasSet);
    //convertir array a string
    const stringFinal = [...asignaturasSet].join(', ');
    //console.log("Asignaturas:", stringFinal);
    resultsAux = stringFinal;
    return {
      ...result,
      asignaturas: resultsAux
    }
  });

  const navigate = useNavigate();
  const [orderSelected, setOrderSelected] = useState(1);
  const handlerPerfil = (id) => {
    console.log('ID:', id);
    navigate('/' + id);
  }
  useEffect(() => {
    console.log("========  Se ejecuta useEffect de SearchResults ========= ");
    search();
  }, [searchParams]);
  const handleChangePage = (value) => {
    updateSearchParams({ page: value });
  };
  const handleSelectOrder = (event) => {
    const sortSelected = event.target.value;
    let orderObject = {};
    if (sortSelected === 1) {
      orderObject = { direction: DIRECTION.DESC, order: ORDER.VALORACION };
    }
    if (sortSelected === 2) {
      orderObject = { direction: DIRECTION.ASC, order: ORDER.PRICE };
    }
    setOrderSelected(sortSelected);
    updateSearchParams(orderObject);
  };
  const OrderForm = () => (
    <FormControl size='medium' sx={{ width: '200px' }}>
      <InputLabel id="demo-simple-select-label" sx={{ display: 'flex', gap: '10px', width: '100%' }}>
        <Sort />
        Ordenar por
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={orderSelected}
        onChange={handleSelectOrder}
      >
        <MenuItem value={1}>Mayor valoracion</MenuItem>
        <MenuItem value={2}>Menor precio</MenuItem>
      </Select>
    </FormControl>
  );
  const isMobile = useIsMobile();
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Navbar />
      <Container sx={{ pt: '20px' }}>
        <BusquedaBarra isHomePage={false} />
        {
          isMobile && formatedResults.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop:'20px' }}>
              <Filtros />
              <OrderForm />
            </Box>
          )
        }
        <Box sx={{ display: 'flex' }}>
          {
            !isMobile && formatedResults.length > 0 && (
              <Box component="aside" sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2 }}>
                <Filtros />
              </Box>
            )
          }
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant='h1' gutterBottom sx={{ wordBreak: 'break-word' }}> {dataShow.keyword} </Typography>
                <Typography variant="subtitle1" gutterBottom> {dataShow.totalResults} resultados encontrados </Typography>
              </Box>
              {!isMobile && formatedResults.length > 0 && <OrderForm />}
            </Box>
            <Box container spacing={2} component={'ul'} sx={{
              listStyleType: 'none',
            }}>
              {formatedResults.length > 0 ? formatedResults.map((result, index) => (
                <Box component={'li'} key={index}>
                  <TutorCard
                    key={index}
                    nombre={result.nombre}
                    descripcion={result.descripcion}
                    universidad={result.universidad}
                    precioPorHora={result.precioporhora}
                    valoracion={result.valoracion_promedio}
                    asignaturas={result?.asignaturas_impartidas?.split(',')}
                    onClick={() => handlerPerfil(result.id_tutor)}
                  />
                </Box>
              )) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', pt: '50px' }}>
                  <Typography variant="h2"> No se encontraron resultados :o </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={dataShow.pageCount}
                  page={dataShow.page}
                  onChange={(event, value) => handleChangePage(value)}
                  color="primary"
                  size='large'
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default BusquedaVista;
