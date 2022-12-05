import { FC, useState, useEffect, ChangeEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Form, Rate, Tooltip, Modal, Divider, Row, Col, Input, Typography, Space } from 'antd';
import '../main.css';
import { UserService } from "shopit-shared";
import { DtCambioContrasena } from 'shopit-shared/dist/user/UserService';
import { createUseStyles } from 'react-jss';
import { useMitt } from 'react-mitt';

const { Text } = Typography;
type otherInfoProp = {
  imagenGet: (src: string) => void
}
const useStyles = createUseStyles({
  container: {

  },

  colPequeño: {

  },

  '@media screen and (max-width: 1350px)': {
    container: {
      width: "auto !important"
    }
  },

  '@media screen and (max-width: 897px)': {
    container: {
      width: "90% !important",
      justifyContent: "center !important"
    },
    colPequeño: {
      width: "100% !important"
    }
  }


})



export const OtherInfo: FC<otherInfoProp> = (props) => {
  const { emitter } = useMitt()
  const styles = useStyles();
  const [esVendedor, setEsVendedor] = useState(false);
  const { imagenGet } = props;
  const uuid: string = (localStorage.getItem("uuid") as string);
  const token: string = (localStorage.getItem("token") as string);
  const [infoUsuario, setInfoUsuario] = useState({ uuid: uuid, apellido: "", correo: "", nombre: "", telefono: "", calificacion: 0 });

  const [infoUsuarioMod, setInfoUsuarioMod] = useState({ apellido: "", correo: "", nombre: "", telefono: "" });
  const [datosVendedor, setDatosVendedor] = useState({
    nombreEmpresa: "",
    rut: "",
    telefonoEmpresa: "",
    estadoSolicitud: "",
    calificacion: 0
  })

  const [datosVendedorMod, setDatosVendedorMod] = useState({
    nombreEmpresa: undefined,
    telefonoEmpresa: undefined,
  })
  const [imagen, setImagen] = useState("")
  const [editando, setEditando] = useState(false);
  const [editandoEmpresa, setEditandoEmpresa] = useState(false);

  const [datosCambioContrasena, setCambioContrasena] = useState<DtCambioContrasena>({
    contrasenaVieja: "",
    contrasenaNueva: ""
  })
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

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
        imagenGet(infoUsuario.imagen?.data!);
        setInfoUsuario({
          uuid: uuid,
          apellido: (infoUsuario.apellido as string),
          correo: (infoUsuario.correo as string),
          nombre: (infoUsuario.nombre as string),
          telefono: (infoUsuario.telefono as string),
          calificacion: (infoUsuario.calificacion as number)
        })
        setImagen(infoUsuario.imagen?.data as string);

      })
  }


  const onAcceptEdit = () => {

    let body = {
      uuid: uuid,
      apellido: (infoUsuarioMod.apellido != "") ? infoUsuarioMod.apellido : infoUsuario.apellido,
      correo: (infoUsuarioMod.correo != "" && infoUsuarioMod.correo != infoUsuario.correo) ? infoUsuarioMod.correo : infoUsuario.correo,
      nombre: (infoUsuarioMod.nombre != "") ? infoUsuarioMod.nombre : infoUsuario.nombre,
      telefono: (infoUsuarioMod.telefono != infoUsuario.telefono) ? infoUsuarioMod.telefono : infoUsuario.telefono,
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
        if (infoUsuarioMod.nombre !== "" && (infoUsuario.nombre !== infoUsuarioMod.nombre)) {
          setInfoUsuario({ ...infoUsuario, nombre: infoUsuarioMod.nombre })
          actualizarInformacion(body.nombre)
        }
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

    UserService.updateDatosEmpresa(token, uuid, datosVendedorMod).then((response) => {
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
    setInfoUsuarioMod(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }
    ));
  }

  const onInputchangeEmpresa = (e: ChangeEvent<HTMLInputElement>) => {
    setDatosVendedorMod({ ...datosVendedorMod, [e.target.name]: e.target.value })
  }

  const cambiarContrasena = () => {
    setLoading(true);
    UserService.updateContrasena(token, uuid, datosCambioContrasena).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edición completada con éxito",
          content: 'Sus datos se han actualizado exitosamente',
        });
        setEditando(!editando);
        setLoading(false);
        form3.resetFields();
      }
      else {
        Modal.error({
          title: 'Error',
          content: response.message,
        });
        setLoading(false);
      }
    })

  }


  useEffect(() => {
    loadInfoUser();
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [infoUsuario]);

  useEffect(() => {
    if (datosVendedor && datosVendedor.nombreEmpresa!)
      form2.resetFields();
  }, [datosVendedor]);

  const actualizarInformacion = (nombre: string) => {
    emitter.emit('actualizarInfoNombre', { data: nombre });
  };

  return (
    <Row className={styles.container} justify='space-between' style={{ width: "60%", backgroundColor: "white", padding: "24px" }}>
      <Col className={styles.colPequeño} style={{ width: "60%" }}>
        <div style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ marginBottom: "5px" }}>Información básica</h3>
            <Button style={{ fontSize: "25px", justifyContent: 'center', display: 'flex', border: 0 }} onClick={onEdit}>
              <EditOutlined onClick={onEdit} />
            </Button>
          </div>

          <Form
            name="editarDatosBásicos"
            layout='vertical'
            form={form}
            onFinish={onAcceptEdit}
            requiredMark={false}
            initialValues={{ nombre: infoUsuario.nombre, telefono: infoUsuario.telefono, apellido: infoUsuario.apellido, correo: infoUsuario.correo }}>

            <div className="wrapper">

              <div className='leftValues'>
                <div>
                  <Form.Item
                    name="nombre"
                    label="Nombre:"
                    rules={[{ required: true, message: 'El nombre no puede estar vacío' }]}
                  >
                    <input disabled={!editando} name='nombre' style={{ borderBottom: (editando) ? "2px solid green" : "" }} type="text" className="usuarioInput" onChange={(e) => onInputchange(e)} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="telefono"
                    label="Teléfono:"
                    rules={[{
                      max: 9,
                      message: "Solo números, con un máximo de 9 caracteres",
                      pattern: new RegExp("^[0-9]{0,9}$")
                    }
                    ]}
                  >
                    <input disabled={!editando} type="text" name='telefono' style={{ borderBottom: (editando) ? "2px solid green" : "" }} className="usuarioInput" onChange={(e) => onInputchange(e)} />
                  </Form.Item>
                </div>

                <div>
                  <Tooltip title="Calificación obtenida de los vendedores">
                    <div>
                      <label>Calificación:</label>
                      <Form.Item>
                        <Space>
                        <Rate allowHalf disabled value={infoUsuario.calificacion} />  
                        <Text strong={true}> {infoUsuario?.calificacion}/5</Text>
                        </Space>
                      </Form.Item>
                     
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className='rigthValues'>
                <div>
                  <Form.Item
                    name="apellido"
                    label="Apellido:"
                    rules={[{ required: true, message: 'El apellido no puede estar vacío' }]}
                  >
                    <input disabled={!editando} name='apellido' type="text" style={{ borderBottom: (editando) ? "2px solid green" : "" }} className="usuarioInput" onChange={(e) => onInputchange(e)} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="correo"
                    label="Correo:"
                    rules={[{ required: true, message: 'El correo no puede estar vacío', type: "email" }]}
                  >
                    <input disabled={!editando} name='correo' type="text" style={{ borderBottom: (editando) ? "2px solid green" : "" }} className="usuarioInput" onChange={(e) => onInputchange(e)} />
                  </Form.Item>
                </div>

                {
                  editando &&

                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button type='primary' htmlType='submit'>Modificar</Button>
                  </div>
                }

              </div>
            </div>
          </Form>
          {esVendedor && datosVendedor.nombreEmpresa ?
            <>
              <Divider></Divider>
              <Form
                name="editarDatosVendedor"
                layout='vertical'
                form={form2}
                onFinish={onAcceptEditEmpresa}
                requiredMark={false}
                initialValues={{ nombreEmpresa: datosVendedor.nombreEmpresa, telefonoEmp: datosVendedor.telefonoEmpresa, rut: datosVendedor.rut }}>

                <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3>Información vendedor</h3>
                  <Button style={{ fontSize: "25px", justifyContent: 'center', display: 'flex', border: 0 }} onClick={onEditEmpresa}>
                    <EditOutlined onClick={onEditEmpresa} />
                  </Button>
                </div>
                <div className="wrapper" style={esVendedor ? { display: "grid" } : { display: "none" }}>
                  <div className='leftValues'>
                    <div>
                      <Form.Item
                        name="nombreEmpresa"
                        label="Nombre empresa:"
                        rules={[{ required: true, message: 'El nombre de la empresa no puede estar vacío' }]}
                      >
                        <input disabled={!editandoEmpresa} name='nombreEmpresa' style={{ borderBottom: (editandoEmpresa) ? "2px solid green" : "" }} type="text" className="usuarioInput" onChange={(e) => onInputchangeEmpresa(e)} />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        name="rut"
                        label="RUT:">
                        <input disabled={true} name='rut' type="text" className="usuarioInput" />
                      </Form.Item>
                    </div>

                    <div>
                      <Tooltip title="Calificación obtenida de los compradores">
                        <div>
                          <label>Calificación:</label>
                          <Form.Item>
                            <Space>
                            <Rate allowHalf disabled value={datosVendedor.calificacion} />  <Text strong={true}> {datosVendedor.calificacion}/5</Text>
                            </Space>
                          </Form.Item>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <div className='rigthValues'>
                    <div>
                      <Form.Item
                        name="telefonoEmp"
                        label="Teléfono empresa:"
                        rules={[{
                          max: 9,
                          message: "Solo números, con un máximo de 9 caracteres",
                          pattern: new RegExp("^[0-9]{0,9}$")
                        }
                        ]}
                      >
                        <input disabled={!editandoEmpresa} name='telefonoEmpresa' style={{ borderBottom: (editandoEmpresa) ? "2px solid green" : "" }} type="text" className="usuarioInput" onChange={(e) => onInputchangeEmpresa(e)} />
                      </Form.Item>
                    </div>

                    {
                      editandoEmpresa && <div style={{ display: 'flex', justifyContent: 'end', alignSelf: "end" }}>
                        <Button type='primary' htmlType='submit'>Modificar</Button>
                      </div>
                    }
                  </div>

                </div>
              </Form>
            </>
            : null
          }
          {esVendedor && !datosVendedor.nombreEmpresa ?
            <>
              <Divider></Divider>
              <h3>Eres un vendedor independiente.</h3>
              <Row>
                <Tooltip title="Calificación obtenida de los compradores">
                  <label>Calificación:</label>
                  <Form.Item>
                    <Space>
                    <Rate allowHalf disabled value={datosVendedor.calificacion} />  <Text strong={true}> {datosVendedor.calificacion}/5</Text>
                    </Space>
                  </Form.Item>
                </Tooltip>
              </Row>
            </>
            : null

          }

        </div>
      </Col >
      <Col className={styles.colPequeño} style={{ width: "30%" }}>
        <Form
          name="cambiarContrasena"
          layout='vertical'
          scrollToFirstError
          form={form3}
          onFinish={cambiarContrasena}
        >
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
            <h3>Cambiar contraseña</h3>
          </div>
          <Form.Item
            name="contrasena"
            label="Contraseña antigua:"
            rules={[{ required: true, message: 'Porfavor ingrese su contraseña actual' }]}>
            <Input.Password style={{ minWidth: "235px" }} onChange={e=> {setCambioContrasena({...datosCambioContrasena, contrasenaVieja: e.target.value})} }/>
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
            <Input.Password style={{ minWidth: "235px" }} onChange={e=> {setCambioContrasena({...datosCambioContrasena, contrasenaNueva: e.target.value})} } />
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
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: "180px" }}>
              Cambiar contraseña
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>

  );
}
export default OtherInfo;

