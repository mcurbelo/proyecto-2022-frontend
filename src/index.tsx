
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "./main.css"
import 'antd/dist/antd.css';
import SignInPage from './pages/SignInPage';
import MainHeader from './components/MainHeader';
import HomePage from './pages/Home';
import UserList from './pages/UserList';
import NotificacionTest from './test/Notification'
import SignUpPage from './pages/SignUpPage';
import { Auth } from "shopit-shared";
import AddCardForm from './components/AddCard';
import CardList from './components/CardList';
import InfoProducto from './components/InfoProducto';
import { Directions } from './components/Directions';
import RealizarCompra from './components/RealizarCompra';
import AddProductForm from './components/ProductForm';
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
          <Route path="/usuarios" element={<UserList />} />
          <Route path="/direcciones" element={<Directions />} />
          <Route path="/compras" element={<MisCompras />} />
          <Route path="/testNotifiacion" element={<NotificacionTest />} />
          <Route path="/addCard" element={<AddCardForm />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/tarjetas" element={<TarjetasPage />} />
          <Route path="/productos/:id" element={<InfoProducto />} />
          <Route path="/compra" element={<RealizarCompra />} />
          <Route path="/image" element={<AddProductForm esSolicitud={true} />} />
          <Route path="/agregarproducto" element={<AgregarProducto/>} />
          <Route path="/ventas" element={<MisVentas />} />
          <Route path="/chat/:idchat" element={<Chat />} />
          <Route path="/misReclamos" element={<Reclamos listarRealizados={true}></Reclamos>} />
          <Route path="/misReclamosRecibidos" element={<Reclamos listarRealizados={false}></Reclamos>} />
          <Route path="/misProductos" element={<MisProductos></MisProductos>} ></Route>
          <Route path="/modificarProducto" element={<ModificarProducto></ModificarProducto>}  ></Route>
          <Route path="/solicitudes" element={<Solicitudes></Solicitudes>}  ></Route>
          <Route path="/nuevoAdministrador" element={<AdminSignUpForm></AdminSignUpForm>}  ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);
reportWebVitals();
