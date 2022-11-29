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
import { ProtectedRoute } from "./ProtectedRoute";
import FAQPage from "./pages/FAQPage";


function App() {
    const [existeToken, setExiste] = useState(!!localStorage.getItem("token"));
    const [rol, setRol] = useState<string | null>(null);
    const { emitter } = useMitt()

    useEffect(() => {
        emitter.on('estadoSesion', event => {
            if (event.login === true) {
                setRol(event.rol);
                setExiste(true)
            }
            else {
                setRol(null);
                setExiste(false);
            }
        });

    }, [])


    return (
        <BrowserRouter>
            <Routes>
                <Route element={<WithoutNav />}>
                    <Route path="/iniciarSesion" element={!existeToken ? <SignInPage /> : <Navigate to="/" replace />} />
                </Route>
                <Route element={<WithNav />}>
                    {/* Invitado*/}
                    <Route path="/registrarse" element={rol === null ? <SignUpPage /> : <Navigate to="/" replace />} />
                    <Route path="/recuperarContrasena" element={rol === null ? <RecuperarContrasena /> : <Navigate to="/" replace />} />

                    {/* Todos */}
                    <Route path="/productos/:id" element={<InfoProducto esAdm={(rol === "ADM") ? true : false} />} />
                    <Route path='/' index element={<HomePage />} />
                    <Route path="/FAQ" element={<FAQPage />} />

                    {/* Comprador/Vendedor */}
                    <Route element={<ProtectedRoute rol={rol} rolPermitido={["Comprador", "Vendedor"]} existeToken={existeToken} />}>
                        <Route path="/direcciones" element={<DireccionesPage esVendedor={("Comprador") ? false : true} />} />
                        <Route path="/compras" element={<MisCompras />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/tarjetas" element={<TarjetasPage />} />
                        <Route path="/compra" element={<RealizarCompra />} />
                        <Route path="/chat/:idchat" element={<Chat />} />
                        <Route path="/misReclamos" element={<Reclamos listarRealizados={true} />} />
                    </Route>
                    {/* Solo comprador */}
                    <Route element={<ProtectedRoute rol={rol} rolPermitido={["Comprador"]} existeToken={existeToken} />}>
                        <Route path="/nuevaSolicitud" element={<NuevaSolicitudPage />} />
                    </Route>

                    {/* Solo vendedor */}
                    <Route element={<ProtectedRoute rol={rol} rolPermitido={["Vendedor"]} existeToken={existeToken} />}>
                        <Route path="/agregarproducto" element={<AgregarProducto />} />
                        <Route path="/ventas" element={<MisVentas />} />
                        <Route path="/misReclamosRecibidos" element={<Reclamos listarRealizados={false} />} />
                        <Route path="/misProductos" element={<MisProductos />} ></Route>
                        <Route path="/modificarProducto" element={<ModificarProducto />}></Route>
                        <Route path='/estadisticas' element={<EstadisticasVendedor />}> </Route>
                    </Route>

                    {/* Administrador */}
                    <Route element={<ProtectedRoute rol={rol} rolPermitido={["ADM"]} existeToken={existeToken} />}>
                        <Route path="/usuarios" element={<UserList />} />
                        <Route path="/solicitudes" element={<Solicitudes />}></Route>
                        <Route path="/nuevoAdministrador" element={<AdminSignUpForm />}></Route>
                        <Route path='/estadisticas/sistema' element={<EstadisticasAdm />}></Route>
                        <Route path="/categoria" element={<NuevaCategoria />}></Route>
                        <Route path="/devoluciones" element={<DeshacerCompra />}> </Route>
                    </Route>

                    {/* Ruta equivocada */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )


}
export default App;

