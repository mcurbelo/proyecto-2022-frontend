import { Alert, DatePicker, Form, Input, InputNumber } from "antd"
import { RuleObject } from "antd/lib/form";
import { useState } from "react";
import { differenceInYears, format } from "date-fns";
import { UserService } from "shopit-shared"
import { useNavigate } from "react-router";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'

type PasswordState = {
  password: string;
  repeatPassword: string;
}

type Error = {
  error: boolean;
  message: string;
}
const SignUpForm = () => {
  const [state, setState] = useState({} as PasswordState)
  const [error, setError] = useState({} as Error)

  const passwordValidator = (_: RuleObject, __: any) => {
    if ((state.password?.length === 0 || state.repeatPassword?.length === 0) || state.password === state.repeatPassword) {
      return Promise.resolve()
    }
    return Promise.reject()
  }

  const dateofbirthValidator = (_: RuleObject, value: Date) => {
    if (!value) return Promise.reject()
    if (differenceInYears(new Date(), new Date((value as any)._d)) >= 18) return Promise.resolve()
    return Promise.reject()
  }

  return (
    <Form
      onFinish={(values) => {
        let dateFechaNac = new Date((values.fechaNac as any)._d)
        let formatted = format(dateFechaNac, "dd/MM/yyyy")
        UserService.registrarUsuario({
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.email,
          password: values.password,
          telefono: values.telefono,
          fechaNac: formatted,
          tokenWeb: localStorage.getItem("tokenNotificacion")!
        }).then((response) => {
          if (response.success && response.token && response.uuid) {
            localStorage.setItem("token", response.token!)
            localStorage.setItem("uuid", response.uuid)
            window.location.href = "/FAQ"
          } else {
            setError({ error: true, message: response.error! })
          }
        })
      }}
      layout="vertical"
    >
      <Form.Item name="email" label="Correo" rules={[{
        required: true,
        type: "email",
        message: "Debe ser un correo valido"
      }]}>
        <Input placeholder="usuario@shopnow.com" />
      </Form.Item>

      <Form.Item name="nombre" label="Nombre" rules={[{
        required: true,
        type: "string",
        message: "No puede ser vacío"
      }]}>
        <Input placeholder="Nombre" />
      </Form.Item>

      <Form.Item name="apellido" label="Apellido" rules={[{
        required: true,
        type: "string",
        message: "No puede ser vacío"
      }]}>
        <Input placeholder="Apellido" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Contraseña"
        rules={[{
          required: true,
          message: "No puede ser vacío"
        }]}
      >
        <Input.Password placeholder="Contraseña" onChange={(event) => setState({ ...state, password: event.target.value })} />
      </Form.Item>

      <Form.Item
        name="repeatPassword"
        label="Repetir contraseña"
        rules={[{
          required: true,
          message: "No puede ser vacío"
        },
        {
          validator: passwordValidator,
          message: "Las contraseñas no coinciden o se encuentran vacías"
        }]}
      >

        <Input.Password placeholder="Reingrese su contraseña" onChange={(event) => setState({ ...state, repeatPassword: event.target.value })} />
      </Form.Item>
      <Form.Item
        name="telefono"
        label="Teléfono"
        rules={[{
          required: true,
          pattern: new RegExp("^[0-9]{8,9}$"),
          message: "Solo números, entre 8 y 9 caracteres",
        }
        ]}
      >
        <Input placeholder="093254142" />
      </Form.Item>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Form.Item
          style={{ width: "100%" }}
          name="fechaNac"
          label="Fecha de nacimiento"
          rules={[{
            required: true,
            validator: dateofbirthValidator,
            message: "Es obligatorio ser mayor de edad"
          }]}
        >
          <DatePicker style={{ width: "100%" }} format={"DD/MM/yyyy"} placeholder="Seleccione una fecha" />
        </Form.Item>
        {error?.error && <Alert style={{ marginTop: 16, marginBottom: 16, width: "100%" }} message={error.message} type="error" showIcon={true} />}
        <Button type="success" htmlType="submit">Registrarse!</Button>
      </div>
    </Form>
  )
}

export default SignUpForm;