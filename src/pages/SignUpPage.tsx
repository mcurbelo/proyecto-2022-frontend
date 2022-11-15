import { Card } from "antd";
import SignUpForm from "../components/SignUpForm"


const SignUpPage = () => {
  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Registro de nuevo usuario</h1>
      <div style={{ width: "50%", alignSelf: "center" }}>
        <Card>
          <SignUpForm />
        </Card>
      </div>
    </div>
  )
}

export default SignUpPage;