import  { useEffect, useState } from 'react';
import axios from 'axios';
import FilterGroup from './FilterGroup';
import { getAsignaturasService } from '../../services/asignaturasServices';

const Filtros = () => {
  const [universidades, setUniversidades] = useState([]);
  const [asignaturas,setAsignaturas] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const loadAsignaturas = async () => {
    getAsignaturasService().then((res) => {
      setAsignaturas(res.data);
    }).catch((error) => {
      console.error('Hubo un problema al realizar la solicitud:', error);
    });
  }
  const loadUniversidades = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}universidades`);
    console.log(res.data);
    setUniversidades(res.data);
  }
  const loadValoraciones = () => {
    const valoracionesJSON = [
      {id: 1, nombre: "1 estrella"},
      {id:1.5, nombre: "1.5 estrellas"},
      {id: 2, nombre: "2 estrellas"},
      {id: 2.5, nombre: "2.5 estrellas"},
      {id: 3, nombre: "3 estrellas"},
      {id: 3.5, nombre: "3.5 estrellas"},
      {id: 4, nombre: "4 estrellas"},
      {id: 4.5, nombre: "4.5 estrellas"},
      {id: 5, nombre: "5 estrellas"}
    ];
    const res = valoracionesJSON;
    console.log(res);
    setValoraciones(res);
  }
  useEffect(() => {
    loadUniversidades();
    loadAsignaturas();
    loadValoraciones();
  }, []);
  if(universidades.length === 0 || asignaturas.length === 0){
    return <div>Cargando...</div>
  }    

  return (
    <>
    <FilterGroup items={universidades} name={"Universidades"} filterType="universidades"/>
    <FilterGroup items={asignaturas} name={"Asignaturas"} filterType="asignaturas"/>
    <FilterGroup items={valoraciones} name={"Valoraciones"} filterType="valoraciones"/>
    </>
  );
};
export default Filtros;

/*  <Box>
    <Typography variant="h6">Filtros</Typography>
    <Box>
      {asignaturas.map((asignatura) => (
        <FormControlLabel
          key={asignatura.codigo} 
          control={<Checkbox onChange={(e) => handleFilterChange('asignatura', asignatura.codigo, e.target.checked)} />} 
          label={asignatura.nombreasignatura} 
        />
      ))}
     
  
    </Box>
    <Typography variant="h6">Universidades</Typography>
    <Box>
      {universidades.map((universidad) => (
        <FormControlLabel
          key={universidad.id} 
          control={<Checkbox onChange={(e) => handleFilterChange('universidades', universidad.id, e.target.checked)} />} 
          label={universidad.nombre} 
        />
      ))}
    </Box>
    <Typography variant="h6">Tutores</Typography>
    <Box>
      <FormControlLabel 
        control={<Checkbox onChange={(e) => handleFilterChange('valoracion', '1', e.target.checked)} />} 
        label="1 estrella" 
      />
      <FormControlLabel 
        control={<Checkbox onChange={(e) => handleFilterChange('valoracion', '2', e.target.checked)} />} 
        label="2 estrellas" 
      />
      <FormControlLabel 
        control={<Checkbox onChange={(e) => handleFilterChange('valoracion', '3', e.target.checked)} />} 
        label="3 estrellas" 
      />
      <FormControlLabel 
        control={<Checkbox onChange={(e) => handleFilterChange('valoracion', '4', e.target.checked)} />} 
        label="4 estrellas" 
      />
      <FormControlLabel 
        control={<Checkbox onChange={(e) => handleFilterChange('valoracion', '5', e.target.checked)} />} 
        label="5 estrellas" 
      />
    </Box>
  </Box>
*/