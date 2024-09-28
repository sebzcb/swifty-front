import { Card, CardContent, CardMedia, Box, Typography, Button, Rating } from '@mui/material';
import { minHeight, styled } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import perfil from '../assets/perfil.jpg';
import useIsMobile from '../utils/useIsMobile';

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
    <StyledCard onClick={onClick}>
      {
        !isMobile &&
        <StyledCardMedia
          component="img"
          alt="Tutor"
          image={perfil}
          title="Tutor"
          sx={{ minWidth: '50px', minHeight: '50px' }}
        />
      }
      <StyledCardContent>
        <Typography variant="h5" component="div">
          {nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {descripcion}
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" display={'flex'} alignItems={'center'} gap={'10px'} sx={{ marginBottom: '10px' }}>
              <SchoolIcon /> {universidad}
            </Typography>
            <Box sx={{ display: 'flex', gap: '5px' }}>
              {asignaturas?.map((asignatura, index) => (
                <Button variant="outlined" size="small" key={index}>{asignatura}</Button>
              ))}
            </Box>
          </Box>
          <Box textAlign="right">
            <Rating value={valoracion} readOnly precision={0.5} />
            <Typography variant="body2">Recomendado</Typography>
            {precioPorHora ? <Typography variant="h6">Desde {precioPorHora}$/hora</Typography> : <Typography variant="h6"> Sin tutorias </Typography>}
            <StyledButton variant="contained" color="primary">Solicitar tutoría</StyledButton>
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TutorCard;
