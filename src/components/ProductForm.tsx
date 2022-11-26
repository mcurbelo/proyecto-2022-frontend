import { UploadOutlined } from "@ant-design/icons";
import { Checkbox, DatePicker, Divider, Form, Image, Input, InputNumber, List, Modal, Row, Spin, Typography } from "antd";
import { format } from "date-fns";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router";
import { CompradorService, VendedorService } from "shopit-shared";
import { Directions } from "./Directions";
import PickerCategoria from "./PickerCategoria";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import Button from "antd-button-color";
import { useMitt } from "react-mitt";

const useStyles = createUseStyles({
  "@global": {
    ".ant-carousel .slick-dots li button": {
      background: "#096dd9",
      opacity: 0.2
    },
    ".ant-carousel .slick-dots li.slick-active button": {
      opacity: 1,
      background: "#096dd9"
    }
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center"
  }

})
const AddProductForm = ({ esSolicitud = false }) => {
  const { emitter } = useMitt()
  const [selectedImages, setImage] = useState([] as File[])
  const [permiteEnvios, setPermiteEnvios] = useState(false)
  const [esEmpresa, setEsEmpresa] = useState(false)
  const [categorias, setCategorias] = useState([] as string[])
  const [idDireccion, setIdDireccion] = useState("")
  const [isLoading, setLoading] = useState(false)

  const styles = useStyles()
  const navigate = useNavigate()

  const successModal = () => {
    Modal.success({
      title: "Producto agregado exitosamente!"
    })
  }

  const successModalSolicitud = () => {
    Modal.success({
      title: "Solicitud enviada exitosamente!"
    })
  }

  const bloquearOtraSolicitud = () => {
    emitter.emit('bloquearSolicitud', {});
  }

  const errorModal = (mensaje: string) => {
    Modal.error({
      title: "Ha ocurrido un error",
      content: mensaje
    })
  }
  const handleFormSubmition = (values: any) => {
    let token = localStorage.getItem("token")
    let formatted = ""
    if (values.fechaFinProducto) {
      let dateFechaNac = new Date((values.fechaFinProducto as any)._d)
      formatted = format(dateFechaNac, "dd/MM/yyyy")
    }
    let datosProducto = {
      nombreProducto: values.nombreProducto,
      stock: values.stockProducto,
      descripcion: values.descripcionProducto,
      fechaFin: formatted,
      precio: values.precioProducto,
      diasGarantia: values.garantiaProducto,
      permiteEnvio: permiteEnvios,
      categorias: categorias.map(item => item)
    }
    if (esSolicitud) {
      let datosEmpresa = {}
      if (esEmpresa) datosEmpresa = {
        nombreEmpresa: values.nombreEmpresa,
        rut: values.rutEmpresa,
        telefonoEmpresa: values.telefonoEmpresa
      }
      CompradorService.enviarSolicitudVendedor({
        ...datosEmpresa,
        producto: datosProducto,
        idDireccion: idDireccion
      }, selectedImages, token!).then((response) => {
        successModalSolicitud()
        setLoading(false);
        setTimeout(() => {
          navigate("/")
        }, 2000)
        bloquearOtraSolicitud();
      }).catch((error) => {
        errorModal(error.response.data.message)
      })
    } else {
      VendedorService.altaProducto(datosProducto, selectedImages, token!).then((response) => {
        successModal()
        setLoading(false);
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }).catch((error) => {
        errorModal(error.response.data.message)
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      {(idDireccion.length == 0 && esSolicitud) &&
        <Row justify="center">
          <div style={{ width: "70%" }}>
            <Directions permiteSeleccion={true} esVendedor={false} onSelectDirection={(id) => {
              setIdDireccion(id)
            }} />
          </div>
        </Row>
      }
      <h2>Imagenes</h2>
      {(selectedImages.length > 0) && (
        <Image.PreviewGroup>
          <>
            <List
              grid={{
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 5,
                xxl: 5,
              }}
              dataSource={selectedImages}
              renderItem={(item, index) => (
                <List.Item style={{ textAlign: "center" }}>
                  <Image alt="Sin imagen" width={150} height={150} src={URL.createObjectURL(item)} />
                  <Divider></Divider>
                  <div>
                    <Button
                      danger
                      style={{ justifySelf: "center" }}
                      onClick={() => {
                        (document.getElementById("fileInput") as HTMLInputElement).value = ""
                        let toDelete = selectedImages.find(e => e.name == item.name)
                        setImage(selectedImages.filter(i => i != toDelete))
                      }}
                    >Eliminar</Button>
                  </div>
                </List.Item>
              )}
            />
          </>
        </Image.PreviewGroup>

      )}

      {(idDireccion.length != 0 || !esSolicitud) && (<><Button
        disabled={selectedImages.length == 5}
        icon={<UploadOutlined />}
        type="primary"
        onClick={() => { document.getElementById("fileInput")?.click() }}
      >
        Agregar imagen
        <input
          style={{ display: "none" }}
          id="fileInput"
          type="file"
          accept="image/*"
          name="myImage"
          onChange={(event) => { setImage(selectedImages.concat(event.target.files![0])); }}
        />
      </Button>
        <Divider></Divider>
        <h2>Información sobre el producto</h2>
        <Form
          layout="vertical"
          style={{ marginTop: 15 }}
          onFinish={(values) => { setLoading(true); handleFormSubmition(values) }}
        >
          <Form.Item
            rules={[{
              required: true,
              message: "El nombre del producto es obligatorio"
            }]}
            name="nombreProducto"
            label="Nombre:"
          >
            <Input placeholder="Bicicleta" />
          </Form.Item>

          <Form.Item
            rules={[{
              required: true,
              message: "El stock del producto es obligatorio",

            }]}
            name="stockProducto"
            label="Stock inicial"
          >
            <InputNumber placeholder="100" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            rules={[{
              required: true,
              message: "La descripción del producto es obligatoria y un máximo de 255 caracteres",
              max: 255
            }]}
            name="descripcionProducto"
            label="Descripción"
          >
            <Input.TextArea placeholder="Bicicleta rodado 20" size="large" />
          </Form.Item>

          <Form.Item
            label="Precio (pesos uruguayos)"
            rules={[{
              required: true,
              message: "El precio del producto es obligatorio"
            }]}
            name="precioProducto"
            initialValue={1000}
          >
            <InputNumber formatter={(value) => `$${value}`} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="garantiaProducto"
            label="Días de garantía"
            rules={[{
              required: true,
              message: "La garantía no puede quedar vacía",
            }]}
          >
            <InputNumber placeholder="180" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="fechaFinProducto"
            label="Fecha fin de la publicación (opcional)"
          >
            <DatePicker placeholder="23/5/2023" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>

          <Typography.Text>Categorias</Typography.Text>

          <PickerCategoria onSelect={categorias => {
            setCategorias(categorias)
          }} />

          <div style={{ height: 15 }} />

          <Form.Item name="permiteEnvio">
            <Checkbox checked={permiteEnvios} onChange={() => setPermiteEnvios(!permiteEnvios)}>Permite envio</Checkbox>
          </Form.Item>
          {
            esSolicitud ?
              <>
                <Divider></Divider>
                <h2>Datos extras</h2>

              </>
              : null

          }
          <Checkbox
            style={{ visibility: esSolicitud ? "visible" : "hidden" }}
            checked={esEmpresa}
            onChange={() => setEsEmpresa(!esEmpresa)}
          >Tengo una empresa</Checkbox>

          {esEmpresa &&

            <Divider>Información de la empresa</Divider>}

          {esEmpresa && <Form.Item
            rules={[{
              required: true,
              message: "El nombre de la empresa es obligatorio"
            }]}
            name="nombreEmpresa"
            label="Nombre empresa">
            <Input placeholder="Colchones Dormilones SA" />
          </Form.Item>}

          {esEmpresa && <Form.Item
            rules={[{
              required: true,
              message: "El RUT de la empresa es obligatorio"
            }]}
            name="rutEmpresa"
            label="RUT">
            <Input placeholder="1234567891012162" />
          </Form.Item>}

          {esEmpresa && <Form.Item
            rules={[{
              required: true,
              message: "El numero de telefono de la empresa es obligatorio"
            }]}
            name="telefonoEmpresa"
            label="Numero de teléfono">
            <Input placeholder="1234567891012162" />
          </Form.Item>}
          <Divider></Divider>
          <Form.Item>

            <Button htmlType="submit" loading={isLoading} disabled={selectedImages.length == 0 || categorias.length == 0} style={{ width: "100%" }}
              type="success">{(esSolicitud) ? "Enviar solicitud" : "Agregar producto"}</Button>

          </Form.Item>
        </Form>
      </>)

      }
    </div>
  );
}

export default AddProductForm;