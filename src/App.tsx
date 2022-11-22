import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import AdminSignUpForm from "./components/AdminSignUpForm";
import Chat from "./components/Chat";
import { DeshacerCompra } from "./components/DeshacerCompra";
import InfoProducto from "./components/InfoProducto";
import { Reclamos } from "./components/ListaReclamos";
import { MisProductos } from "./components/ListarMisProductos";
import { Solicitudes } from "./components/ListarSolicitudes";
import { MisCompras } from "./components/MisCompras";
import { MisVentas } from "./components/MisVentas";
import { ModificarProducto } from "./components/ModificarProducto";
import { NuevaCategoria } from "./components/NuevaCategoria";
import Perfil from "./components/Perfil";
import RealizarCompra from "./components/RealizarCompra";
import DireccionesPage from "./pages/DireccionesPage";
import HomePage from "./pages/Home";
import RecuperarContrasena from "./pages/RecuperarContrasena";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NuevaSolicitudPage from "./pages/SolicitudPage";
import TarjetasPage from "./pages/TarjetasPage";
import UserList from "./pages/UserList";
import WithNav from "./WithNav";
import WithoutNav from "./withoutNav";
import AgregarProducto from './pages/AgregarProductoPage';
import EstadisticasVendedor from './pages/EstadisiticasVendedorPage';
import EstadisticasAdm from './pages/EstadisiticasAdminPage';
import { useMitt } from "react-mitt";


function App() {
    const [rol, setRol] = useState<string | null>(null);
    const { emitter } = useMitt()

    useEffect(() => {
        emitter.on('estadoSesion', event => {
            console.log(event);
            if (event.login = true)
                setRol(event.rol);
            else
                setRol(null);
        });

    }, [])


    return (
        <BrowserRouter>
            <Routes>
                <Route element={<WithoutNav />}>
                    <Route path="/iniciarSesion" element={rol === null ? <SignInPage /> : <Navigate to="/" replace />} />
                </Route>
                <Route element={<WithNav />}>
                    {/* Invitado/Comprador/Vendedor */}
                    <Route path='/' element={<HomePage />} />
                    <Route path="/registrarse" element={rol === null ? <SignUpPage /> : <Navigate to="/" replace />} />
                    <Route path="/recuperarContrasena" element={rol === null ? <RecuperarContrasena /> : <Navigate to="/" replace />} />
                    <Route path="/productos/:id" element={<InfoProducto />} />

                    {/* Comprador/Vendedor */}
                    <Route path="/direcciones" element={rol !== "ADM" ? <DireccionesPage /> : <Navigate to="/" replace />} />
                    <Route path="/compras" element={rol !== "ADM" ? <MisCompras /> : <Navigate to="/" replace />} />
                    <Route path="/perfil" element={rol !== "ADM" ? <Perfil /> : <Navigate to="/" replace />} />
                    <Route path="/tarjetas" element={rol !== "ADM" ? <TarjetasPage /> : <Navigate to="/" replace />} />
                    <Route path="/compra" element={rol !== "ADM" ? <RealizarCompra /> : <Navigate to="/" replace />} />
                    <Route path="/nuevaSolicitud" element={rol !== "ADM" ? <NuevaSolicitudPage /> : <Navigate to="/" replace />} /> {/* Ojo aca */}
                    <Route path="/chat/:idchat" element={rol !== "ADM" ? <Chat /> : <Navigate to="/" replace />} />
                    <Route path="/misReclamos" element={rol !== "ADM" ? <Reclamos listarRealizados={true} /> : <Navigate to="/" replace />} />

                    {/* Solo vendedor */}
                    <Route path="/agregarproducto" element={rol === "Vendedor" ? <AgregarProducto /> : <Navigate to="/" replace />} />
                    <Route path="/ventas" element={rol === "Vendedor" ? <MisVentas /> : <Navigate to="/" replace />} />
                    <Route path="/misReclamosRecibidos" element={rol === "Vendedor" ? <Reclamos listarRealizados={false} /> : <Navigate to="/" replace />} />
                    <Route path="/misProductos" element={rol === "Vendedor" ? <MisProductos /> : <Navigate to="/" replace />} ></Route>
                    <Route path="/modificarProducto" element={rol === "Vendedor" ? <ModificarProducto /> : <Navigate to="/" replace />}  ></Route>
                    <Route path='/estadisticas' element={rol === "Vendedor" ? <EstadisticasVendedor /> : <Navigate to="/" replace />}> </Route>

                    {/* Administrador */}
                    <Route path="/usuarios" element={rol === "ADM" ? <UserList /> : <Navigate to="/" replace />} />
                    <Route path="/solicitudes" element={rol === "ADM" ? <Solicitudes></Solicitudes> : <Navigate to="/" replace />}  ></Route>
                    <Route path="/nuevoAdministrador" element={rol === "ADM" ? <AdminSignUpForm /> : <Navigate to="/" replace />}  ></Route>
                    <Route path='/estadisticas/sistema' element={rol === "ADM" ? <EstadisticasAdm /> : <Navigate to="/" replace />}> </Route>
                    <Route path="/categoria" element={rol === "ADM" ? <NuevaCategoria /> : <Navigate to="/" replace />}></Route>
                    <Route path="/devoluciones" element={rol === "ADM" ? <DeshacerCompra /> : <Navigate to="/" replace />}> </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )


}
export default App;

