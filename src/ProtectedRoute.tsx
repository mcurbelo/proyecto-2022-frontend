import { useLayoutEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserService } from "shopit-shared";
import { EstadoSolicitud } from "shopit-shared/dist/user/UserService";

type typeProtected = {
  rol: string | null,
  rolPermitido: string[],
  existeToken: boolean,
}

export const ProtectedRoute = ({ rol, rolPermitido, existeToken }: typeProtected) => {
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    const checkRol = async () => {
      setIsLoading(true);
      await UserService.obtenerInformacion(localStorage.getItem("token")!, localStorage.getItem("uuid")!)
        .then((informacion) => {
          if (informacion.rol && informacion.rol === "ADM") {
            rol = "ADM"
          }
          else {
            const { datosVendedor } = informacion;
            let esVendedor = (datosVendedor && datosVendedor.estadoSolicitud === EstadoSolicitud.Aceptado) || false;
            (esVendedor) ? rol = "Vendedor" : rol = "Comprador"
          }
          setIsLoading(false);
        })
    }
    if (rol === null && existeToken)
      checkRol();
    else
      setIsLoading(false);
  }, [])

  if (isLoading) {
    return null;
  } else {

    if ((rol !== null && !rolPermitido.includes(rol)) || (rol == null && !existeToken)) {
      return <Navigate to="/" replace />
    }
    else {
      return <Outlet />;
    }
  }
};
