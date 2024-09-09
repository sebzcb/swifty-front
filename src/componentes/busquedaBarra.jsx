import { useState, useEffect } from 'react';
import { IconButton, InputBase, Paper } from "@mui/material";
import axios from "axios";
import { useSearchContext } from '../context/searchContext';
import SearchIcon from '@mui/icons-material/Search';

const BusquedaBarra = ({ isHomePage, filtros, order }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { updateSearchParams } = useSearchContext(); // Agrega esta línea
    //enviarlos al context
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("======== Escribes y buscas:", searchTerm, "======== "); // Modifica esta línea
        updateSearchParams({ keyword: searchTerm }); // Agrega esta línea
    };
    /*
    const handleSearch = () => {
        const data = [
            {
                "type": "asignatura",
                "ids": filtros?.asignatura
            },
            {
                "type": "universidades",
                "ids": filtros?.universidades
            },
            {
                "type": "valoracion",
                "ids": filtros?.valoracion
            }
        ];
        const orderData = {
            "mayorValoracion": order?.mayorValoracion,
            "menorPrecio": order?.menorPrecio
        }
        console.log("FILTROS:", filtros);
        console.log("order:", orderData)
        const urlBase = import.meta.env.VITE_BACK_URL;
        axios.post(`${urlBase}usuario/lista/usuarios`, {
            palabra: searchTerm,
            filters: data,
            order: orderData
        })
            .then(response => {
                setSearchResults(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }*/
/*
    useEffect(() => {
        handleSearch();
    }, [order, filtros]);
*/
    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '30px'
                , bgcolor: 'grey.900'
            }}
        >
            <IconButton type="button" sx={{ p: '10px', color: 'background.default' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1, color: 'background.default' }}
                placeholder="Search something!"
                inputProps={{ 'aria-label': 'search google maps' }}
                value={searchTerm} // Agrega esta línea
                onChange={e => setSearchTerm(e.target.value)} // Agrega esta línea
            />
        </Paper>
    );
}

export default BusquedaBarra;
