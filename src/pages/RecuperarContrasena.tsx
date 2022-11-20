import { Card } from "antd";
import RecuperarContrasenaForm from "../components/RecuperarContrasenaForm";


const RecuperarContrasena = () => {
  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ height: "auto", display: "flex", justifyContent: "center" }}>
      <Card style={{width:"30%"}}>
        < RecuperarContrasenaForm/>
      </Card>
    </div>
  )
}

export default RecuperarContrasena;