import React, { FC, useState } from 'react';
import { CompradorService, UserService } from 'shopit-shared'
import '../main.css';
import userDefault from "../images/user.png"
import { Button, Divider, Form, Modal, Row, Upload, UploadFile, UploadProps } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';


type basicinfo = {
  nombre: string,
  imagenPerfil: string
}
const { confirm } = Modal;

export const BasicInfo: FC<basicinfo> = (props) => {
  const uuid: string = (localStorage.getItem("uuid") as string);
  const token: string = (localStorage.getItem("token") as string);
  const { imagenPerfil } = props
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    setSelectedFile(fileList![0]);
  }

  const cambiarImagen = () => {
    UserService.updateImagen(token, uuid, selectedFile!).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edicion completada con éxito",
          content: 'Su imagen de perfil se han actualizado exitosamente',
        });
      }
      else {
        Modal.error({
          title: 'Error',
          content: response.message,
        });
      }
    })
  }

  const propsUpload: UploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setSelectedFile(undefined)
    },
    beforeUpload: file => {
      setSelectedFile(new File([file], "imagen"))
      return false;
    }
  };

  const eliminarCuenta = () => {
    confirm({
      title: 'Realmente quiere eliminar su cuenta?',
      icon: <ExclamationCircleOutlined />,
      content: 'Si confirma, su cuenta será eliminda y dejará de estar disponible',
      onOk() {
        return UserService.eliminarCuenta(token, uuid).then((response) => {
          if (response.success) {
            Modal.success({
              title: "Cuenta eliminada con éxito",
              content: 'Su cuenta se ha eliminado exitosamente',
            });
          }
          //Cerrar sesion
          else {
            Modal.error({
              title: 'Error',
              content: response.message,
            });
          }
        })
      },
      onCancel() { },
    });


  }

  return (

    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img className="profilePic" alt='Avatar'{... (imagenPerfil !== "") ? { src: imagenPerfil } : { src: userDefault }}></img>
      </div>
      <Row>
        <Form
          name="cambiarImagen"
          layout='vertical'
          scrollToFirstError
          onFinish={cambiarImagen}
        >
          <Form.Item
            name="imagen"
            rules={[{ required: true, message: 'Debe selecciona una imagen' }]}
          >
            <Upload {...propsUpload} maxCount={1} accept="image/png, image/jpeg">
              <Button icon={<UploadOutlined />}>Seleccione una imagen</Button>
            </Upload>

          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
              Cambiar imagen
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Divider></Divider>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button type='primary' size='large' danger onClick={eliminarCuenta}>Eliminar cuenta</Button>
      </div>
    </div>
  )
}

