import { Col, Row, Image, List, Typography, Rate } from "antd";
import React, { useEffect, useState } from "react";
import src, { createUseStyles } from "react-jss";
import { useParams } from "react-router-dom";
import { ProductoService } from "shopit-shared";
import { DtProducto } from "shopit-shared/dist/user/ProductoService";

interface AppState {
  producto: DtProducto
  imagen: string
}

const useStyles = createUseStyles({
  "@global": {
    "ant-list-item:hover": {
      boxShadow: '0 0 4px #eee'
    }
  },

})

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 4',
  },
];
const { Text, Link, Paragraph } = Typography;

export const InfoProducto = () => {
  let { id } = useParams();
  const styles = useStyles();
  const [producto, setProducto] = useState<AppState["producto"]>();
  const [imangeSeleccionada, setImagen] = useState<AppState["imagen"]>();
  const [ellipsis, setEllipsis] = useState(true);
  useEffect(() => {
    if (id) {
      ProductoService.infoProducto(id).then((result) => {
        if (result != undefined) {
          setProducto(result);
        }
      })
    }
  }, [])

  const seleccionarImagen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setImagen(event.currentTarget.id)
  }
  const estadoStock = () => {
    if (producto != undefined && producto?.stock >= 30)
      return <Text type="success">En stock</Text>

    if (producto != undefined && producto?.stock < 30 && producto?.stock > 10)
      return <Text type="warning">Stock medio</Text>

    if (producto != undefined && producto?.stock <= 10 && producto?.stock > 0)
      return <Text type="danger">Últimas unidades</Text>
    else
      return <Text mark>Sin stock</Text>

  }
  //TOOD Mostrar garantia
  return (
    <Row style={{ gap: "3%" }}>
      <Col>
        <h1> Imagenes</h1>
        <div style={{ display: 'flex' }}>
          <List
            itemLayout="horizontal"
            style={{ display: "flex" }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Image
                  width={50}
                  id="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  preview={false}
                  onClick={seleccionarImagen}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </List.Item>
            )}
          />
          <div style={{ marginLeft: "5%" }}>
            <Image
              width={200}
              src={imangeSeleccionada}
            />
          </div>
        </div>
      </Col>
      <Col>
        <h1>Informacion</h1>
        <Text> {producto?.nombre}</Text>
        <hr />
        <Text>$ {producto?.precio}</Text>
        <hr />
        <Text>Vendedor: {producto?.nombreVendedor}</Text>  <Rate disabled defaultValue={producto?.calificacion} /> <Text>{producto?.calificacion}/5</Text>
        <hr />
        <Text>Garantía:</Text>
        <hr />
        <Text>Diponibilidad: <b>{estadoStock()}</b></Text>
        <hr />
        <Text>Forma de entrega: {(producto?.permiteEnvio) ? <Text>envío o retiro</Text> : <Text>Solo retiro</Text>}</Text>
        <hr />
        <Text>Mas información del producto: </Text>
      </Col>
      <Col>
        <h1> Cartel de compra</h1>
      </Col>
    </Row>
  )

}
export default InfoProducto;
