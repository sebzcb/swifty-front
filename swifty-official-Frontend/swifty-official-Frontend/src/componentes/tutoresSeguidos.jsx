import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';

const tutores = [
  { name: 'Swifty Tutoring', description: 'Mathematics Expert' },
  { name: 'John Doe', description: 'Physics Tutor' },
  { name: 'Jane Smith', description: 'English Literature Tutor' },
  { name: 'Alex Johnson', description: 'Chemistry Tutor' },
  { name: 'Recently Viewed Tutors', description: 'Lorem ipsum' },
];

const TutoresSeguidos = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Tutores Seguidos</Typography>
        <List>
          {tutores.map((tutor) => (
            <ListItem key={tutor.name}>
              <Avatar />
              <ListItemText primary={tutor.name} secondary={tutor.description} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TutoresSeguidos;
