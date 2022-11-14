import { FC, useState } from 'react'
import { BasicInfo } from './BasicInfo';
import { OtherInfo } from './OtherInfo';
import "../main.css"
import { Button, Card, Col, Divider, Row } from 'antd';



const Perfil: FC<{}> = () => {
  const [infoUsuario, setInfoUsuario] = useState({
    apellido: "",
    correo: "",
    nombre: "",
    telefono: "",
    imagen: ""
  });


  const onGetImagen = (src: string) => {
    setInfoUsuario({ ...infoUsuario, imagen: src });
  }
  document.body.style.backgroundColor = "#FFFFFF"
  return (

      <Row style={{ justifyContent: "center", gap: "5%"}}>
        <Col>
          <BasicInfo nombre={infoUsuario.nombre} imagenPerfil={infoUsuario.imagen} />
        </Col>
        <OtherInfo imagenGet={(src) => onGetImagen(src)} />
      </Row>

  )
}

export default Perfil