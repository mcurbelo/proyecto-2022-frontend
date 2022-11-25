import { Card } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { UserService } from "shopit-shared";
import { EstadoSolicitud } from "shopit-shared/dist/user/UserService";
import AgregarProducto from "../components/ProductForm"


const NuevaSolicitudPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      UserService.obtenerInformacion(localStorage.getItem("token")!, localStorage.getItem("uuid")!)
        .then((informacion) => {
          const { datosVendedor } = informacion;
          if (datosVendedor && datosVendedor.estadoSolicitud === EstadoSolicitud.Pendiente) {
            navigate("/", { replace: true })
          }
        })
    }
  }, [])

  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Formulario de nuevo vendedor</h1>
      <div style={{ width: "60%", alignSelf: "center" }}>
        <Card>
          <AgregarProducto esSolicitud={true} />
        </Card>
      </div>
    </div>
  )
}

export default NuevaSolicitudPage;