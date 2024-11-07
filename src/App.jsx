import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './componentes/privateRoute';
import './App.scss';
import Home from './vistas/home';
import EditarPerfil from './vistas/editarPerfil';
import BusquedaVista from './vistas/busquedaVista';
import GestionTutorias from './vistas/gestionTutorias';
import Login from './vistas/login';
import { TutorRoute } from './componentes/tutorRoute';
import Registro from './vistas/registro';
import { SearchContextProvider } from './context/searchContext';
import AppThemeProvider from './themes/AppThemeProvider';
import { useSnackContext } from './context/SnackContext';
import Snacks from './utils/Snacks';
import AdminIndex from './vistas/admin';
import UsersAdmin from './vistas/admin/UsersAdmin';
import ReportsAdmin from './vistas/admin/ReportsAdmin';
import TutoresAdmin from './vistas/admin/tutoresAdmin';
import AdminsAdmin from './vistas/admin/AdminsAdmin';
import { RecuperarContrasena } from './vistas/RecuperarContrasena';
import { useUserContext } from './context/UserContext';
import LoadingComponent from './utils/LoadingComponente';
function App() {
  const { snackInfo, closeSnack } = useSnackContext();
  const { userInfoLoading } = useUserContext();
  if (userInfoLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Router>
        <AppThemeProvider>
          <SearchContextProvider>
            <Snacks
              message={snackInfo.message}
              severity={snackInfo.severity}
              open={snackInfo.isOpen}
              closeSnack={closeSnack}
            />
            <Routes>
              <Route path="/" >
                <Route index element={<Home />}></Route>
                <Route path=':idUsuario' element={<PrivateRoute><EditarPerfil /></PrivateRoute>}></Route>
                <Route path='search' element={<BusquedaVista />}></Route>
                <Route path='tutorias' element={<TutorRoute><GestionTutorias /></TutorRoute>}></Route>
                <Route path='login' element={<Login />}></Route>
                <Route path='registro' element={<Registro />}></Route>
                <Route path='admin' element={<AdminIndex />}>
                  <Route index element={<UsersAdmin />} /> {/* Ruta por defecto */}
                  <Route path='users' element={<UsersAdmin />} />
                  <Route path='reports' element={<ReportsAdmin />} />
                  <Route path='tutors' element={<TutoresAdmin />} />
                  <Route path='admins' element={<AdminsAdmin />} />
                </Route>
                <Route path='recuperarcontrasena' element={<RecuperarContrasena/>}></Route>
              </Route>
              <Route path='*' element={<h1>404 Not Found</h1>}></Route>
            </Routes>
          </SearchContextProvider>
        </AppThemeProvider>
      </Router>
      {/* <RegistroVista></RegistroVista> */}
      {/* <ProductosVista></ProductosVista> */}
    </>
  )
}

export default App;