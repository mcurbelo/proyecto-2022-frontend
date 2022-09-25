import { Button, Form, Input } from "antd"
import { useState } from "react";
import { createUseStyles } from "react-jss"

type SignInFormProps = {}

type SignInFormData = {
  username: string;
  password: string;
}

const useStyles = createUseStyles({
  form: {
    maxWidth: 600,
    display: "flex",
    width: "35%",
    flexDirection: "column",
    padding: 12,
  }
});
const SignInForm: React.FC<SignInFormProps> = () => {
  const styles = useStyles();
  const [state, setState] = useState({ username: "", password: "" } as SignInFormData)
  return (
    <Form className={styles.form}>
      <Input placeholder="Usuario" style={{ marginBottom: 16 }} onChange={(event) => {
        setState({
          ...state,
          username: event.target.value
        })
      }} />
      <Input.Password placeholder="Contraseña" style={{ marginBottom: 16 }} onChange={(event) => {
        setState({ ...state, password: event.target.value })
      }} />
      <Button type="primary" onClick={(event) => {
        event.preventDefault();
        alert(JSON.stringify(state));
      }}>Iniciar Sesion</Button>
      <label style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}>¿No tienes una cuenta?</label>
      <Button type="ghost">Registrate</Button>
      <Button type="link" style={{ marginTop: 16 }}>¿Olvidaste tu contraseña?</Button>
    </Form>
  )
}

export default SignInForm;