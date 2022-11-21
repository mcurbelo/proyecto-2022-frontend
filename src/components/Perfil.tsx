import { FC, useState } from 'react'
import { BasicInfo } from './BasicInfo';
import { OtherInfo } from './OtherInfo';
import "../main.css"
import { Card, Col, Row } from 'antd';



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
    <>
      <h1 style={{textAlign:"center"}}>Mi perfil</h1>
      <Row style={{ justifyContent: "center", gap: "5%" }}>
        <Col>
          <Card>
            <BasicInfo nombre={infoUsuario.nombre} imagenPerfil={infoUsuario.imagen} />
          </Card>
        </Col>
        <OtherInfo imagenGet={(src) => onGetImagen(src)} />
      </Row>
    </>

  )
}

export default Perfil