import { Alert, Button, DatePicker, Form, Input, message } from "antd"
import { RuleObject } from "antd/lib/form";
import { useState } from "react";
import { differenceInYears, format } from "date-fns";
import { AdministradorService, UserService } from "shopit-shared"
import { useNavigate } from "react-router";
type PasswordState = {
  password: string;
  repeatPassword: string;
}

type Error = {
  error: boolean;
  message: string;
}
const AdminSingUpForm = () => {
  const [state, setState] = useState({} as PasswordState)
  const [error, setError] = useState({} as Error)
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "50%", alignSelf: "center", marginTop:"8%"}}>
        <Form
        onFinish={(values) => {
          AdministradorService.nuevoAdministrador(localStorage.getItem("token") as string, {
            nombre: values.nombre,
            apellido: values.apellido,
            correo: values.email
          }).then((response) => {
            debugger;
            message.success("Usuario administrador creado con exito. Dirigirse al correo para continuar con los siguientes pasos...")
            navigate("/")
          })
        }}
      >
        <Form.Item name="email" rules={[{
          required: true,
          type: "email",
          message: "Debe ser un mail valido"
        }]}>
          <Input placeholder="usuario@shopit.com" />
        </Form.Item>

        <Form.Item name="nombre" rules={[{
          required: true,
          type: "string",
          message: "No puede ser vacío"
        }]}>
          <Input placeholder="Nombre" />
        </Form.Item>

        <Form.Item name="apellido" rules={[{
          required: true,
          type: "string",
          message: "No puede ser vacío"
        }]}>
          <Input placeholder="Apellido" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Crear administrador</Button>
      </Form>
      </div>
    </div>
    
  )
}

export default AdminSingUpForm;