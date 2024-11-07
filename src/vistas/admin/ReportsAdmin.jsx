import { useEffect, useState } from "react";
import { ROL } from "../../constants/rol";
import { IconButton, Select } from "@mui/material";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import DefaultTablePagination from "../../utils/defaultTablePaginations";
import _ from "lodash";
import LoadingComponent from "../../utils/LoadingComponente";
import { getReportesService } from "../../services/reportsService";
import ModalReport from "../../componentes/admin/modalReport";
import { REPORT_STATE } from "../../constants/reportState";

const ReportsAdmin = () => {
    const title = "Reportes";
    const [reports, setReports] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [openModalReport, setOpenModalReport] = useState(false);
    const [reportEdit, setReportEdit] = useState(null);
    const [estadosReportesSearch, setEstadosReportesSearch] = useState([REPORT_STATE.EN_PROCESO,REPORT_STATE.PENDIENTE]);
    const loadReports = async () => {
        console.log("Estado de los reportes:",estadosReportesSearch);
        try {
            const res = await getReportesService(searchValue, page,estadosReportesSearch);
            console.log("ejecuto load reports res:", res);
            setLoading(false);
            console.log(res.data.data);
            setReports(res.data.data);
            setTotalResults(Number(res.data.itemCount));
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        console.log("ejecuto useeffect");
        loadReports();
    }, [page, pageSize,estadosReportesSearch]);

    const handleChangePage = (pageAux, pageSizeAux) => {
        setPage(pageAux + 1);
        setPageSize(pageSizeAux);
    };
    const handleClickEdit = (dataIndex) => {
        console.log("dataIndex", dataIndex);
        const report = reports[dataIndex];
        console.log("report edit", report);
        setReportEdit(report);
        setOpenModalReport(true);
    }
   
    const columns = [
        {
            name: "id",
            label: "ID Reporte",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name:"estado",
            label:"Estado",
            options:{
                filter:true,
                sort:true,
            }
        },
        {
            name: "id_usuario_reporto",
            label: "ID Autor",
            options: {
                sort: true,
                filter: false,
            },
        },
        {
            name: "id_reportado",
            label: "ID Reportado",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "motivo",
            label: "Motivo",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "detalles",
            label: "Detalles",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "fecha_reporte",
            label: "Fecha de Reporte",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => {
                    return new Date(value).toLocaleDateString();
                }
            },
        },
        {
            name: "Options",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <>
                            <IconButton onClick={() => handleClickEdit(dataIndex)}>
                                <RemoveRedEye />
                            </IconButton>
                        </>
                    );
                },
            },
        },
    ];

    if (!reports) {
        return <LoadingComponent />;
    }
    const debouncedHandleSearchPlayers = _.debounce(async (value) => {
        console.log("searching:", value);
        if (value) {
            console.log("entro");
            await getReportesService(searchValue, page).then(
                res => {
                    console.log("data DEBOUNCED:", res.data);
                    setReports(res.data.data);
                    //setPageCount(res.data.pageCount);
                    setTotalResults(Number(res.data.itemCount));
                }).catch(error => {
                    console.error("error getUsersService() :", error);
                });
        } else {
            await getReportesService(searchValue, page).then(
                res => {
                    console.log("data DEBOUNCED:", res.data);
                    setReports(res.data.data);
                    //setPageCount(res.data.pageCount);
                    setTotalResults(Number(res.data.itemCount));
                }).catch(error => {
                    console.error("error getUsersService() :", error);
                });
        }
    }, 300);
    const handleSearch = async (searchText) => {
        console.log("searchText:", searchText);
        setSearchValue(searchText);
        debouncedHandleSearchPlayers(searchText);
    }
    return (
        <>
            <div>
                <h1>{title}</h1>
            </div>
            <DefaultTablePagination
                title="Reportes"
                data={reports}
                columns={columns}
                page={page}
                pageSize={pageSize}
                itemCount={totalResults}
                handleChangePage={handleChangePage}
                searchText={searchValue}
                handleSearch={handleSearch}
                loading={loading}
                filter={false}
                customToolbar={
                    ()=>{
                        return (
                            <div>
                                <Select
                                    native
                                    value={estadosReportesSearch}
                                    onChange={(e) => {
                                        setEstadosReportesSearch(e.target.value);
                                    }}
                                >
                                    <option value={[REPORT_STATE.EN_PROCESO]}>{REPORT_STATE.EN_PROCESO}</option>
                                    <option value={[REPORT_STATE.PENDIENTE]}>{REPORT_STATE.PENDIENTE}</option>
                                    <option value={[REPORT_STATE.RESUELTO]}>{REPORT_STATE.RESUELTO}</option>
                                    <option value={[REPORT_STATE.EN_PROCESO,REPORT_STATE.PENDIENTE]}>{REPORT_STATE.EN_PROCESO} o {REPORT_STATE.PENDIENTE}</option>
                                </Select>
                            </div>
                        );
                    }
                }
            />
            {
                openModalReport && <ModalReport
                    open={openModalReport}
                    setOpen={setOpenModalReport}
                    report={reportEdit}
                    renderFunction={loadReports}
                />
            }
        </>
    )
}

export default ReportsAdmin;