import { Box, Container, Drawer, IconButton, Typography } from "@mui/material";
import { People, Code, Report } from '@mui/icons-material';
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const drawerWidth = 240;
import './admin.css';
import Navbar from "../componentes/navBar";

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    left: 80,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));
const configItems = [
    {
        id: 1,
        name: "Usuarios",
        link: "/admin/users",
        icon: <People />,
        iconSelected: <People color="#2495fd" />,
    },
    {
        id: 2,
        name: "Tutores",
        link: "/admin/tutors",
        icon: <Code />,
        iconSelected: <Code color="#2495fd" />,
    },
    {
        id:3,
        name: "Administradores",
        link: "/admin/admins",
        icon: <People />,
        iconSelected: <People color="#2495fd" />,
    },
    {
        id: 4,
        name: "Reportes",
        link: "/admin/reports",
        icon: <Report />,
        iconSelected: <Report color="#2495fd" />,
    },
];
const SidebarDrawer = ({ children }) => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    
    useEffect(() => {
        const splittedPath = location.pathname.split("/");
        const parsedPath = `/${splittedPath[1]}/${splittedPath[2]}`;
        console.log(parsedPath);    
        setPathname(parsedPath);
    }, [location]);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
        <Navbar />
        <Box sx={{ display: "flex", width: "100%" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    visibility: "visible !important",
                    zIndex: 1199,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        visibility: "visible !important",
                        transform: !open && "translateX(-190px) !important",
                        width: drawerWidth,
                        position: "relative",
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography > Menu </Typography>
                    <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                {/* Items */}
                {configItems.map((item) => {
                    return (
                        <Link
                            className="link"
                            key={item.id}
                            to={item.link}
                            style={{
                                display: "flex",
                                "&:hover": {
                                    textDecoration: "none",
                                },
                            }}
                        >
                            <div
                                className={`admin-items-div ${pathname === item.link && "selected"}`}
                            >
                                {/*icono */}
                                {pathname === item.link ? item.iconSelected : item.icon}
                                {/*Texto */}
                                <p
                                    className="admin-items"
                                    style={{
                                        color: pathname === item.link ? "var(--primary)" : null,
                                    }}
                                >
                                    {item.name}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </Drawer>
            <Container sx={{ py: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: '50px' }}>
            <Outlet />
            </Container>
        </Box>
        </>
    );
}

export default SidebarDrawer;