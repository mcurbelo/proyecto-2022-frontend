
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
import { MisVentas } from './components/MisVentas';
import { Reclamos } from './components/ListaReclamos';
import { MisProductos } from './components/ListarMisProductos';
import { ModificarProducto } from './components/ModificarProducto'
import Chat from './components/Chat';
import { Solicitudes } from './components/ListarSolicitudes'
import { Outlet } from 'react-router';
import WithoutNav from './withoutNav';
import WithNav from './WithNav';

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
          <Route path="/signin" element={<SignInPage />} />
        </Route>
        <Route element={<WithNav />}>
          <Route path='/' element={<HomePage showHeader={true} showProfile={false} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/directions" element={<Directions />} />
          <Route path="/miscompras" element={<MisCompras />} />
          <Route path="/testNotifiacion" element={<NotificacionTest />} />
          <Route path="/addCard" element={<AddCardForm />} />
          <Route path="/profile" element={<HomePage showHeader={true} showProfile={true} />} />
          <Route path="/cards" element={<CardList onSelectCard={(id) => {
            console.log("Selected card: " + id)
          }} />} />
          <Route path="/productos/:id" element={<InfoProducto />} />
          <Route path="/compra" element={<RealizarCompra />} />
          <Route path="/image" element={<AddProductForm esSolicitud={true} />} />
          <Route path="/agregarproducto" element={<AddProductForm esSolicitud={false} />} />
          <Route path="/misventas" element={<MisVentas />} />
          <Route path="/chat/:idchat" element={<Chat />} />
          <Route path="/misventas" element={<MisVentas />} />
          <Route path="/misReclamos" element={<Reclamos listarRealizados={true}></Reclamos>} />
          <Route path="/misReclamosRecibidos" element={<Reclamos listarRealizados={false}></Reclamos>} />
          <Route path="/misProductos" element={<MisProductos></MisProductos>} ></Route>
          <Route path="/modificarProducto" element={<ModificarProducto></ModificarProducto>}  ></Route>
          <Route path="/listarSolicitudes" element={<Solicitudes></Solicitudes>}  ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);
reportWebVitals();
