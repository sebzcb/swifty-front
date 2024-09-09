// src/components/VerTutorias.js
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Icon, Box } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalTutoria from './crearTutoria';
import axios from 'axios';
import ConfirmarEliminarTutoriaModal from './confirmarEliminarTutoriaModal';
import EditarTutoriaModal from './editarTutoriaModal';

function VerTutorias() {
  const [openModal, setOpenModal] = useState(false);
  const [tutorias, setTutorias] = useState([]); // Añade un nuevo estado para almacenar las tutorias
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [idTutoriaSeleccionada, setIdTutoriaSeleccionada] = useState(null);
  const [tutoriaSeleccionadaEditar, setTutoriaSeleccionadaEditar] = useState(null);
  const [openModalEditar, setOpenModalEditar] = useState(false);

  const handleCrearTutoria = () => {
    console.log('Crear tutoria');
    setOpenModal(true);
  }
  const calcularEstado = (tutoria) => {
    const fechaInicio = new Date(tutoria.fecha);
    const horaInicio = tutoria.hora.split(':').map(Number);
    const fechaActual = new Date();
    const horaActual = [fechaActual.getHours(), fechaActual.getMinutes()];

    let estado = 'Pendiente';
    //console.log("fechainicio:",fechaInicio,"fechaAct:", fechaActual,"horainicio:" ,horaInicio,"horaactual:", horaActual);
    return estado;
  };

  const loadTutorias = async () => {
    console.log('Cargar tutorias');
    const id_tutor = JSON.parse(localStorage.getItem('usuario')).id;
    const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/lista/tutorias`, { id_tutor });
    console.log(res.data);
    setTutorias(res.data);
  }
  useEffect(() => {
    loadTutorias();
  }, []);
  const handleEliminarTutoria = async () => {
    console.log('Eliminar tutoria de id', idTutoriaSeleccionada);
    const res = await axios.delete(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/eliminar/${idTutoriaSeleccionada}`);
    console.log(res.data);
    setOpenModalEliminar(false);
    await loadTutorias();
  }
  const handleConfirmarEliminar = (id_tutoria) => {
    console.log('Confirmar eliminar tutoria con id', id_tutoria);
    setIdTutoriaSeleccionada(id_tutoria);
    setOpenModalEliminar(true);
  }
  const handleEditarTutoriaModal = (tutoria) => {
    console.log('Editar tutoria de id ', tutoria.id);
    setTutoriaSeleccionadaEditar(tutoria);
    setOpenModalEditar(true);
  }
  const handleEditarTutoria = async (descripcion, modalidad, fecha, hora, horaFin, maxEstudiantes) => {
    console.log('Editar tutoria backend de id ', tutoriaSeleccionadaEditar.id);
    console.log("datos:", descripcion, modalidad, fecha, hora, horaFin, maxEstudiantes);
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/editar`, {
        id_tutoria: tutoriaSeleccionadaEditar.id,
        descripcion,
        modalidad,
        fecha,
        hora,
        horaFin,
        maxEstudiantes
      });
      console.log('Tutoria editada con éxito', response.data);
      await loadTutorias();
    } catch (error) {
      console.error('Error al editar tutoria:', error);
    }
  }
  
  return (
    <>
      {openModal && <ModalTutoria setOpenModal={setOpenModal} loadTutorias={loadTutorias} />}
      {openModalEliminar && <ConfirmarEliminarTutoriaModal setOpenModalEliminar={setOpenModalEliminar} handleEliminarTutoria={handleEliminarTutoria} />}
      {openModalEditar && <EditarTutoriaModal setOpenModalEditar={setOpenModalEditar} tutoria={tutoriaSeleccionadaEditar} handleEditarTutoria={handleEditarTutoria} />}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleCrearTutoria}>Crear tutoria</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora inicio</TableCell>
              <TableCell>Hora fin</TableCell>
              <TableCell>Modalidad</TableCell>
              <TableCell>Asignatura</TableCell>
              <TableCell>Precio por hora</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Alumnos</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tutorias.map((tutoria) => (
              <TableRow key={tutoria.id} sx={{ background: calcularEstado(tutoria) == 'Pendiente' ? '#98FB98' : '#FFC1C1' }}>
                <TableCell>{tutoria.fecha}</TableCell>
                <TableCell>{tutoria.hora}</TableCell>
                <TableCell>{tutoria.horafinal}</TableCell>
                <TableCell>{tutoria.modalidad}</TableCell>
                <TableCell>{tutoria.nombreasignatura}</TableCell>
                <TableCell>{tutoria.precioporhora}</TableCell>
                <TableCell>{calcularEstado(tutoria)}</TableCell>
                <TableCell>{tutoria.cantidadmaximaestudiantes}</TableCell>
                <TableCell>{tutoria.descripcion}</TableCell>
                <TableCell>
                  <IconButton><RemoveRedEyeIcon color='primary' /></IconButton>
                  <IconButton onClick={() => handleEditarTutoriaModal(tutoria)}><EditIcon color='success' /></IconButton>
                  <IconButton onClick={() => handleConfirmarEliminar(tutoria.id)}>
                    <DeleteIcon color='error' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default VerTutorias;
