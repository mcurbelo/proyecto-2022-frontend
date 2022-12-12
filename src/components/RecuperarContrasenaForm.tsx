import { Button, Form, Input, Spin, Row, Card, message, Statistic  } from "antd";
import { useState } from "react";
import { RuleObject } from "antd/lib/form";
import { UserService } from "shopit-shared";
import { useNavigate } from "react-router";

type Props  = {
    
}

type PasswordState = {
    password: string;
    repeatPassword: string;
  }
  
type Error = {
    error: boolean;
    message: string;
}

const deadline = Date.now() + 1000 * 60 * 60; 

 
const RecuperarContrasenaForm: React.FC<Props> = () => {
  const [state, setState] = useState({} as PasswordState)
  const [error, setError] = useState({} as Error)
  const [codigoCorrecto, setCodigoCorrecto] = useState(false);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarCorreo, setMostrarCorreo] = useState(true);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [intentoCodigo, setintentoCodigo] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { Countdown } = Statistic;

  const passwordValidator = (_: RuleObject, __: any) => {
    if ((state.password.length === 0 || state.repeatPassword.length === 0) || state.password === state.repeatPassword) {
        return Promise.resolve()
    }else{
      return Promise.reject()
    }
        
    }

  const verificarCodigo = () => {
    UserService.verificarCodigo(codigo).then(res => {
      if(res != undefined){
        message.success(res);
        setMostrarCodigo(false);
        setMostrarForm(true);
      }else {
        if(intentoCodigo >= 3){
          message.error("Supero la cantidad de fallos en el codigo");
          setLoading(false);
          navigate("/iniciarSesion");
        }else{
          message.error("Codigo incorrecto, volver a intentar");
          setCodigo("");
          setintentoCodigo(intentoCodigo + 1);
          setLoading(false);
        }
        
      }
      
    }).catch(e => {
      message.error(e);
    }) 
  }

  const crearSolicitud = () => {
      setLoading(true);
      UserService.recuperarContrasena(correo).then(res => {
        message.success("Se a enviado un codigo a su correo");
        setMostrarCorreo(false);
        setMostrarCodigo(true);
        setLoading(false);
      }).catch(e => {
        message.error("Ocurrio un error");
        setLoading(false);
      })
  }

  const confirmarCambio = (values: any) => {
    setLoading(true);
    UserService.reiniciarContrasena(codigo, values.password).then(res => {
      message.success(res);
      setLoading(false);
      navigate("/iniciarSesion");
    }).catch(e => {
      message.success(e);
      setLoading(false);
    })
    
  }

    return (
    <div>
        <Spin spinning={loading}>
          { mostrarCorreo &&
          <div style={{ display: "flex", flexDirection: "column"}}>
            <Row justify="center">
              <h1>Ingrese el correo de la cuenta</h1>
            </Row>
            <div style={{ width: "50%", alignSelf: "center", justifyContent: "center" }}>
              <Card>
                <Form
                    layout="vertical">
                    <Form.Item
                        name="correo"
                        label="Ingrese el correo"
                      >
                        <Input placeholder="Correo" value={correo} onChange={(event) => setCorreo(event.target.value)} />
                    </Form.Item>
                    <Row justify="center">
                      <Button type="primary" htmlType="submit" onClick={crearSolicitud}>Continuar</Button>
                    </Row>
                  </Form>
              </Card>
            </div>
          </div>
        }
          { mostrarCodigo &&
          <div style={{ display: "flex", flexDirection: "column"}}>
            { mostrarCodigo && <Countdown title="Tiempo para expiracion del codigo" value={deadline} onFinish={() => {message.error("Vencio el codigo"); navigate("/iniciarSesion")}} />}
            <Row justify="center">
              <h1>Ingrese el codigo</h1>
            </Row>
            <div style={{ width: "50%", alignSelf: "center", justifyContent: "center" }}>
              <Card>
                <Form
                    layout="vertical">
                    <Form.Item
                        name="codigotoken"
                        label="Ingrese el codigo"
                      >
                        <Input placeholder="Codigo" onChange={(event) => setCodigo(event.target.value)} />
                    </Form.Item>
                    <Row justify="center">
                      <Button type="primary" htmlType="submit" onClick={verificarCodigo}>Aceptar</Button>
                    </Row>
                  </Form>
              </Card>
            </div>
          </div>
          } 
          { mostrarForm &&
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row justify="center">
              <h1>Recuperar contraseña</h1>
            </Row>
            <div style={{ width: "50%", alignSelf: "center" }}>
              <Card>
                <Form
                  layout="vertical"
                  onFinish={(values) => {confirmarCambio(values)}}>
                  <Form.Item
                      name="password"
                      label="Contraseña nueva"
                      rules={[{
                      required: true,
                      message: "No puede ser vacío"
                      }
                      ]}>
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
                  <Row justify="center">
                    <Button type="primary" htmlType="submit">Cambiar</Button>
                  </Row>
                </Form>
              </Card>
            </div>
          </div>  
        } 
        </Spin>
    </div>
    );
}
 
export default RecuperarContrasenaForm;