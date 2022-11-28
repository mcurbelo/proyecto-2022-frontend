import { Alert, Button, Form, Input } from "antd"
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss"
import { useNavigate } from "react-router";
import { UserService } from "shopit-shared"
import { fetchToken } from "../firebase";
type SignInFormProps = {}

type SignInFormData = {
  username: string;
  password: string;
  error: boolean
}

const useStyles = createUseStyles({
  form: {
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    padding: 12,
    background: "white"
  }
});
const SignInForm: React.FC<SignInFormProps> = (props) => {
  const styles = useStyles();
  const [state, setState] = useState({ username: "", password: "", error: false } as SignInFormData)
  const navigate = useNavigate()
  const [isTokenFound, setTokenFound] = useState(false);


  useEffect(() => {
    fetchToken(setTokenFound);
  }, []);

  return (
    <Form className={styles.form} onFinish={async (_) => {
      UserService.iniciarSesion(state.username, state.password, localStorage.getItem("tokenNotificacion")!)
        .then((result) => {
          if (result?.token && result?.uuid) {
            localStorage.setItem("token", result.token)
            localStorage.setItem("uuid", result.uuid)
            navigate("/")
          } else {
            setState({
              ...state,
              error: true
            })
          }
        })
    }}>
      <h1 style={{ textAlign: "center" }}>Inicio de sesión</h1>
      <Form.Item
        name="usuario"
        rules={[{
          required: true,
          type: "email",
          message: "El nombre de usuario debe ser un email válido"
        }]}>
        <Input
          placeholder="Correo"
          style={{ marginBottom: 16 }}
          onChange={(event) => {
            setState({
              ...state,
              username: event.target.value
            })
          }} />
      </Form.Item>
      <FormItem
        name="password"
        rules={[{
          required: true,
          message: "Ingrese su contraseña"
        }]}>

        <Input.Password placeholder="Contraseña" style={{ marginBottom: 16 }} onChange={(event) => {
          setState({ ...state, password: event.target.value })
        }} />
      </FormItem>

      {state.error && <Alert type="error" message="Los datos no son correctos" showIcon={true} closable={true}
        onClose={() => {
          setState({ ...state, error: false })
        }}
      />
      }

      <Button htmlType="submit" type="primary" style={{ marginTop: state.error ? 16 : 0 }}>Iniciar sesión</Button>
      <label style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}>¿No tienes una cuenta?</label>
      <Button style={{ marginTop: 16 }} type="ghost" onClick={() => navigate("/registrarse")}>Registrate</Button>
      <Button type="link" style={{ marginTop: 16 }} onClick={() => { navigate("/recuperarContrasena") }}>¿Olvidaste tu contraseña?</Button>
    </Form>
  )
}

export default SignInForm;