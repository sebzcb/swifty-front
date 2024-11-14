import { useEffect, useState } from "react";
import { getClavesService } from "../../services/horariosServices";
import CustomModal from "../../utils/Modal";

const ModalAyudaHorario = ({ open, setOpen }) => {
    const [claves, setClaves] = useState(null);
    const loadHorarioClaves = () => {
        getClavesService().then((response) => {
            setClaves(response.data);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });
    }
    useEffect(() => {
        loadHorarioClaves();
    }, []);
    return(
        <CustomModal
            open={open}
            setOpen={setOpen}
            title="Ayuda"
            actions={
                {
                    onCancel: () => setOpen(false)
                }
            }
        >
            <p>Los colores representan:</p>
            <ul>
                <li><strong>Verde:</strong> Horario disponible</li>
                <li><strong>Rojo:</strong> Horario ocupado</li>
            </ul>
            <p>Las claves son:</p>
            {
                claves && Object.keys(claves).map((clave) => (
                    <p key={clave}>
                        <strong>{clave}:</strong> {claves[clave].inicio} - {claves[clave].fin}
                    </p>
                ))
            }
        </CustomModal>
        
    );
}
export default ModalAyudaHorario;