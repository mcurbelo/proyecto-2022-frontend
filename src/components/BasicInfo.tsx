import React, { FC, useEffect, useState } from 'react';
import { UserService } from 'shopit-shared'
import '../main.css';
import { Avatar, Button, Divider, Form, Modal, Row, Upload, UploadFile, UploadProps } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useMitt } from 'react-mitt';


type basicinfo = {
  nombre: string,
  imagenPerfil: string
}

const useStyles = createUseStyles({
  "@global": {
    ".ant-upload-list ant-upload-list-text": {
      width: "200px"
    },
    ".ant-upload-list-text-container": {
      width: "200px"
    },
  },
})

const { confirm } = Modal;

export const BasicInfo: FC<basicinfo> = (props) => {
  const styles = useStyles();
  const { emitter } = useMitt()
  const navigate = useNavigate();
  const uuid: string = (localStorage.getItem("uuid") as string);
  const token: string = (localStorage.getItem("token") as string);
  let { imagenPerfil } = props
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imagenPerfilMostrar, setImagenPerfilMostrar] = useState("");


  const actualizarInformacion = () => {
    emitter.emit('actualizarInfo', {});
  };

  const cambiarImagen = () => {
    UserService.updateImagen(token, uuid, selectedFile!).then((response) => {
      if (response.success) {
        Modal.success({
          title: "Edición completada con éxito",
          content: 'Su imagen de perfil se ha actualizado exitosamente',
        });
        setImagenPerfilMostrar(URL.createObjectURL(selectedFile!))
        actualizarInformacion();
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
    setImagenPerfilMostrar(imagenPerfil);
  }, [props]);

  const propsUpload: UploadProps = {
    onRemove: file => {
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
      cancelText: "Cancelar",
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

  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar className="profilePic" size={150} alt='Avatar' icon={<UserOutlined />} src={imagenPerfilMostrar}></Avatar>
      </div>
      <Divider></Divider>
      <Row>
        <Form
          name="cambiarImagen"
          layout='vertical'
          onFinish={cambiarImagen}
        >
          <Form.Item
            valuePropName='filelist'
            name="imagen"
            rules={[{ required: true, message: 'Debe selecciona una imagen' }]}
          >
            <Upload {...propsUpload} maxCount={1} accept="image/png, image/jpeg" >
              <Button icon={<UploadOutlined />}>Seleccione una imagen</Button>
            </Upload>
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
            <Button type="primary" htmlType="submit" loading={isLoading} disabled={selectedFile === undefined} style={{ width: "150px" }}>
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

