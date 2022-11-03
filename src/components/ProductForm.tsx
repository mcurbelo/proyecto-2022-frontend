import { UploadOutlined } from "@ant-design/icons";
import { Button, Carousel, Checkbox, DatePicker, Form, Image, Input, InputNumber, Modal, Typography } from "antd";
import { format } from "date-fns";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Navigate, useNavigate } from "react-router";
import { CompradorService, VendedorService } from "shopit-shared";
import { Directions } from "./Directions";
import PickerCategoria from "./PickerCategoria";


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
  const [selectedImages, setImage] = useState([] as File[])
  const [permiteEnvios, setPermiteEnvios] = useState(false)
  const [esEmpresa, setEsEmpresa] = useState(false)
  const [categorias, setCategorias] = useState([] as string[])
  const [idDireccion, setIdDireccion] = useState("")
  const styles = useStyles()
  const navigate = useNavigate()

  const successModal = () => {
    Modal.success({
      title: "Producto agregado exitosamente!"
    })
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
        successModal()
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }).catch((error) => {
        errorModal(error.response.data.message)
      })
    } else {
      VendedorService.altaProducto(datosProducto, selectedImages, token!).then((response) => {
        successModal()
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

      {(idDireccion.length == 0 && esSolicitud) && <Directions permiteSeleccion={true} onSelectDirection={(id) => {
        setIdDireccion(id)
      }} />}

      {(selectedImages.length > 0) && (
        <Carousel autoplay style={{ background: "#f9f9f9" }}>
          {selectedImages.map((image) => {
            return (
              <div key={image.name} style={{ display: "flex", justifyItems: "center" }}>
                <Image alt="Sin imagen" src={URL.createObjectURL(image)} />
                <Button
                  danger
                  style={{ justifySelf: "center" }}
                  onClick={() => {
                    (document.getElementById("fileInput") as HTMLInputElement).value = ""
                    let toDelete = selectedImages.find(e => e.name == image.name)
                    setImage(selectedImages.filter(i => i != toDelete))
                  }}
                >Eliminar</Button>
              </div>
            )
          })}
        </Carousel>
      )}
      {(idDireccion.length != 0 || !esSolicitud) && (<><Button
        disabled={selectedImages.length == 5}
        icon={<UploadOutlined />}
        type="primary"
        onClick={() => { document.getElementById("fileInput")?.click() }}
      >
        Agregar Imagen
        <input
          style={{ display: "none" }}
          id="fileInput"
          type="file"
          name="myImage"
          onChange={(event) => { setImage(selectedImages.concat(event.target.files![0])); }}
        />
      </Button>
        <Form
          layout="vertical"
          style={{ marginTop: 15 }}
          onFinish={(values) => { handleFormSubmition(values) }}
        >
          <Form.Item
            rules={[{
              required: true,
              message: "El nombre del producto es obligatorio"
            }]}
            name="nombreProducto"
            label="Nombre del producto"
          >
            <Input placeholder="Bicicleta" />
          </Form.Item>

          <Form.Item
            rules={[{
              required: true,
              message: "El stock del producto es obligatorio"
            }]}
            name="stockProducto"
            label="Stock del producto"
          >
            <Input placeholder="100" />
          </Form.Item>

          <Form.Item
            rules={[{
              required: true,
              message: "La descripción del producto es obligatoria y un máximo de 255 caracteres",
              max: 255
            }]}
            name="descripcionProducto"
            label="Descripcion del producto"
          >
            <Input.TextArea placeholder="Bicicleta rodado 20" size="large" />
          </Form.Item>

          <Form.Item
            label="Precio del producto"
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
          >
            <InputNumber placeholder="180" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="fechaFinProducto"
            label="Fecha fin de la publicación"
          >
            <DatePicker placeholder="23/5/2023" style={{ width: "100%" }} />
          </Form.Item>

          <Typography.Text>Categorias</Typography.Text>

          <PickerCategoria onSelect={categorias => {
            setCategorias(categorias)
            console.log(categorias)
          }} />

          <div style={{ height: 15 }} />

          <Form.Item name="permiteEnvio">
            <Checkbox checked={permiteEnvios} onChange={() => setPermiteEnvios(!permiteEnvios)}>Permite envio</Checkbox>
          </Form.Item>

          <Checkbox
            style={{ visibility: esSolicitud ? "visible" : "hidden" }}
            checked={esEmpresa}
            onChange={() => setEsEmpresa(!esEmpresa)}
          >Tengo una empresa</Checkbox>

          {esEmpresa && <Typography.Title level={5}>Información de vendedor</Typography.Title>}

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

          <Form.Item>
            <Button disabled={selectedImages.length == 0 || categorias.length == 0} style={{ width: "100%" }} type="primary" htmlType="submit">Agregar Producto</Button>
          </Form.Item>
        </Form></>)}
    </div>
  );
}

export default AddProductForm;