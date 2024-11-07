import { useState, useEffect } from 'react';
import { Card, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HorarioVer from './horarioVer';
import EditarHorario from './editarHorario';
import Rating from '@mui/material/Rating';
import { CLAVES } from '../../constants/claves';
import { getWeekNumber } from '../../utils/getWeeNumber';
import { useUserContext } from '../../context/UserContext';

const Horario = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioExterno, setUsuarioExterno] = useState(false);
  const { idUsuario } = useParams();
  const [horarioOcupado, setHorarioOcupado] = useState(null);
  const [open, setOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]); // Estado para almacenar los comentarios
  //horarios
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [week, setWeek] = useState(getWeekNumber(new Date()));
  const { userInfo } = useUserContext();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    obtenerUsuarioYHorario();
  }
  const handleSave = () => {
    // Filtrar los días y horas marcados en rojo
    const horariosOcupados = [];
    data.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        if (color === 'red') {
          horariosOcupados.push({ dia: days[colIndex], hora: times[rowIndex] });
        }
      });
    });

    console.log('Días y horas marcados en rojo:', horariosOcupados);
    // Aquí puedes enviar `horariosOcupados` al backend
    axios.put(`${import.meta.env.VITE_BACK_URL}horario/${idUsuario}`,
      { horario: horariosOcupados })
      .then(response => console.log('Horario actualizado:', response))
      .then(() => handleClose())
      .catch(error => console.error('Error al actualizar el horario:', error));
  };

  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const clavesArray = Object.keys(CLAVES);
  const times = clavesArray;
  const [data, setData] = useState(null);

  const handleCircleClick = (rowIndex, colIndex) => {
    const newData = data.map((row, rIdx) =>
      row.map((color, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return color === 'green' ? 'red' : 'green';
        }
        return color;
      })
    );
    setData(newData);
  };

  const esHorarioOcupado = (indiceDia, hora) => {
    const diasCompletos = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const diaCompleto = diasCompletos[indiceDia];
    const ocupado = horarioOcupado?.find((element) => {
      return element.dia === diaCompleto && element.hora === hora;
    });
    return ocupado == null;
  };
  useEffect(() => {
    if (!horarioOcupado) return;
    const initialData = times.map(
      (time) => days.map((day, index) => (esHorarioOcupado(index, time) ? 'green' : 'red'))
    );
    console.log("initial:", initialData);
    setData(initialData);
  }, [horarioOcupado]);

  const obtenerUsuarioYHorario = async () => {
    try {
      const usuarioLocal = userInfo;
      if (usuarioLocal && usuarioLocal.id === idUsuario) {
        setUsuario(usuarioLocal);
        setUsuarioExterno(false);
      } else {
        const responseUsuario = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${idUsuario}`);
        if (responseUsuario.status !== 200) {
          throw new Error('Hubo un problema al obtener el usuario.');
        }
        setUsuario(responseUsuario.data);
        setUsuarioExterno(true);
      }
/*
      const responseHorario = await axios.get(`${import.meta.env.VITE_BACK_URL}horario/${idUsuario}`);
      if (responseHorario.status !== 200) {
        throw new Error('Hubo un problema al obtener el horario.');
      }
      const dataHorario = responseHorario.data;
      console.log('Horario del usuario:', dataHorario);
      setHorarioOcupado(dataHorario);*/
      /*
            const initialData = times.map(
              (time) => days.map((day, index) => (esHorarioOcupado(index, time) ? 'green' : 'red'))
            );
            setData(initialData);*/
    } catch (error) {
      console.error('Hubo un problema al obtener datos:', error);
    }
  };
  const loadHorario = async () => {
    try {
      const responseHorario = await axios.get(`${import.meta.env.VITE_BACK_URL}horario/${idUsuario}/week/${week}/year/${añoSeleccionado}`);
      if (responseHorario.status !== 200) {
        throw new Error('Hubo un problema al obtener el horario.');
      }
      const dataHorario = responseHorario.data;
      console.log('Horario del usuario:', dataHorario);
      setHorarioOcupado(dataHorario);
    } catch (error) {
      console.error('Hubo un problema al obtener datos:', error);
    }
  }
  useEffect(() => {
    console.log("==========00000 RECARGADO HORARIO ============0")
    loadHorario();
  }, [week]);
  useEffect(() => {
    console.log("==========00000 RECARGADO HORARIO ============0")

    const asyncFunction = async () => {
      await obtenerUsuarioYHorario();
      await loadHorario();
    }
    asyncFunction()
  }, [idUsuario]);

  useEffect(() => {
    const obtenerComentarios = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/comentarios`, {
          id_tutor: usuario?.id_tutor
        });
        if (response.status !== 200) {
          throw new Error('Hubo un problema al obtener los comentarios.');
        }
        const data = response.data;
        console.log('Respuesta de comentarios:', data); // Imprimir la respuesta de la petición
        setComentarios(data);
      } catch (error) {
        console.error('Hubo un problema al obtener los comentarios:', error);
      }
    };

    if (usuario?.id_tutor) {
      obtenerComentarios();
    }
  }, [usuario?.id_tutor]);

  return (
    <>
      <Card>
        <HorarioVer data={data} handleOpen={handleOpen} usuario={usuario} days={days} times={times} 
        esHorarioOcupado={esHorarioOcupado} setAñoSeleccionado={setAñoSeleccionado} añoSeleccionado={añoSeleccionado}
        week={week} setWeek={setWeek}
        />
      </Card>

      {/* Sección para mostrar comentarios y calificaciones */}
      {comentarios.length > 0 && (
        <Card sx={{ marginTop: 2 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Comentarios y Calificaciones</Typography>
          {comentarios.map((comentario, index) => (
            <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>{comentario.nombre}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>{comentario.comentario}</Typography>
              <Rating name={`rating-${index}`} value={comentario.calificacion} readOnly />
            </Paper>
          ))}
        </Card>
      )}

      <EditarHorario data={data} handleCircleClick={handleCircleClick} open={open} handleClose={handleClose} handleSave={handleSave} horarioOcupado={horarioOcupado} times={times} days={days} />
    </>
  );
};

export default Horario;
