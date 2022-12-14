import { Col, Row, Image, List, Typography, Rate, Card, Button, InputNumber, Divider, Avatar, Space, Modal, Tooltip, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductoService } from "shopit-shared";
import { DtProducto } from "shopit-shared/dist/user/ProductoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxesStacked, faCartPlus, faCirclePlus, faCircleXmark, faMoneyBill1, faShop, faTruckFast, faWallet } from "@fortawesome/free-solid-svg-icons";
import tarjetas from '../images/tarjetas.jpg';
import { DtCompra } from "shopit-shared/dist/user/CompradorService";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

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
    width: "24%",
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


type propInfo = {
  esAdm: boolean
}

export const InfoProducto = (props: propInfo) => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { esAdm } = props;
  const styles = useStyles();
  const [producto, setProducto] = useState<AppState["producto"]>();
  const [imangeSeleccionada, setImagen] = useState<AppState["imagen"]>();
  const [cantidadProducto, setCantidad] = useState(1);
  const [usuarioLogueado, setLogeado] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      if (new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).test(id)) {
        ProductoService.infoProducto(id).then((result) => {
          if (typeof result !== 'string') {
            setProducto(result);
            setImagen(result.imagenes.at(0))
            setLoading(false);
          } else {
            Modal.error({
              content: result + ".",
            });
            navigate("/");
          }
        })
      } else {
        Modal.error({
          content: "El producto no existe.",
        });
        navigate("/");
      }
    }

    if (localStorage.getItem("token"))
      setLogeado(true)
  }, [])

  const seleccionarImagen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setImagen(event.currentTarget.id)
  }
  const estadoStock = () => {
    if (producto != undefined && producto?.stock >= 30)
      return <Text type="success">En stock<FontAwesomeIcon icon={faBoxesStacked} style={{ display: "inline-block", marginLeft: "5px" }} /></Text>

    if (producto != undefined && producto?.stock < 30 && producto?.stock > 10)
      return <Text type="warning">Stock medio<FontAwesomeIcon icon={faBoxesStacked} style={{ display: "inline-block", marginLeft: "5px" }} /></Text>

    if (producto != undefined && producto?.stock <= 10 && producto?.stock > 0)
      return <Text type="danger">??ltimas unidades<FontAwesomeIcon icon={faBox} style={{ display: "inline-block", marginLeft: "5px" }} /></Text>
    else
      return <Text mark>Sin stock<FontAwesomeIcon icon={faCircleXmark} style={{ display: "inline-block", marginLeft: "5px" }} /></Text>

  }

  const onChange = (value: number | null) => {
    if (value != null)
      setCantidad(value)
    else
      setCantidad(0)
  };


  const renderDescripcion = () => {
    return (
      <>
        <br />
        <TextArea contentEditable={false} value={producto?.descripcion} bordered={false} autoSize={{ minRows: 1, maxRows: 7 }} style={{ padding: 0 }}></TextArea>
      </>
    )
  }


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

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <Row justify="center">
      <h1> Informaci??n de producto</h1>
      <Row className={styles.container} style={{ gap: "3%", justifyContent: "center", width: "100%" }}>
        {isLoading ?
          <Row justify="center" style={{ alignItems: "center", marginTop: "10%" }}>
            <Spin spinning={true} indicator={antIcon} tip="Cargando producto..." />
          </Row>
          :
          <>
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
                    height={350}
                    src={imangeSeleccionada}
                  />
                </Col>
              </Row>
            </Col>
            <Col className={styles.infoProducto}>
              <Card>
                <h2> {producto?.nombre}</h2>
                <hr />
                <Text><Avatar size="large" icon={<UserOutlined />} src={producto?.imagenDePerfil} /> {producto?.nombreVendedor}</Text>
                <hr />
                <Text>Calificaci??n: </Text><Rate disabled value={parseFloat(producto?.calificacion.toFixed(2)!)} /> <Text strong={true}> {producto?.calificacion.toFixed(2)}/5</Text>
                <hr />
                <Space>
                  <Text>Garant??a: {producto?.garantia} d??as</Text><Tooltip title="Per??odo de tiempo disponible para hacer reclamos luego de haber recibido/retirado el producto.">
                    <FontAwesomeIcon icon={faCircleQuestion}></FontAwesomeIcon>
                  </Tooltip >
                </Space>
                <hr />
                <Text>Diponibilidad: <b>{estadoStock()}</b></Text>
                <hr />
                <Text>Forma de entrega: {(producto?.permiteEnvio) ? <Text><b>Env??o</b> <FontAwesomeIcon icon={faTruckFast} /> | <b>Retiro</b>  <FontAwesomeIcon icon={faShop} /></Text> : <Text><b>Solo retiro</b> <FontAwesomeIcon icon={faShop} /></Text>}</Text>
                <hr />
                <Text>M??s informaci??n del producto: </Text>
                {renderDescripcion()}
              </Card>
            </Col>
            <Col className={styles.compra}>
              <Card>
                <div>
                  <h4>Precio: $ {producto?.precio}  (Pesos uruguayos)</h4>
                  <Divider />
                  <Text> <FontAwesomeIcon icon={faMoneyBill1} color='#459E19' /> <b>Compra directamente</b> el producto con ingresando la cantidad deseada.</Text>
                </div>
                <Divider />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Space>
                      <Text>Cantidad:</Text>
                      <InputNumber id="cantidad" min={1} defaultValue={1} onChange={onChange} />
                    </Space>
                  </div>
                  <Image
                    width={170}
                    preview={false}
                    src={tarjetas} />
                </div>
                <Divider />
                <div>
                  {
                    !usuarioLogueado ? (
                      <div style={{ textAlign: "center" }}>
                        <Text mark strong>Debes {<Link to={"/iniciarSesion"}>iniciar sesi??n</Link>} o {<Link to={"/registrarse"}>registrate</Link>} para comprar el producto.</Text>
                        <Divider></Divider>
                      </div>
                    ) : null
                  }
                  <Button type="primary" block style={{ marginBottom: "3%" }} disabled={producto?.stock == 0 || !usuarioLogueado || esAdm || producto?.idVendedor === localStorage.getItem("uuid")} onClick={realizarCompra}>
                    Comprar ahora <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faWallet} /></Button>

                </div>
              </Card>
            </Col>
          </>
        }
      </Row>

    </Row>

  )
}
export default InfoProducto;
