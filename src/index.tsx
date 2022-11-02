
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
import { MisCompras } from './components/MisCompras';
import AddProductForm from './components/ProductForm';

require('dotenv').config();

Auth.endpoint = process.env.REACT_APP_SERVER_URL ?? "";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage showHeader={true} showProfile={false} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/directions" element={<Directions />} />
        <Route path="/miscompras" element={<MisCompras />} />
        <Route path="/testNotifiacion" element={<NotificacionTest/>} />
        <Route path="/addCard"  element={<AddCardForm />} />
        <Route path="/profile"  element={<HomePage showHeader={true} showProfile={true} />} />
        <Route path="/cards" element={<CardList onSelectCard={(id) => {
          console.log("Selected card: " + id)
        }} />} />
        <Route path="/productos/:id" element={<InfoProducto />} />
        <Route path="/image" element={<AddProductForm esSolicitud={true} />} />


      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);
reportWebVitals();
