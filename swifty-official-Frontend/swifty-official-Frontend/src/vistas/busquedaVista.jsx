import { useContext, useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, MenuItem, Select, Pagination, FormControl, InputLabel } from '@mui/material';
import Filtros from '../componentes/filtros';
import TutorCard from '../componentes/tutorCard';
import Navbar from '../componentes/navBar';
import BusquedaBarra from '../componentes/busquedaBarra';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../context/searchContext';
import LoadingComponent from '../utils/LoadingComponente';
import { Sort } from '@mui/icons-material';

const BusquedaVista = () => {
  const { search, searchParams, searchResults, dataShow, loading, updateSearchParams, DIRECTION, ORDER } = useSearchContext();
  const navigate = useNavigate();
  const [orderSelected, setOrderSelected] = useState(0);
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
    <FormControl size='medium'>
      <InputLabel id="demo-simple-select-label" sx={{ display: 'flex', gap: '10px' }}>
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
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Navbar />
      <Container>
        <BusquedaBarra isHomePage={false} />
        <Box sx={{ display: 'flex' }}>
          {searchResults.length > 0 && (
            <Box component="aside" sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2 }}>
              <Filtros />
            </Box>
          )}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant='h1' gutterBottom sx={{ wordBreak: 'break-word' }}> {dataShow.keyword} </Typography>
                <Typography variant="subtitle1" gutterBottom> {dataShow.totalResults} resultados encontrados </Typography>
              </Box>
              {searchResults.length > 0 && <OrderForm />}
            </Box>
            <Box container spacing={2} component={'ul'}>
              {searchResults.length > 0 ? searchResults.map((result, index) => (
                <Box component={'li'} key={index}>
                    <TutorCard
                      key={index}
                      nombre={result.nombre}
                      descripcion={result.descripcion}
                      universidad={result.universidad}
                      precioPorHora={result.precioporhora}
                      valoracion={result.valoracion_promedio}
                      asignaturas={result?.asignaturas?.split(',')}
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
