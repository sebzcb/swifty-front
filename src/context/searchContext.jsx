import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getUsersService } from "../services/usersServices";

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filtersReseted, setFiltersReseted] = useState(false);
  const DIRECTION = {
    DESC: 'desc',
    ASC: 'asc'
  };
  const ORDER = {
    VALORACION: 'valoracion',
    PRICE: 'price'
  };
  const getFilters = ( filtersReseted = false) => {
    const searchParams = new URLSearchParams(window.location.search);
    const filterKeys = ['universidades', 'asignaturas', 'valoraciones'];
    const filters = {};
  
    filterKeys.forEach(key => {
      console.log("Key:", key);
      filters[key] = filtersReseted ? [] : (searchParams.get(key)?.split(',').filter(Boolean) || []);
    });
  
    return filters;
  };
  const [loading, setLoading] = useState(false);
  const [dataShow, setDataShow] = useState(() => {
    const filters = getFilters(filtersReseted);
    return {
      keyword: '',
      page: 1,
      order: ORDER.VALORACION,
      direction: DIRECTION.DESC,
      pageCount: 0,
      totalResults: 0,
      filters: filters
    };
  });
  const [shouldUpdateParams, setShouldUpdateParams] = useState(false);
  useEffect(() => {
    if (searchResults.length === 0 && !isFiltersEmpty()) {
      console.log("Reset filters");
      setFiltersReseted(true);
    }
  }, [searchResults]);
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
  }, [searchParams]);
  useEffect(() => {
    //true cuando se actualizan los filtros
    if (shouldUpdateParams) {
      console.log(" == se actualizan los filtros == ");

      updateSearchParams({filters:dataShow.filters});
    }
  }, [dataShow, shouldUpdateParams]);
  const isFiltersEmpty = () => {
    for (const key in dataShow.filters) {
      if (dataShow.filters[key].length > 0) {
        return false;
      }
    }
    return true;
  };
  const search = async () => {
    console.log("========  se ejecuta search ========= ");
    setLoading(true);
    const { keyword, page, order, direction, filters } = getSearchParams();
    if (filtersReseted) {
      console.log("BUSQUEDA CON FILTROS RESETEADOS");
      setFiltersReseted(false);
    }
    console.log("Keyword:", keyword);
    try {
      /*const response = await axios.post(`${urlBase}usuario/lista/usuarios?keyword=${keyword}&page=${page}&limit=9&orderBy=${order}&direction=${direction}`, {
        filters: filters
      });*/
      const response = await getUsersService(keyword, page, order, direction, filters);
      const res = response.data;
      console.log("Search results:", res);
      setSearchResults(res.data);
      setDataShow({
        keyword,
        page,
        order,
        direction,
        pageCount: res.pageCount,
        totalResults: res.itemCount,
        filters: filters
      });
      if (res.data.length === 0) {
        console.log("No se encontraron resultados");
      }
      console.log("========  Resultados obtenidos ========= ");
      setShouldUpdateParams(false);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  };
  const getSearchParams = () => {
    return {
      keyword: searchParams.get('keyword') || '',
      page: parseInt(searchParams.get('page')) || 1,
      order: searchParams.get('order') || ORDER.VALORACION,
      direction: searchParams.get('direction') || DIRECTION.DESC,
      filters: getFilters(filtersReseted)
    };
  };
  const updateSearchParams = (params, navigateToUrl = true) => {
    const newFilters = params.filters || getFilters(filtersReseted);
    console.log("========= filteers generico: ", newFilters);
    console.log("========= se ejecuta updateSearchParams ========= ");
  
    // Crear un objeto con todos los parámetros
    const allParams = {
      keyword: params.keyword || searchParams.get('keyword') || '',
      page: params.page || searchParams.get('page') || 1,
      limit: params.pageSize || 9,
      order: params.order || searchParams.get('order') || ORDER.VALORACION,
      direction: params.direction || searchParams.get('direction') || DIRECTION.DESC,
      ...newFilters
    };
  
    // Filtrar los parámetros vacíos y arrays vacíos
    const filteredParams = Object.fromEntries(
      Object.entries(allParams).filter(([key, value]) => value !== '' && !(Array.isArray(value) && value.length === 0))
    );
  
    const newSearchParams = new URLSearchParams(filteredParams);
  
    if (navigateToUrl) {
      console.log("========  se redirige a url nueva ========= ");
      navigate(`/search?${newSearchParams.toString()}`);
    }
  };
  
  
  const addFilter = (filterName, filterValue) => {
    setDataShow({
      ...dataShow,
      filters: {
        ...dataShow.filters,
        [filterName]: [...dataShow.filters[filterName], filterValue]
      }
    });
    setShouldUpdateParams(true);
  };

  const removeFilter = (filterName, filterValue) => {
    setDataShow({
      ...dataShow,
      filters: {
        ...dataShow.filters,
        [filterName]: dataShow.filters[filterName].filter(value => value !== filterValue)
      }
    });
    setShouldUpdateParams(true);
  };
  return (
    <SearchContext.Provider value={{
      searchResults,
      loading,
      dataShow,
      setDataShow,
      search,
      addFilter,
      removeFilter,
      updateSearchParams,
      DIRECTION,
      ORDER,
      searchParams,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};

/*
//busqueda por keyword
1. Escribes y buscas
1.2. Se ejecuta el updateSearchParams
2. Redirige a url
3. Se ejecuta el useEffect en pagina de resultados search()
4. actualiza el estado de searchResults
5. muestra los resultados

//ordenamiento
1. Selecciona ordenamiento
2. Se ejecuta el handleSelectOrder
3. Se ejecuta el updateSearchParams
4. Redirige a la url con los nuevos parametros
5. Se ejecuta el useEffect en pagina de resultados search()
6. actualiza el estado de searchResults
7. muestra los resultados

//filtros
1. Selecciona filtro 
2. Se ejecuta el handleCheck
3. Se ejecuta el addFilter(x)
4. Se ejecuta el updateSearchParams(x)
5. Redirige a la url con los nuevos parametros(x)
6. Se ejecuta el useEffect en pagina de resultados search()(x)
7. actualiza el estado de searchResults (x)
8. muestra los resultados
9. Si no hay resultados se resetean los filtros
*/