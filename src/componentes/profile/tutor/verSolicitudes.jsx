import  { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SolicitudTutoriaModal from '../../solicitudTutoriaModal';
import axios from 'axios';

function VerSolicitudes() {
  const [openModal, setOpenModal] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState({});
  const handleClick = (solicitud) => {
    setSolicitudSeleccionada({
      id: solicitud.id,
      nombre: solicitud.nombre_estudiante,
      asignaturaElegida: solicitud.nombreasignatura,
      modalidad: solicitud.modalidad,
      fecha: solicitud.fecha,
      hora: solicitud.hora,
      descripcion: solicitud.descripcion
    });
    setOpenModal(true);
  }

  const renderSolicitudes = async () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    const idUsuario = usuarioLocal.id;
    console.log('ID Usuario:', idUsuario);
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/solicitudes`, { id_tutor: idUsuario });
    console.log(response.data);
    setSolicitudes(response.data);
  }
  useEffect(() => {
    console.log('Solicitud de tutoría');
    renderSolicitudes();
  }, []);

  return (
    <>
      {openModal && <SolicitudTutoriaModal setOpenModal={setOpenModal} {...solicitudSeleccionada} renderSolicitudes={renderSolicitudes}/>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asignatura</TableCell>
              <TableCell>Modalidad</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell>{solicitud.nombreasignatura}</TableCell>
                <TableCell>{solicitud.modalidad}</TableCell>
                <TableCell>{solicitud.fecha}</TableCell>
                <TableCell>{solicitud.hora}</TableCell>
                <TableCell>{solicitud.estado}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClick(solicitud)}>
                    <RemoveRedEyeIcon />
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

export default VerSolicitudes;
