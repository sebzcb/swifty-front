import { useEffect, useState } from "react";
import { getUsersService } from "../../services/usersServices";
import { DIRECTION, ORDER } from "../../constants/filters";
import { ROL } from "../../constants/rol";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DefaultTablePagination from "../../utils/defaultTablePaginations";
import DeleteModalUserAdmin from "../../componentes/admin/deleteModalAdmin";
import EditModalAdmin from "../../componentes/admin/editModalAdmin";
import _ from "lodash";
import LoadingComponent from "../../utils/LoadingComponente";

const TutoresAdmin = () => {
    const rolUse = ROL.TUTOR;
    const title = "Tutores";
    const [users, setUsers] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [userDelete, setUserDelete] = useState(null);

    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [userEdit, setUserEdit] = useState(null);
    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsersService(searchValue, page, ORDER.VALORACION, DIRECTION.DESC, {}, rolUse);
            console.log("ejecuto load users res:", res);
            setLoading(false);
            console.log(res.data.data);
            setUsers(res.data.data);
            setTotalResults(Number(res.data.itemCount));
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("ejecuto useeffect");
        loadUsers();
    }, [page, pageSize]);

    const handleChangePage = (pageAux, pageSizeAux) => {
        setPage(pageAux + 1);
        setPageSize(pageSizeAux);
    };

    const getRol = (user) => {
        if (user.id_administrador) {
            return ROL.ADMINISTRADOR;
        } else if (user.id_tutor) {
            return ROL.TUTOR;
        } else {
            return ROL.ESTUDIANTE;
        }
    };
    const handleClickDelete = async (dataIndex) => {
        console.log("dataIndex", dataIndex);
        const user = users[dataIndex];
        console.log("user delete", user);
        setUserDelete(user);
        setOpenModalDelete(true);
    }
    const handleClickEdit = (dataIndex) => {
        console.log("dataIndex", dataIndex);
        const user = users[dataIndex];
        console.log("user edit", user);
        setUserEdit(user);
        setOpenModalEdit(true);
    }
    const columns = [
        {
            name: "id",
            label: "ID",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "nombre",
            label: "Nombre",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "correo",
            label: "Email",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "id_rol",
            label: "Rol",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const user = users[tableMeta.rowIndex];
                    return getRol(user);
                }
            }
        },
        {
            name: "genero",
            label: "Genero",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "universidad",
            label: "Universidad",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "telefono",
            label: "Telefono",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "Opciones",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <>
                            <IconButton onClick={() => handleClickEdit(dataIndex)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleClickDelete(dataIndex)}>
                                <Delete />
                            </IconButton>
                        </>
                    );
                },
            },
        },
    ];

    if (!users) {
        return <LoadingComponent />;
    }
    const debouncedHandleSearchPlayers = _.debounce(async (value) => {
        console.log("searching:", value);
        if (value) {
            console.log("entro");
            await getUsersService(searchValue, page, ORDER.VALORACION, DIRECTION.DESC, {}, rolUse).then(
                res => {
                    console.log("data DEBOUNCED:", res.data);
                    setUsers(res.data.data);
                    //setPageCount(res.data.pageCount);
                    setTotalResults(Number(res.data.itemCount));
                }).catch(error => {
                    console.error("error getUsersService() :", error);
                });
        } else {
            await getUsersService("", page, ORDER.VALORACION, DIRECTION.DESC, {}, rolUse).then(
                res => {
                    console.log("data DEBOUNCED:", res.data);
                    setUsers(res.data.data);
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
                title="Users"
                data={users}
                columns={columns}
                page={page}
                pageSize={pageSize}
                itemCount={totalResults}
                handleChangePage={handleChangePage}
                searchText={searchValue}
                handleSearch={handleSearch}
                loading={loading}
                filter={false}
            />
            {
                openModalDelete &&
                <DeleteModalUserAdmin open={openModalDelete} setOpen={setOpenModalDelete} username={userDelete?.nombre} id={
                    userDelete?.id
                } renderFunction={loadUsers} />
            }
            {
                openModalEdit &&
                <EditModalAdmin open={openModalEdit} setOpen={setOpenModalEdit} username={userEdit?.nombre} id={userEdit?.id} rol={getRol(userEdit)} renderFunction={loadUsers} />
            }
        </>
    )
}

export default TutoresAdmin;