import { FC, useState, useEffect, ChangeEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Form, Rate, Tooltip, Modal, Divider, Row, Col, Input } from 'antd';
import '../main.css';
import { UserService } from "shopit-shared";
import { DtCambioContrasena, UpdateInfoEmpresa } from 'shopit-shared/dist/user/UserService';
import { createUseStyles } from 'react-jss';

const { Option } = Select;
type otherInfoProp = {
  imagenGet: (src: string) => void
}
const useStyles = createUseStyles({
  container : {

  },

  colPequeño : {

  },

  '@media screen and (max-width: 1350px)': {
    container: {
      width: "auto !important"
    }
  },

  '@media screen and (max-width: 897px)': {
    container: {
      width: "90% !important",
      justifyContent:"center !important"
    },
    colPequeño : {
      width:"100% !important"
    }
  }


})



export const OtherInfo: FC<otherInfoProp> = (props) => {
  const styles = useStyles();
  const [esVendedor, setEsVendedor] = useState(false);
  const { imagenGet } = props;
  const uuid: string = (localStorage.getItem("uuid") as string);
  const token: string = (localStorage.getItem("token") as string);
  const [infoUsuario, setInfoUsuario] = useState({ uuid: uuid, apellido: "", correo: "", nombre: "", telefono: "", calificacion: 0 });

  const [datosVendedor, setDatosVendedor] = useState({
    nombreEmpresa: "",
    rut: "",
    telefonoEmpresa: "",
    estadoSolicitud: "",
    calificacion: 0
  })
  const [imagen, setImagen] = useState("")
  const [editando, setEditando] = useState(false);
  const [editandoEmpresa, setEditandoEmpresa] = useState(false);
  const [datosEmpresaNuevos, setNuevoDatosEmpresa] = useState<UpdateInfoEmpresa>({
    nombreEmpresa: undefined,
    telefonoEmpresa: undefined
  })
  const [datosCambioContrasena, setCambioContrasena] = useState<DtCambioContrasena>({
    contrasenaVieja: "",
    contrasenaNueva: ""
  })
  const [isLoading, setLoading] = useState(false);
  //const [datos, setDatos] =  useState(props);

  const onEdit = function (): void {
    setEditando(!editando);
  };

  const onEditEmpresa = function (): void {
    setEditandoEmpresa(!editandoEmpresa);
  };


  const loadInfoUser = () => {
    UserService.obtenerInformacion(token, uuid)
      .then((infoUsuario) => {
        if (infoUsuario.datosVendedor != null) {
          setEsVendedor(true);
          setDatosVendedor({
            nombreEmpresa: infoUsuario.datosVendedor.nombreEmpresa,
            rut: infoUsuario.datosVendedor.rut,
            telefonoEmpresa: infoUsuario.datosVendedor.telefonoEmpresa,
            estadoSolicitud: infoUsuario.datosVendedor.estadoSolicitud,
            calificacion: infoUsuario.datosVendedor.calificacion
          })
        }
        imagenGet(infoUsuario.imagen!);
        setInfoUsuario({
          uuid: uuid,
          apellido: (infoUsuario.apellido as string),
          correo: (infoUsuario.correo as string),
          nombre: (infoUsuario.nombre as string),
          telefono: (infoUsuario.telefono as string),
          calificacion: (infoUsuario.calificacion as number)
        })
        setImagen(infoUsuario.imagen as string);

      })
      .catch(() => console.log("Ocurrio un error al obtener la informacion del usuario"));

  }


  const onAcceptEdit = () => {

    let body = {
      uuid: uuid,
      apellido: infoUsuario.apellido,
      correo: infoUsuario.correo,
      nombre: infoUsuario.nombre,
      telefono: infoUsuario.telefono,
      imagen: {
        data: imagen
      }
    }

    UserService.updateUser(token, body).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edición completada con éxito",
          content: 'Sus datos se han actualizado exitosamente',
        });
        setEditando(!editando);
      }
      else {
        Modal.error({
          title: 'Error',
          content: response.message,
        });
      }
    })
  }

  const onAcceptEditEmpresa = () => {

    UserService.updateDatosEmpresa(token, uuid, datosEmpresaNuevos).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edición completada con éxito",
          content: 'Sus datos se han actualizado exitosamente',
        });
        setEditando(!editando);
      }
      else {
        Modal.error({
          title: 'Error',
          content: response.message,
        });
      }
    })

  }

  const onInputchange = (e: any) => {
    setInfoUsuario(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }
    ));
  }

  const onInputchangeEmpresa = (e: ChangeEvent<HTMLInputElement>) => {
    setNuevoDatosEmpresa({ ...datosEmpresaNuevos, [e.target.name]: e.target.value })
  }

  const cambiarContrasena = () => {
    UserService.updateContrasena(token, uuid, datosCambioContrasena).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edición completada con éxito",
          content: 'Sus datos se han actualizado exitosamente',
        });
        setEditando(!editando);
      }
      else {
        Modal.error({
          title: 'Error',
          content: response.message,
        });
      }
    })

  }


  useEffect(() => {
    loadInfoUser();
  }, []);

  return (
    <Row className={styles.container} justify='space-between' style={{ width: "60%" }}>
      <Col className={styles.colPequeño}  style={{ width: "60%" }}>
        <div style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ marginBottom: "5px" }}>Información básica</h3>
            <Button style={{ fontSize: "25px", justifyContent: 'center', display: 'flex', border: 0 }} onClick={onEdit}>
              <EditOutlined onClick={onEdit} />
            </Button>
          </div>

          <div className="wrapper">
            <div className='leftValues'>
              <div>
                <label>Nombre:</label>
                <input disabled={!editando} name='nombre' style={{ borderBottom: (editando) ? "2px solid green" : "" }} type="text" className="usuarioInput" defaultValue={infoUsuario.nombre} onChange={(e) => onInputchange(e)} />
              </div>
              <div>
                <label>Telefono:</label>
                <input disabled={!editando} name='telefono' style={{ borderBottom: (editando) ? "2px solid green" : "" }} type="text" className="usuarioInput" defaultValue={infoUsuario.telefono} onChange={(e) => onInputchange(e)} />
              </div>

              <div>
                <Tooltip title="Calificación obtenida de los vendedores ">
                  <div>
                    <label>Calificación:</label>
                    <Form.Item>
                      <Rate allowHalf disabled value={infoUsuario.calificacion} />
                    </Form.Item>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className='rigthValues'>
              <div>
                <label>Apellido:</label>
                <input disabled={!editando} name='apellido' type="text" style={{ borderBottom: (editando) ? "2px solid green" : "" }} className="usuarioInput" defaultValue={infoUsuario.apellido} onChange={(e) => onInputchange(e)} />
              </div>
              <div>
                <label>Correo:</label>
                <input disabled={!editando} name='correo' type="text" style={{ borderBottom: (editando) ? "2px solid green" : "" }} className="usuarioInput" defaultValue={infoUsuario.correo} onChange={(e) => onInputchange(e)} />
              </div>

              {
                editando && <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Button type='primary' onClick={onAcceptEdit}>Modificar</Button>
                </div>
              }

            </div>
          </div>

          <Divider></Divider>
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
            <h3>Información vendedor</h3>
            <Button style={{ fontSize: "25px", justifyContent: 'center', display: 'flex', border: 0 }} onClick={onEditEmpresa}>
              <EditOutlined onClick={onEditEmpresa} />
            </Button>
          </div>
          <div className="wrapper" style={esVendedor ? { display: "grid" } : { display: "none" }}>
            <div className='leftValues'>
              <div>
                <label>Nombre empresa:</label>
                <input disabled={!editandoEmpresa} name='nombreEmpresa' style={{ borderBottom: (editandoEmpresa) ? "2px solid green" : "" }} type="text" className="usuarioInput" defaultValue={datosVendedor.nombreEmpresa} onChange={(e) => onInputchangeEmpresa(e)} />
              </div>
              <div>
                <label>RUT:</label>
                <input disabled={true} name='rut' type="text" className="usuarioInput" defaultValue={datosVendedor.rut} />
              </div>
              
              <div>
                <Tooltip title="Calificación obtenida de los compradores">
                  <div>
                    <label>Calificación:</label>
                    <Form.Item>
                      <Rate allowHalf disabled value={datosVendedor.calificacion} />
                    </Form.Item>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className='rigthValues'>
            <div>
                <label>Teléfono:</label>
                <input disabled={!editandoEmpresa} name='telefonoEmpresa' style={{ borderBottom: (editandoEmpresa) ? "2px solid green" : "" }} type="text" className="usuarioInput" defaultValue={datosVendedor.telefonoEmpresa} onChange={(e) => onInputchangeEmpresa(e)} />
              </div>
            
              {
                editandoEmpresa && <div style={{ display: 'flex', justifyContent: 'end', alignSelf:"end" }}>
                  <Button type='primary' onClick={onAcceptEditEmpresa}>Modificar</Button>
                </div>
              }
            </div>
          
          </div>
        </div>
      </Col >
      <Col className={styles.colPequeño} style={{ width: "30%" }}>
        <Form
          name="cambiarContrasena"
          layout='vertical'
          scrollToFirstError
          onFinish={cambiarContrasena}
        >
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
            <h3>Cambiar contraseña</h3>
          </div>
          <Form.Item
            name="contrasena"
            label="Contraseña antigua:"
            rules={[{ required: true, message: 'Porfavor ingrese su contraseña actual' }]}>
            <Input.Password style={{ minWidth: "235px" }} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Nueva contraseña:"
            rules={[
              {
                required: true,
                message: 'Ingrese una nueva contraseña',
              },
            ]}
            hasFeedback
          >
            <Input.Password style={{ minWidth: "235px" }} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Nueva contraseña:"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Confirme su nueva contraseña',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no son iguales'));
                },
              }),
            ]}
          >
            <Input.Password style={{ minWidth: "235px" }} />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
              Cambiar contraseña
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
export default OtherInfo;

