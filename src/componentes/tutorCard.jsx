import { Card, CardContent, CardMedia, Box, Typography, Button, Rating, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import perfil from '../assets/perfil.jpg';
import useIsMobile from '../utils/useIsMobile';
import { deepOrange } from '@mui/material/colors';

const StyledCard = styled(Card)({
  marginBottom: '20px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  borderRadius: '10px',
  display: 'flex', // Agrega esto
});

const StyledCardMedia = styled(CardMedia)({
  height: '250px',
  width: '250px',
  objectFit: 'cover',
  borderRadius: '10px 10px 0 0',
  flex: '1 0 auto', // Agrega esto
});

const StyledCardContent = styled(CardContent)({
  padding: '20px',
});

const StyledButton = styled(Button)({
  marginTop: '10px',
});

const TutorCard = ({ nombre, descripcion, universidad, precioPorHora, valoracion, asignaturas, onClick }) => {
  const isMobile = useIsMobile();
  return (
    <StyledCard onClick={onClick} sx={{display:'flex'}}>
      {
        !isMobile &&
        <Avatar sx={{ bgcolor: deepOrange[500], width: 150, height: 150 }}>
          {nombre[0]}
        </Avatar>
      }
      <StyledCardContent sx={{width:'100%'}}>
        <Typography variant="h5" component="div">
          {nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {descripcion}
        </Typography>
        <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{ flex: '1 1 auto' }}> {/* Asegura que el primer Box ocupe el espacio disponible */}
            <Typography variant="body2" display={'flex'} alignItems={'center'} gap={'10px'} sx={{ marginBottom: '10px' }}>
              <SchoolIcon /> {universidad}
            </Typography>
            <Box sx={{ display: 'flex', gap: '5px' }}>
              {asignaturas?.map((asignatura, index) => (
                <Button variant="outlined" size="small" key={index}>{asignatura}</Button>
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right', flex: '0 0 auto' }}> {/* Asegura que el segundo Box no se expanda */}
            <Rating value={valoracion} readOnly precision={0.5} />
            <Typography variant="body2">Recomendado</Typography>
            <StyledButton variant="contained" color="primary">Ver Perfil</StyledButton>
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TutorCard;
