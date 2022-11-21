import { Card } from "antd";
import { Directions } from "../components/Directions";


const DireccionesPage = () => {
  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Mis direcciones</h1>
      <div style={{ width: "50%", alignSelf: "center" }}>
        <Card>
          <Directions />
        </Card>
      </div>
    </div>
  )
}

export default DireccionesPage;