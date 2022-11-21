import { Card } from "antd";
import AgregarProducto from "../components/ProductForm"


const NuevaSolicitudPage = () => {
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