import { Card } from "antd";
import SignInForm from "../components/SignInForm";
import imagen from '../images/inicioSesion.jpg'
type SignInPageProps = {}

const myStyle = {
  backgroundImage:
    "url('" + imagen + "')",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const SignInPage: React.FC<SignInPageProps> = (props) => {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...myStyle }}>
      <Card style={{width:"30%"}}>
        <SignInForm />
      </Card>
    </div>
  )
}

export default SignInPage;