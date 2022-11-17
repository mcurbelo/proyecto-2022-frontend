import { Card } from "antd";
import AgregarProducto from "../components/ProductForm"


const SignUpPage = () => {
  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Agregar nuevo producto</h1>
      <div style={{ width: "50%", alignSelf: "center" }}>
        <Card>
          <AgregarProducto esSolicitud={false} />
        </Card>
      </div>
    </div>
  )
}

export default SignUpPage;