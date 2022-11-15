import { faAddressCard, faBagShopping, faBell, faBullhorn, faCartShopping, faChartPie, faCircleChevronDown, faCirclePlus, faCircleXmark, faClipboardList, faCreditCard, faEnvelopeOpen, faEnvelopeOpenText, faMapLocationDot, faMoneyBill, faMoneyBillTrendUp, faRightFromBracket, faRightToBracket, faRoute, faUserPlus, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Dropdown, Avatar, Menu, notification, Badge, Space, Popover, Card, Typography, Row, Divider, List, Empty } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useMitt } from "react-mitt";
import { useNavigate } from "react-router";
import { CategoriaService, UserService } from "shopit-shared";
import { DtCategoria } from "shopit-shared/dist/user/CategoriaService";
import { onMessageListener } from "../firebase";
import logo from "./../images/logo192.png"
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { Link } from "react-router-dom";
import { EstadoSolicitud } from "shopit-shared/dist/user/UserService";
import { info } from "console";
import { UserOutlined } from "@ant-design/icons";
import { getMessaging, onMessage } from "firebase/messaging";
import moment from "moment";
import Meta from "antd/lib/card/Meta";

type MainHeaderProps = {}


const useStyles = createUseStyles({
  wrapper: {
    display: "grid",
    background: "#FFFFA7",
    height: 100,
    gridTemplateRows: "1fr 1fr 1fr ",
    marginBottom: "1%"
  },
  firstRow: {
    gridRow: "1 / span 2",
    display: "grid",
    marginTop: "auto",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  secondRow: {
    gridRow: "3",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto"
  },
  profileImage: {
    borderRadius: "50%",
    height: 50,
    width: 50
  },
  searchBar: {
    height: 32,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center"
  },
  categoryContainer: {
    width: "50%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  },
  categoryButton: {
    "&:hover": {
      cursor: "pointer"
    }
  }
})

type Note = {
  id: string; titulo: string; mensaje: string; fecha: string;
}



const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const { emitter } = useMitt()
  const messaging = getMessaging();
  const styles = useStyles()
  const [categorias, setCategorias] = useState<DtCategoria[]>([])
  const [sesionIniciada, setSesionIniciada] = useState(false)
  const [infoUsuario, setInfoUsuario] = useState({
    nombre: "",
    estadoSolicitud: EstadoSolicitud.NoSolicitada,
    esVendedor: false,
    imagen: ""
  })
  const [carrito, setCarrito] = useState(0)
  const [notificaciones, setNotificacion] = useState(0)
  const [notificacionesList, setNotiList] = useState<Note[]>([])
  const navigate = useNavigate();
  const { Paragraph, Text } = Typography;

  const itemsComprador = [
    {
      label: (<Link type="text" to="/compras" className="ant-btn ant-btn-text">Mis compras<FontAwesomeIcon icon={faBagShopping} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-1'
    },
    {
      label: (<Link type="text" to="/profile"
        className={(!infoUsuario.esVendedor && infoUsuario.estadoSolicitud == EstadoSolicitud.NoSolicitada) ? "ant-btn ant-btn-text" : "ant-btn ant-btn-text ant-btn-disabled"}>
        Solcitar ser vendedor<FontAwesomeIcon icon={faClipboardList} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-3'
    },
    {
      label: (<Link type="text" to="/cards" className="ant-btn ant-btn-text">Mis tarjetas<FontAwesomeIcon icon={faCreditCard} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-4'
    },
    {
      label: (<Link type="text" to="/directions" className="ant-btn ant-btn-text">Mis direcciones<FontAwesomeIcon icon={faMapLocationDot} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-5'
    },
    {
      label: (<Link type="text" to="/misReclamos" className="ant-btn ant-btn-text">Mis reclamos<FontAwesomeIcon icon={faBullhorn} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-6'
    },

  ];


  const itemsVendedor = [
    {
      label: (<Link type="text" to="/ventas" className="ant-btn ant-btn-text">Mis ventas<FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-1'
    },
    {
      label: (<Link type="text" to="/misProductos" className="ant-btn ant-btn-text">Mis productos<FontAwesomeIcon icon={faWarehouse} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-2'
    },
    {
      label: (<Link type="text" to="/agregarproducto" className="ant-btn ant-btn-text">Agregar producto<FontAwesomeIcon icon={faCirclePlus} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-3'
    },
    {
      label: (<Link type="text" to="/misReclamosRecibidos" className="ant-btn ant-btn-text">Reclamos recibidos<FontAwesomeIcon icon={faEnvelopeOpenText} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-4'
    },
    {
      label: (<Link type="text" to="/estadisticas" className="ant-btn ant-btn-text">Estadisiticas(PH)<FontAwesomeIcon icon={faChartPie} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-5'
    },

  ];


  const itemsAdministrador = [
    {
      label: (<Link type="text" to="/usuarios" className="ant-btn ant-btn-text">Gestión usuarios<FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-1'
    },
    {
      label: (<Link type="text" to="/devoluciones" className="ant-btn ant-btn-text">Deshacer venta(PH)<FontAwesomeIcon icon={faWarehouse} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-2'
    },
    {
      label: (<Link type="text" to="/administrador" className="ant-btn ant-btn-text">Crear nuevo administrador<FontAwesomeIcon icon={faCirclePlus} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-3'
    },
    {
      label: (<Link type="text" to="/solicitudes" className="ant-btn ant-btn-text">Solicitudes de rol vendedor<FontAwesomeIcon icon={faEnvelopeOpenText} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-4'
    },
    {
      label: (<Link type="text" to="/estadisticas" className="ant-btn ant-btn-text">Estadisiticas(PH)<FontAwesomeIcon icon={faChartPie} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-5'
    },
    {
      label: (<Link type="text" to="/categorias" className="ant-btn ant-btn-text">Crear categoria(PH)<FontAwesomeIcon icon={faChartPie} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-6'
    },
  ];

  const itemPerfil = [
    {
      label: (<Link type="text" to="/profile" className="ant-btn ant-btn-text">Mi perfil<FontAwesomeIcon icon={faAddressCard} style={{ display: "inline-block", marginLeft: "10px" }} /></Link>),
      key: 'item-1'
    },

    {
      label: (<Button type="text"
        onClick={(_) => {
          localStorage.removeItem("token")
          localStorage.removeItem("uuid")
          localStorage.removeItem("notificaciones")
          setSesionIniciada(false);
          navigate("/")
        }}
      >
        Cerrar sesión<FontAwesomeIcon icon={faRightFromBracket} style={{ display: "inline-block", marginLeft: "10px" }} />
      </Button>), key: 'item-7'
    }

  ]

  const menuPerfil = (<Menu items={itemPerfil}></Menu>)

  const menuComprador = (<Menu items={itemsComprador}></Menu>)

  const menuVendedor = (<Menu items={itemsVendedor}></Menu>)

  const menuAdministrador = (<Menu items={itemsAdministrador}></Menu>)



  onMessage(messaging, (payload) => {
    setNotificacion((previo) => previo + 1)
    notification.open({
      message: payload.notification!.title,
      description: payload.notification!.body,
    });
    setNotiList(actuales => [...actuales, { titulo: payload.notification!.title!, mensaje: payload.notification!.body!, fecha: moment().format("HH:mm"), id: payload.messageId }])
  });


  useEffect(() => {
    if (notificaciones > 0)
      localStorage.setItem("notificaciones", JSON.stringify(notificacionesList))
  }, [notificacionesList])




  const buscarProducto = (value: string) => {
    emitter.emit('busquedaProducto', { data: value });
  };

  const buscarCategoria = (nombre: string) => {
    emitter.emit('busquedaCategoria', { data: nombre });
  };

  const obtenerCategorias = () => {
    CategoriaService.listarCategorias().then((result) => {
      if (result) {
        setCategorias(result);
      }
    })
  }

  useEffect(() => {
    let token = localStorage.getItem("token")
    if (token) setSesionIniciada(true)
    let notificaciones = JSON.parse(localStorage.getItem("notificaciones")!) as Note[]
    if (notificaciones) {
      setNotiList(notificaciones)
      setNotificacion(notificaciones.length)
    }
  }, [])

  useEffect(() => {
    if (sesionIniciada) {
      UserService.obtenerInformacion(localStorage.getItem("token")!, localStorage.getItem("uuid")!)
        .then((infoUsuario) => {
          const { datosVendedor } = infoUsuario;
          let nombre = infoUsuario.nombre;
          let esVendedor = (datosVendedor && datosVendedor.estadoSolicitud === EstadoSolicitud.Aceptado) || false
          let estadoSolicitud = EstadoSolicitud.NoSolicitada;
          if (datosVendedor && datosVendedor.estadoSolicitud === EstadoSolicitud.Pendiente) {
            estadoSolicitud = EstadoSolicitud.Pendiente;
          }
          setInfoUsuario({ nombre: nombre, estadoSolicitud: estadoSolicitud, esVendedor: esVendedor, imagen: infoUsuario.imagen });
        })
    } else {

    }

  }, [sesionIniciada])


  useEffect(() => {
    obtenerCategorias();
  }, [])

  let locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No hay nuevas notificaciones" />
    )
  }

  const quitarNotificacion = (id: Note) => {
    const nuevas = notificacionesList.slice()
    let index = nuevas.indexOf(id);
    nuevas.splice(index, 1);
    setNotiList(nuevas);
    setNotificacion((previo) => previo - 1)
    localStorage.setItem("notificaciones", JSON.stringify(nuevas));
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <div style={{ gridRow: 1, marginLeft: 24 }}>
          <Link to="/">
            <Image
              preview={false}
              className={styles.profileImage}
              src={logo}
            />

          </Link>
        </div>

        <Search

          placeholder="Buscar productos"
          onSearch={buscarProducto}
        />

        {sesionIniciada ?
          <div style={{ gridColumn: 3, justifySelf: "end" }}>
            <Space size={40}>
              <Badge count={carrito} offset={[0, 0]}>
                <FontAwesomeIcon size="xl" type="regular " icon={faCartShopping} />
              </Badge>

              <Badge count={notificaciones} offset={[0, 0]}>
                <Popover
                  trigger="hover"
                  overlayStyle={{ width: "25%" }}
                  content={
                    <div >
                      <List
                        dataSource={notificacionesList}
                        locale={locale}
                        renderItem={item => (
                          <Card style={{ display: "flex", flexDirection: "column" }} title={item.titulo + " | " + item.fecha}
                            extra={<FontAwesomeIcon size="xl"
                              onClick={() => quitarNotificacion(item)} role={"button"} style={{ cursor: "pointer" }} color="#ff4d4f" icon={faCircleXmark} />}>
                            <Meta
                              description={
                                <Text
                                  style={true ? { width: "100%" } : undefined}
                                  ellipsis={true ? { tooltip: item.mensaje } : false} >
                                  {item.mensaje}
                                </Text>
                              }
                            />
                          </Card>
                        )} />

                    </div>
                  }
                >
                  <FontAwesomeIcon size="xl" icon={faBell} />
                </Popover>
              </Badge>

              <Dropdown overlay={menuComprador} placement="bottomLeft" >
                <Button type="text" >Hola, {infoUsuario.nombre} <FontAwesomeIcon icon={faCircleChevronDown} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
              </Dropdown>
              {(infoUsuario.esVendedor) &&
                <Dropdown overlay={menuVendedor} placement="bottomLeft" >
                  <Button type="text" >Opciones de vendedor<FontAwesomeIcon icon={faCircleChevronDown} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                </Dropdown>
              }


              <Dropdown overlay={menuPerfil} placement="bottomLeft" >
                <Avatar size="large" icon={<UserOutlined />} src={infoUsuario.imagen} style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }} />
              </Dropdown>
            </Space>
          </div>
          :

          <>
            <Button
              href="/signin"
              with="link"
              type="dark"
              style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }}>Iniciar sesión<FontAwesomeIcon icon={faRightToBracket} style={{ display: "inline-block", marginLeft: "10px" }} />
            </Button>

            <Button
              onClick={(_) => {
                _.currentTarget.blur()
              }}
              href="/signup"
              with="link"
              type="dark"
              style={{ justifySelf: "end", gridColumn: 4, marginRight: 24 }}>Registrarse<FontAwesomeIcon icon={faUserPlus} style={{ display: "inline-block", marginLeft: "10px" }} />
            </Button>

          </>
        }
      </div>
      <div className={styles.secondRow}>
        <div className={styles.categoryContainer}>
          {
            categorias.map((categoria, index) => {
              return (
                <Button type="text" style={{ gridColumn: index + 1 }} key={index} value={categoria.nombre} onClick={() => buscarCategoria(categoria.nombre)}>{categoria.nombre}</Button>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MainHeader;