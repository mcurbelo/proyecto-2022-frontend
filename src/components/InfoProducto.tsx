import { Col, Row, Image, List, Typography, Rate, Card, Button, InputNumber, Divider, Avatar, Popover, Space, Modal, Tooltip, Comment } from "antd";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate, useParams } from "react-router-dom";
import { ProductoService } from "shopit-shared";
import { DtProducto } from "shopit-shared/dist/user/ProductoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxesStacked, faCartPlus, faCirclePlus, faCircleXmark, faMoneyBill1, faShop, faTruckFast, faWallet } from "@fortawesome/free-solid-svg-icons";
import tarjetas from '../images/tarjetas.jpg';
import { DtCompra } from "shopit-shared/dist/user/CompradorService";

interface AppState {
  producto: DtProducto
  imagen: string
}

const useStyles = createUseStyles({
  listaImagenes: {
    '& li:first-child': {
      paddingTop: '0'
    },
    width: "min-content"
  },
  container: {
    display: "inline-flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },

  container2: {
    display: "inline-flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  infoProducto: {
    width: "25%"
  },
  compra: {
    width: "25%",
  },
  '@media screen and (max-width: 1000px)': {
    container: {
      flexDirection: "column"
    },
    infoProducto: {
      width: "100%"
    },
    compra: {
      width: "100%",
    },

  },

  '@media screen and (max-width: 576px)': {
    listaImagenes: {
      width: "auto"
    },
    container2: {
      flexDirection: "column"
    }
  }
})

const { Text, Paragraph } = Typography;

const data = [
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title="2016-11-22 11:22:33">
        <span>8 hours ago</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title="2016-11-22 10:22:33">
        <span>9 hours ago</span>
      </Tooltip>
    ),
  },
];

export const InfoProducto = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const styles = useStyles();
  const [producto, setProducto] = useState<AppState["producto"]>();
  const [imangeSeleccionada, setImagen] = useState<AppState["imagen"]>();
  const [ellipsis, setEllipsis] = useState(true);
  const [counter, setCounter] = useState(0);
  const [cantidadProducto, setCantidad] = useState(1);

  useEffect(() => {
    if (id) {
      ProductoService.infoProducto(id).then((result) => {
        if (typeof result !== 'string') {
          setProducto(result);
          setImagen(result.imagenes.at(0))
        } else {
          Modal.error({
            content: result + ".",
          });
          navigate("/");
        }
      })
    }
  }, [])

  const seleccionarImagen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setImagen(event.currentTarget.id)
  }
  const estadoStock = () => {
    if (producto != undefined && producto?.stock >= 30)
      return <Text type="success">En stock<FontAwesomeIcon icon={faBoxesStacked} /></Text>

    if (producto != undefined && producto?.stock < 30 && producto?.stock > 10)
      return <Text type="warning">Stock medio <FontAwesomeIcon icon={faBoxesStacked} /></Text>

    if (producto != undefined && producto?.stock <= 10 && producto?.stock > 0)
      return <Text type="danger">Últimas unidades  <FontAwesomeIcon icon={faBox} /></Text>
    else
      return <Text mark>Sin stock <FontAwesomeIcon icon={faCircleXmark} /></Text>

  }

  const onChange = (value: number | null) => {
    if (value != null)
      setCantidad(value)
    else
      setCantidad(0)
  };

  const expansion = () => {
    setEllipsis(!ellipsis);
    setCounter(ellipsis ? counter + 0 : counter + 1)
  };

  const renderDescripcion = () => {
    return (
      <Paragraph key={counter} ellipsis={ellipsis ? { rows: 3, expandable: true, symbol: 'Ver más', onExpand: expansion } : false}>
        {producto?.descripcion}
      </Paragraph>
    )
  }

  const content = (
    <div>
      <Text>Período de tiempo disponible para hacer reclamos luego de haber recibido/retirado el producto.</Text>
    </div>
  );

  const realizarCompra = () => {
    if (cantidadProducto === 0) {
      Modal.warning({
        content: "Cantidad de unidades invalida.",
      });
    }
    else if (producto?.stock && cantidadProducto > producto?.stock) {
      Modal.warning({
        content: "La cantidad de unidades solicitadas es superior al stock actual.",
      });
    } else {
      const infoCompra: DtCompra = {
        idVendedor: producto?.idVendedor || "",
        idProducto: producto?.idProducto || "",
        cantidad: cantidadProducto || 0,
        esParaEnvio: false,
        idTarjeta: "",
        idDireccionEnvio: -1,
        idDireccionLocal: -1
      }
      localStorage.setItem("infoCompra", JSON.stringify(infoCompra))
      navigate("/compra", { state: { producto: producto } })
    }
  }



  return (
    <Row className={styles.container} style={{ gap: "3%", justifyContent: "center" }}>
      <Col style={{ display: "flex", justifyContent: "center" }}>
        <Row gutter={16} className={styles.container2} >
          <Col className={styles.listaImagenes} style={{ display: "flex" }}>
            <List
              style={{ display: "flex" }}
              className={styles.listaImagenes}
              dataSource={producto?.imagenes}
              grid={{
                xs: 5,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
              }}
              renderItem={item => (
                <List.Item style={{ cursor: "pointer" }}>
                  <Image
                    width={60}
                    id={item}
                    preview={false}
                    onClick={seleccionarImagen}
                    src={item}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col>
            <Image
              width={350}
              height={300}
              src={imangeSeleccionada}
            />
          </Col>
        </Row>
      </Col>
      <Col className={styles.infoProducto}>
        <Card>
          <h2> {producto?.nombre}</h2>
          <hr />
          <Text><Avatar size="large" src={producto?.imagenDePerfil} /> {producto?.nombreVendedor}</Text>
          <hr />
          <Text>Calificación: </Text><Rate disabled defaultValue={producto?.calificacion} /> <Text strong={true}> {producto?.calificacion}/5</Text>
          <hr />
          <Space>
            <Text>Garantía: {producto?.garantia}</Text> <Popover content={content} trigger="click">
              <Button type="primary" style={{ width: "20px" }} >?</Button>
            </Popover>
          </Space>
          <hr />
          <Text>Diponibilidad: <b>{estadoStock()}</b></Text>
          <hr />
          <Text>Forma de entrega: {(producto?.permiteEnvio) ? <Text><b>Envío</b> <FontAwesomeIcon icon={faTruckFast} /> | <b>Retiro</b>  <FontAwesomeIcon icon={faShop} /></Text> : <Text><b>Solo retiro</b> <FontAwesomeIcon icon={faShop} /></Text>}</Text>
          <hr />
          <Text>Más información del producto: </Text>
          {renderDescripcion()}
          {!ellipsis && <a onClick={expansion}>Ver menos</a>}
        </Card>
      </Col>
      <Col className={styles.compra}>
        <Card>
          <div>
            <h4>$ {producto?.precio}  (Pesos uruguayos)</h4>
            <Divider />
            <Text> <FontAwesomeIcon icon={faCirclePlus} color='#52c41a' /> <b>Agrega productos</b> al carrito para pagar varios productos en una sola transacción.</Text>
            <Divider>O</Divider>
            <Text> <FontAwesomeIcon icon={faMoneyBill1} color='#459E19' /> <b>Compra directamente</b> el producto con ingresando la cantidad deseada.</Text>
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text>Cantidad:</Text>
              <InputNumber id="cantidad" min={1} defaultValue={1} onChange={onChange} />
            </div>
            <Image
              width={170}
              preview={false}
              src={tarjetas} />
          </div>
          <Divider />
          <div>
            <Button type="primary" block style={{ marginBottom: "3%" }} onClick={realizarCompra}>
              Comprar ahora <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faWallet} /></Button>
            <Button block>
              Agregar al carrito<FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faCartPlus} /></Button>
          </div>
        </Card>
      </Col>
      <div>
        <List
          className="comment-list"
          header={`${data.length} replies`}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <li>
              <Comment actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime} />
            </li>
          )}
        />
      </div>
    </Row>
  )
}
export default InfoProducto;
