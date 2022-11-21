
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "./main.css"
import 'antd/dist/antd.css';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/Home';
import UserList from './pages/UserList';
import SignUpPage from './pages/SignUpPage';
import { Auth } from "shopit-shared";
import AddCardForm from './components/AddCard';
import InfoProducto from './components/InfoProducto';
import RealizarCompra from './components/RealizarCompra';
import { MisCompras } from './components/MisCompras';
import AdminSignUpForm from './components/AdminSignUpForm'
import { MisVentas } from './components/MisVentas';
import { Reclamos } from './components/ListaReclamos';
import { MisProductos } from './components/ListarMisProductos';
import { ModificarProducto } from './components/ModificarProducto'
import Chat from './components/Chat';
import { Solicitudes } from './components/ListarSolicitudes'
import { Outlet } from 'react-router';
import WithoutNav from './withoutNav';
import WithNav from './WithNav';
import Perfil from './components/Perfil';
import TarjetasPage from './pages/TarjetasPage';
import AgregarProducto from './pages/AgregarProductoPage';
import EstadisticasVendedor from './pages/EstadisiticasVendedorPage';
import RecuperarContrasena from './pages/RecuperarContrasena';
import EstadisticasAdm from './pages/EstadisiticasAdminPage';
import { NuevaCategoria } from './components/NuevaCategoria';
import { DeshacerCompra } from './components/DeshacerCompra';
import NuevaSolicitudPage from './pages/SolicitudPage';
import DireccionesPage from './pages/DireccionesPage';

export default () => <Outlet />

require('dotenv').config();

Auth.endpoint = process.env.REACT_APP_SERVER_URL ?? "";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route element={<WithoutNav />}>
          <Route path="/iniciarSesion" element={<SignInPage />} />
        </Route>
        <Route element={<WithNav />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/registrarse" element={<SignUpPage />} />
          <Route path="/recuperarContrasena" element={<RecuperarContrasena />} />
          <Route path="/usuarios" element={<UserList />} />
          <Route path="/direcciones" element={<DireccionesPage />} />
          <Route path="/compras" element={<MisCompras />} />
          <Route path="/addCard" element={<AddCardForm />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/tarjetas" element={<TarjetasPage />} />
          <Route path="/productos/:id" element={<InfoProducto />} />
          <Route path="/compra" element={<RealizarCompra />} />
          <Route path="/nuevaSolicitud" element={<NuevaSolicitudPage />} />
          <Route path="/agregarproducto" element={<AgregarProducto />} />
          <Route path="/ventas" element={<MisVentas />} />
          <Route path="/chat/:idchat" element={<Chat />} />
          <Route path="/misReclamos" element={<Reclamos listarRealizados={true}></Reclamos>} />
          <Route path="/misReclamosRecibidos" element={<Reclamos listarRealizados={false}></Reclamos>} />
          <Route path="/misProductos" element={<MisProductos></MisProductos>} ></Route>
          <Route path="/modificarProducto" element={<ModificarProducto></ModificarProducto>}  ></Route>
          <Route path="/solicitudes" element={<Solicitudes></Solicitudes>}  ></Route>
          <Route path="/nuevoAdministrador" element={<AdminSignUpForm></AdminSignUpForm>}  ></Route>
          <Route path='/estadisticas' element={<EstadisticasVendedor />}> </Route>
          <Route path='/estadisticas/sistema' element={<EstadisticasAdm />}> </Route>
          <Route path="/categoria" element={<NuevaCategoria />}></Route>
          <Route path="/devoluciones" element={<DeshacerCompra/>}> </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);
reportWebVitals();
