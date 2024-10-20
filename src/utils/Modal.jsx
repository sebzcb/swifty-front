import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import useIsMobile from '../utils/useIsMobile';
import { useEffect, useState } from 'react';
/*
Example:
       <CustomModal
          open={open}
          title="Título del diálogo"
          actions={{
            onCancel: ()=>setOpen(false),
            onSave: () => {
              console.log('Guardar');
              setOpen(false);
            },
            buttons: (
              <>
                <Button
                  onClick={() => setOpen(false)}
                >
                  Cerrar
                </Button>
              </>
            )
          }}
        >
          Contenido del diálogo
        </CustomModal>
*/
//30vw
//80vh
const CustomModal = ({ children, open, title, actions }) => {
  const isMobile = useIsMobile();
  const[customWidth,setCustomWidth]=useState("30vw");
  const[customHeight,setCustomHeight]=useState(null);
  useEffect(() => {
      if(isMobile){
          setCustomWidth("auto");
          setCustomHeight("auto");
          return;
      }
      setCustomWidth("30vw");
      setCustomHeight(null);
  }, [isMobile]);
  // Botones predeterminados
  const defaultButtons = (
    <>
      <Button
        startIcon={<CancelIcon />}
        onClick={actions.onCancel}
      >
        Cancelar
      </Button>
      <Button
        startIcon={<SaveIcon />}
        onClick={actions.onSave}
        variant="contained"
        color="primary"
      >
        Guardar
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={actions.onCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      sx={{ textAlign: 'center' }}
    >

      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent sx={{ width: customWidth, height: customHeight }}>
        {children}
      </DialogContent>
      <DialogActions>
        {actions.buttons || defaultButtons}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;

CustomModal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    buttons: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func,
  }).isRequired,
  customWidth: PropTypes.string,
  customHeight: PropTypes.string
};
