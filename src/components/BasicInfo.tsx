import React, { FC, useState } from 'react';
import { UserService } from 'shopit-shared'
import '../main.css';
import { Avatar, Button, Divider, Form, Modal, Row, Upload, UploadFile, UploadProps } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


type basicinfo = {
  nombre: string,
  imagenPerfil: string
}
const { confirm } = Modal;

export const BasicInfo: FC<basicinfo> = (props) => {
  const navigate = useNavigate();
  const uuid: string = (localStorage.getItem("uuid") as string);
  const token: string = (localStorage.getItem("token") as string);
  let { imagenPerfil } = props
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);



  const cambiarImagen = () => {
    UserService.updateImagen(token, uuid, selectedFile!).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edicion completada con éxito",
          content: 'Su imagen de perfil se han actualizado exitosamente',
        });
        imagenPerfil = URL.createObjectURL(selectedFile!);
        //Evento a la navbar
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
      content: 'Si confirma, su cuenta será eliminda y dejará de estar disponible. No puede tener compras ni ventas pendientes.',
      onOk() {
        return UserService.eliminarCuenta(token, uuid).then((response) => {
          if (response.success) {
            Modal.success({
              title: "Cuenta eliminada con éxito",
              content: 'Su cuenta se ha eliminado exitosamente',
            });
            localStorage.removeItem("token")
            localStorage.removeItem("uuid")
            navigate("/")
          }
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
        <Avatar className="profilePic" size={150} alt='Avatar' icon={<UserOutlined />} src={imagenPerfil}></Avatar>
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
            valuePropName="fileList"
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
      <Divider></Divider>
    </div>
  )
}

