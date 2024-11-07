// src/components/VerTutorias.js
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Icon, Box, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalTutoria from './crearTutoria';
import axios from 'axios';
import ConfirmarEliminarTutoriaModal from './confirmarEliminarTutoriaModal';
import EditarTutoriaModal from './editarTutoriaModal';
import { useSnackContext } from '../../../context/SnackContext';
import { sendEmail } from '../../../utils/sendEmail';
import { getUserService } from '../../../services/usersServices';
import { useUserContext } from '../../../context/UserContext';

function VerTutorias() {
  const [openModal, setOpenModal] = useState(false);
  const [tutorias, setTutorias] = useState([]); // Añade un nuevo estado para almacenar las tutorias
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [idTutoriaSeleccionada, setIdTutoriaSeleccionada] = useState(null);
  const [tutoriaSeleccionadaEditar, setTutoriaSeleccionadaEditar] = useState(null);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const {openSnack} = useSnackContext();
  const { userInfo } = useUserContext();
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
    try {
      const id_tutor = userInfo.id;
      const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/lista/tutorias`, { id_tutor });
      console.log("load tutorias:",res.data);
      setTutorias(res.data);
    } catch (error) {
      console.error('Error al cargar tutorias:', error);
    }
  }
  useEffect(() => {
    loadTutorias();
  }, []);
  const handleEliminarTutoria = async () => {
    try{
      console.log('Eliminar tutoria de id', idTutoriaSeleccionada);
      const res = await axios.delete(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/eliminar/${idTutoriaSeleccionada}`);
      console.log(res.data);
      setOpenModalEliminar(false);
      const tutoriaEliminada = tutorias.find(tutoria => tutoria.id === idTutoriaSeleccionada);
      if (!tutoriaEliminada) {
        console.error('No se encontró la tutoria con id', idTutoriaSeleccionada);
        openSnack('Error al eliminar tutoria', 'error');
        return;
      }
      console.log('Tutoria eliminada:', tutoriaEliminada);
      const id_estudiante = tutoriaEliminada.id_estudiante;
      const estudianteAfectadoData = await getUserService(id_estudiante);
      const estudianteAfectado = estudianteAfectadoData.data;
      console.log("res:", res);
      const { correo, nombre } = estudianteAfectado;
      console.log("correo:", correo);
      // estudiantes datos
      const correoEstudianteAyudado = correo;
      const nombreEstudiante = nombre;
      // tutorias datos
      const fechaTutorial = tutoriaEliminada.fecha;
      const horaInicioTutorial = tutoriaEliminada.hora;
      const horaFinTutorial = tutoriaEliminada.horafinal;
      const precioPorHora = tutoriaEliminada.precioporhora;
      const descripcion = tutoriaEliminada.descripcion;
      const modalidad = tutoriaEliminada.modalidad;
      const codigo_asignatura = tutoriaEliminada.codigoasignatura;
      const nombreTutor = userInfo.nombre;
      const msjEmailEnviarEstudiante = `Hola ${nombreEstudiante},\n\nSe ha eliminado una tutoría contigo para la asignatura ${codigo_asignatura}.\n\nFecha: ${fechaTutorial}\nHora de inicio: ${horaInicioTutorial}\nHora de fin: ${horaFinTutorial}\nModalidad: ${modalidad}\nPrecio por hora: $${precioPorHora}\nDescripción: ${descripcion}\n\nTutor: ${nombreTutor}\n\nSaludos,\nSwifty.`;
      await sendEmail(correoEstudianteAyudado, 'Tutoría eliminada', msjEmailEnviarEstudiante);
      await loadTutorias();
      openSnack('Tutoria eliminada con éxito', 'success');
    }catch(error){
      console.error('Error al eliminar tutoria:', error);
      openSnack('Error al eliminar tutoria', 'error');
    }
    //enviar email
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
  const handleEditarTutoria = async (descripcion, modalidad, fecha, hora, horaFin, maxEstudiantes,precioHora) => {
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
        maxEstudiantes,
        precioHora
      });
      console.log('Tutoria editada con éxito', response.data);
      openSnack('Tutoria editada con éxito', 'success');
      console.log("tutoria editada:",JSON.stringify(tutoriaSeleccionadaEditar));
      const tutoriaData = tutoriaSeleccionadaEditar;
      /*
      tutoria editada: {
      "id":73,"hora":"14:35","fecha":"2024-10-15","codigoasignatura":"CS101","descripcion":"das",
      "precioporhora":213,"modalidad":"presencial","id_estudiante":"b25eedfa","id_tutor":"20bd9126",
      "cantidadmaximaestudiantes":2,"horafinal":"15:35","nombreasignatura":"Calculo",
      "nombre_estudiante":"cba"}
      */
      const id_estudiante = tutoriaData.id_estudiante;
      const estudianteData = await getUserService(id_estudiante);
      const estudiante = estudianteData.data;
      console.log("estudiante:", estudiante);
      const { correo, nombre } = estudiante;
      console.log("correo:", correo);
      // estudiantes datos
      const correoEstudianteAyudado = correo;
      const nombreEstudiante = nombre;
      // tutorias datos
      const fechaTutorial = tutoriaData.fecha;
      const horaInicioTutorial = tutoriaData.hora;
      const horaFinTutorial = tutoriaData.horafinal;
      const precioPorHora = tutoriaData.precioporhora;
      const descripcion2 = tutoriaData.descripcion;
      const modalidad2 = tutoriaData.modalidad;
      const codigo_asignatura = tutoriaData.codigoasignatura;
      const nombreTutor = userInfo.nombre;
      const msjEmailEnviarEstudiante = `Hola ${nombreEstudiante},\n\nSe ha editado una tutoría contigo para la asignatura ${codigo_asignatura}.\n\nFecha: ${fechaTutorial}\nHora de inicio: ${horaInicioTutorial}\nHora de fin: ${horaFinTutorial}\nModalidad: ${modalidad2}\nPrecio por hora: $${precioPorHora}\nDescripción: ${descripcion2}\n\nTutor: ${nombreTutor}\n\nSaludos,\nSwifty.`;
      await sendEmail(correoEstudianteAyudado, 'Tutoría editada', msjEmailEnviarEstudiante);
      setOpenModalEditar(false);
      await loadTutorias();
    } catch (error) {
      console.error('Error al editar tutoria:', error);
      if(error?.response?.status === 409){
        openSnack('Error al editar tutoria: Ya esta ocupado la fecha y clave', 'error');
      }else{
        openSnack('Error al editar tutoria', 'error');
      }
    }
  }

  return (
    <>
      {openModal && <ModalTutoria setOpenModal={setOpenModal} loadTutorias={loadTutorias} />}
      {openModalEliminar && <ConfirmarEliminarTutoriaModal setOpenModalEliminar={setOpenModalEliminar} handleEliminarTutoria={handleEliminarTutoria} />}
      {openModalEditar && <EditarTutoriaModal setOpenModalEditar={setOpenModalEditar} tutoria={tutoriaSeleccionadaEditar} handleEditarTutoria={handleEditarTutoria} />}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' ,pb:2}}>
        <Button
          onClick={handleCrearTutoria}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark'
            },
            padding: '10px 20px',
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Crear tutoria
        </Button>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 'bold'}}  gutterBottom>
        Los estudiantes a los que les hayas aceptado la solicitud podrán ser agregados a tus tutorías creadas.
      </Typography>
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
              <TableCell>Estudiante</TableCell>
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
                <TableCell>{tutoria.nombre_estudiante}</TableCell>
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
