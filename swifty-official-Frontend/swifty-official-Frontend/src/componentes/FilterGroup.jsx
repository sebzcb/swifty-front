import { Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchContext } from "../context/searchContext";

const FilterGroup = ({ items, name, filterType }) => {
    const { addFilter, removeFilter, dataShow } = useSearchContext();

    const handleCheck = (e) => {
        console.log("item:", filterType);
        const id = e.target.value;
        console.log("ID:", id);
        const checked = e.target.checked;

        console.log("Type Category:", filterType);

        if (checked) {
            console.log("Adding filter:", filterType, id);
            addFilter(filterType, id);
        } else {
            console.log("Removing filter:", filterType, id);
            removeFilter(filterType, id);
        }
    };
    const getName = (item) => {
        if (filterType === "universidades") {
            return item.nombre;
        } else if (filterType === "asignaturas") {
            return item.nombreasignatura;
        }else if (filterType === "valoraciones") {
            return item.nombre;
        }
    };
    const getItemId = (item) => {
        if (filterType === "universidades") {
            return item.id;
        } else if (filterType === "asignaturas") {
            return item.codigo;
        } else if (filterType === "valoraciones") {
            return item.id;
        }
    };
    return (
        <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h3">{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup>
                    {items.map((item, index) => {
                        let isChecked = false;
                        if (filterType === "universidades") {
                            isChecked = dataShow.filters[filterType]?.includes(item.id.toString());
                        } else if (filterType === "asignaturas") {
                            isChecked = dataShow.filters[filterType]?.includes(item.codigo?.toString());
                        }else if (filterType === "valoraciones") {
                            isChecked = dataShow.filters[filterType]?.includes(item.id.toString());
                        }
                        return (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        value={getItemId(item)}
                                        checked={isChecked}
                                        onChange={(e) => handleCheck(e)}
                                    />
                                }
                                label={getName(item)}
                            />
                        );
                    })}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
};

export default FilterGroup;
