import { Card, Form, Input, message, Modal, Row } from "antd"
import { AdministradorService } from "shopit-shared"
import { useNavigate } from "react-router";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import Button from "antd-button-color";


const AdminSingUpForm = () => {
  const navigate = useNavigate();


  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Row justify="center">
        <h1>Crear nuevo administrador</h1>
      </Row>
      <div style={{ width: "50%", alignSelf: "center" }}>
        <Card>
          <Form
            layout="vertical"
            onFinish={(values) => {
              AdministradorService.nuevoAdministrador(localStorage.getItem("token") as string, {
                nombre: values.nombre,
                apellido: values.apellido,
                correo: values.email
              }).then((response) => {
                if (response.success) {
                  message.success("Usuario administrador creado con exito. Dirigirse al correo para continuar con los siguientes pasos...")
                  navigate("/")
                } else {
                  Modal.error({
                    title: 'Error',
                    content: response.message,
                  });
                }
              })
            }}
          >
            <Form.Item name="email" label="Correo:" rules={[{
              required: true,
              type: "email",
              message: "Debe ser un correo valido"
            }]}>
              <Input placeholder="usuario@shopnow.com" />
            </Form.Item>

            <Form.Item name="nombre" label="Nombre:" rules={[{
              required: true,
              type: "string",
              message: "No puede ser vacío"
            }]}>
              <Input placeholder="Nombre" />
            </Form.Item>

            <Form.Item name="apellido" label="Apellido:" rules={[{
              required: true,
              type: "string",
              message: "No puede ser vacío"
            }]}>
              <Input placeholder="Apellido" />
            </Form.Item>
            <Row justify="center">
              <Button type="success" htmlType="submit">Crear administrador</Button>
            </Row>
          </Form>
        </Card>
      </div>
    </div>

  )
}

export default AdminSingUpForm;