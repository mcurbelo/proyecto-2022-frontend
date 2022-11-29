import { SearchOutlined, ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import { faMoneyBillTransfer, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Card, Collapse, DatePicker, DatePickerProps, Divider, Empty, Image, Input, List, Modal, Pagination, Row, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { CompradorService, VendedorService } from "shopit-shared";
import { DtFiltoReclamo, DtReclamo, TipoReclamo, TipoResolucion } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleQuestion, faComments } from "@fortawesome/free-regular-svg-icons";
import { crearChat } from "../firebase";
import { useNavigate } from "react-router";


interface AppState {
    reclamos: DtReclamo[],
    filtros: DtFiltoReclamo
}

type propReclamo = {
    listarRealizados: boolean
}
const { Option } = Select;
const { confirm } = Modal;

const useStyles = createUseStyles({
    "@global": {
        ".ant-layout-sider-children": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
    },

    divTitulo: {
        width: "15%"
    },

    divPequeño: {},

    container: {
        width: "80%",
    },
    reclamosContainer: {
        width: "100%",
        justifyContent: "space-around"
    },
    filtros: {

    },

    containerFiltros: {
        justifyContent: "space-between",
        gap: "10px"
    },


    '@media screen and (max-width: 600px)': {
        divTitulo: {
            width: "100%"
        },
        divPequeño: {
            width: "100%",
            flexDirection: "initial !important"
        },
        container: {
            width: "100%"
        },

        reclamosContainer: {
            gap: "10%"
        },

    },

    '@media screen and (max-width: 870px)': {
        "@global": {
            ".ant-card-head-title": {
                whiteSpace: "unset"
            },
            ".ant-card-head-wrapper": {
                flexDirection: "column"
            },

            ".ant-card-extra": {
                margin: "0"
            }
        },
    },

    '@media screen and (max-width: 1184px)': {
        filtros: {
            width: "100%"
        }
    },
    '@media screen and (max-width: 1374px)': {
        containerFiltros: {
            justifyContent: "flex-start",
            columnGap: "70px"
        },
    },

    '@media screen and (max-width: 1334px)': {
        containerFiltros: {
            justifyContent: "flex-start",
            columnGap: "60px"
        },
    },

    '@media screen and (max-width: 1297px)': {
        containerFiltros: {
            justifyContent: "flex-start",
            columnGap: "50px"
        },
    },

    '@media screen and (max-width: 1259px)': {
        containerFiltros: {
            justifyContent: "flex-start",
            columnGap: "40px"
        },
    },

    '@media screen and (max-width: 1222px)': {
        containerFiltros: {
            justifyContent: "flex-start",
            columnGap: "30px"
        },
    },

})

export const Reclamos = (props: propReclamo) => {
    const navigate = useNavigate();
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { listarRealizados } = props
    const [reclamos, setReclamos] = useState<AppState["reclamos"]>()
    const [filtros, setFiltros] = useState<AppState["filtros"]>({
        fecha: undefined,
        tipo: undefined,
        nombreUsuario: undefined,
        nombreProducto: undefined,
        resolucion: TipoResolucion.NoResuelto
    })
    const [valoresOrdenamiento, setValoresOrdenamiento] = useState({
        ordenamiento: "fecha",
        dirOrdenamiento: "dsc",
        cantidadItems: "20"
    })
    const [infoPaginacion, setInfoPaginacion] = useState({
        paginaActual: 0,
        paginasTotales: 0,
        totalItems: 0
    })
    const [paginaAbuscar, setPaginaAbuscar] = useState(0)
    const [isLoading, setLoading] = useState(false);

    const { Panel } = Collapse;


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = (inicio?: boolean) => {
        if (listarRealizados) {
            CompradorService.reclamosHechos(id!, token!, (inicio) ? "0" : paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
                if (result.reclamos !== undefined) {
                    setReclamos(result.reclamos);
                    setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
                }
            })
        }
        else {
            VendedorService.listarReclamosRecibidos(id!, token!, (inicio) ? "0" : paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
                if (result.reclamos !== undefined) {
                    setReclamos(result.reclamos);
                    setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
                }
            })
        }
    }

    const handleChange = (value: string) => {
        if (value === "fechaAsc")
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "asc", "ordenamiento": "fecha" })
        else
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "dsc", "ordenamiento": "fecha" })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setFiltros({ ...filtros, [id]: e.target.value === "" ? undefined : e.target.value })
    }

    const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        setFiltros({ ...filtros, "fecha": dateString === "" ? undefined : dateString })
    };

    const onChangeTipo = (value: TipoReclamo | boolean) => {
        if (typeof value === "boolean") {
            setFiltros({ ...filtros, tipo: undefined })
        } else {
            setFiltros({ ...filtros, tipo: value })
        }
    };


    const onChangeResolucion = (value: TipoResolucion | boolean) => {
        if (typeof value === "boolean") {
            setFiltros({ ...filtros, resolucion: undefined })
        } else {
            setFiltros({ ...filtros, resolucion: value })
        }
    };

    let locale = {
        emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No se encontraron resultados :(" />
        )
    }

    const tootlipRender = (cantidad: number, precioUni: number) => {
        return (
            <>
                <span>{"Unidades: " + cantidad + ""}</span>
                <br />
                <span>{"Precio unitario: $" + precioUni + ""}</span>
            </>
        )
    }

    const resolverReclamo = (idReclamo: string, idCompra: string) => {
        confirm({
            title: 'Estás seguro que desea marcar como resuelto este reclamo?',
            icon: <ExclamationCircleOutlined />,
            content: 'Al confirmar ya no se podrá realizar más acciones en este reclamo.',
            cancelText: "Cancelar",
            onOk() {
                return CompradorService.marcarReclamoResuelto(id!, token!, idCompra, idReclamo).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title: "Acción exitosa",
                            content: 'Estado del reclamo actualizado exitosamente',
                        });
                        cambiarEstadoReclamo(idReclamo, TipoResolucion.PorChat);
                    } else {
                        Modal.error({
                            title: 'Error',
                            content: 'Ha ocurrido un error inesperado',
                        });
                    }
                })
            },
            onCancel() { },
        });

    }


    const devolverDinero = (idReclamo: string, idCompra: string) => {
        confirm({
            title: 'Estás seguro que desea devolver el dinero de esta venta? Esta acción no se puede deshacer',
            icon: <ExclamationCircleOutlined />,
            content: 'Al confirmar se devolverá el dinero al comprador y se cerrará las opciones de este reclamo.',
            cancelText: "Cancelar",
            onOk() {
                return VendedorService.gestionarReclamo(id!, token!, idCompra, idReclamo, TipoResolucion.Devolucion).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title: "Acción exitosa",
                            content: 'Estado del reclamo actualizado exitosamente junto a la devolución del dinero.',
                        });
                        cambiarEstadoReclamo(idReclamo, TipoResolucion.Devolucion);
                    } else {
                        Modal.error({
                            title: 'Error',
                            content: 'Ha ocurrido un error inesperado',
                        });
                    }
                })
            },
            onCancel() { },
        });

    }

    const iniciarChat = (idCompra: string, nombre: string) => {
        let token = localStorage.getItem("token");
        CompradorService.obtenerChat(idCompra, token!).then(res => {
            if (res === "") {
                crearChat(idCompra, token).then(idChat => {
                    setLoading(false)
                    navigate("/chat/" + idChat, { state: { receptor: nombre } });
                })
            } else {
                setLoading(false)
                navigate("/chat/" + res, { state: { receptor: nombre } });
            }
        })
    }


    const cambiarEstadoReclamo = (idReclamo: string, resolucion: TipoResolucion) => {
        const reclamosActualzados = reclamos!.map(reclamo => {
            if (reclamo.idReclamo === idReclamo)
                return { ...reclamo, estado: resolucion };
            return reclamo;
        });
        setReclamos(reclamosActualzados);
    }

    const formatoTipoReclamo = (tipo: TipoReclamo) => {
        if (tipo === TipoReclamo.DesperfectoProducto)
            return ("Desperfecto en el producto")
        if (tipo === TipoReclamo.ProductoNoRecibido)
            return ("Producto no recibido")
        if (tipo === TipoReclamo.ProducoErroneo)
            return ("Producto erroneo")
        if (tipo === TipoReclamo.Otro)
            return ("Otro")
    }

    const formatoEstado = (estado: TipoResolucion) => {
        if (estado === TipoResolucion.Devolucion)
            return (<span style={{ color: "#28a745" }}>Resuelto por devolución</span>)
        if (estado === TipoResolucion.NoResuelto)
            return (<span style={{ color: "darkorange" }}>No resuelto</span>)
        if (estado === TipoResolucion.PorChat)
            return (<span style={{ color: "#28a745" }}>Resuelto por chat</span>)
    }

    const titulo = (item: DtReclamo) => {
        return (<p style={{ margin: "0" }}>Iniciado: <b> {item.fechaRealizado.toString()} </b> | Motivo: <b> {formatoTipoReclamo(item.tipo)} </b> | Estado: <b> {formatoEstado(item.estado)} </b> </p>)
    }

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#F0F0F0" }}>
            <div className={styles.container} style={{ backgroundColor: "#F0F0F0" }} >
                <h1 style={{ textAlign: "center" }}>{(listarRealizados) ? "Mis reclamos hechos" : "Mis reclamos recibidos"}</h1>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                    <Card style={{ width: "100%" }}>
                        <div>
                            <Row className={styles.containerFiltros}>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="nVen" style={{ display: "block" }}>{(listarRealizados) ? "Vendedor:" : "Nombre comprador"}</label>
                                    <Input id="nVen" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreUsuario")} prefix={<SearchOutlined />} />
                                </div>

                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="nPro" style={{ display: "block" }}>Producto:</label>
                                    <Input id="nPro" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreProducto")} prefix={<SearchOutlined />} />
                                </div>

                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                                    <Select id="orden" className={styles.filtros} defaultValue={"fechaDsc"} style={{ minWidth: "202px" }} onChange={handleChange}>
                                        <Option value="fechaDsc">Últimos reclamos</Option>
                                        <Option value="fechaAsc">Reclamos más antiguos</Option>
                                    </Select>
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="fecha" style={{ display: "block" }}>Fecha:</label>
                                    <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "202px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="tipo" style={{ display: "block" }}>Tipo:</label>
                                    <Select id="tipo" defaultValue={true} className={styles.filtros} style={{ minWidth: "202px" }} onChange={(value) => onChangeTipo(value)}>
                                        <Option value={true}>Todos</Option>|
                                        <Option value={TipoReclamo.DesperfectoProducto}>Producto con desperfecto</Option>
                                        <Option value={TipoReclamo.ProductoNoRecibido}>Producto no recibido</Option>
                                        <Option value={TipoReclamo.ProducoErroneo}>Producto erroneo</Option>
                                        <Option value={TipoReclamo.Otro}>Otro</Option>
                                    </Select>
                                </div>

                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="resolucion" style={{ display: "block" }}>Estado:</label>
                                    <Select id="resolucion" defaultValue={filtros.resolucion} className={styles.filtros} style={{ minWidth: "202px" }} onChange={(value) => onChangeResolucion(value)}>
                                        <Option value={true}>Todos</Option>
                                        <Option value={TipoResolucion.Devolucion}>Resuelto por devolución</Option>
                                        <Option value={TipoResolucion.NoResuelto}>No resuelto</Option>
                                        <Option value={TipoResolucion.PorChat}>Resuelto por chat</Option>
                                    </Select>
                                </div>
                            </Row>
                            <Divider></Divider>
                            <Row style={{ gap: "10px", marginTop: "2%", justifyContent: "space-evenly" }}>

                                <div style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                                    <span>Resultados: {infoPaginacion.totalItems}</span>
                                </div>

                                <div style={{ minWidth: "150px" }}>
                                    <Button type="primary" size="large" icon={<SearchOutlined />} onClick={() => busqueda(true)} style={{ width: '150px', height: "47px" }}>Buscar</Button>
                                </div>
                            </Row>
                        </div>
                    </Card>
                </div>

                <List locale={locale}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 1,
                        xl: 1,
                        xxl: 1,
                    }}
                    dataSource={reclamos}
                    renderItem={item => (
                        <List.Item>
                            <Card title={titulo(item)} extra={
                                listarRealizados &&
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }} >
                                    <Space>
                                        <Tooltip title="Solo se pueden marcar como resueltos reclamos que aún no hayan sidos resueltos."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faCircleQuestion} /> </Tooltip>
                                        <Button disabled={item.estado !== TipoResolucion.NoResuelto} style={{ width: "195px", textShadow: (item.estado === TipoResolucion.NoResuelto) ? "0 0 2px black" : "" }} type="success"
                                            onClick={() => resolverReclamo(item.idReclamo, item.datosCompra.idCompra)}> <b>Marcar como resuelto</b>
                                            <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} />
                                        </Button>

                                        <Button type="primary"
                                            style={{ width: "195px", textShadow: (item.estado === TipoResolucion.NoResuelto && item.tieneChat) ? "0 0 2px black" : "" }}
                                            disabled={!item.tieneChat || item.estado !== TipoResolucion.NoResuelto}
                                            onClick={() => iniciarChat(item.datosCompra.idCompra, item.datosCompra.nombreVendedor)}><b>Ir al chat</b> <FontAwesomeIcon icon={faComments} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                        <Tooltip title="Solo se puede ir al chat si ya existe una instancia de este creada por usted o por el vendedor."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faCircleQuestion} /> </Tooltip>
                                    </Space>
                                </div>
                            }>
                                <Row className={styles.reclamosContainer} >
                                    <Row gutter={[0, 20]} className={styles.reclamosContainer} >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Image width={150} src={item.datosCompra.imagenProducto} />
                                        </div>

                                        <div className={styles.divTitulo} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{item.datosCompra.nombreProducto}</p>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <Space direction="vertical">
                                                <div>
                                                    <p>{(listarRealizados) ? "Reclamando a: " + item.datosCompra.nombreVendedor : "Reclamo de: " + item.autor}</p>
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        {
                                                            listarRealizados && <Avatar size="large" {... (item.datosCompra.avatarVendedor !== "") ? { src: item.datosCompra.avatarVendedor } : { icon: <UserOutlined /> }} />

                                                        }

                                                        {
                                                            !listarRealizados && <Avatar size="large" {... (item.datosCompra.avatarComprador !== "") ? { src: item.datosCompra.avatarComprador } : { icon: <UserOutlined /> }} />

                                                        }
                                                    </div>
                                                </div>
                                            </Space>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "baseline", justifyContent: "center", minWidth: "286px" }}>
                                            <Space direction="vertical">
                                                <span style={{ whiteSpace: "nowrap" }} id="Total">{"Total: $" + item.datosCompra.montoTotal}<Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} title={tootlipRender(item.datosCompra.cantidad, item.datosCompra.montoUnitario)}>
                                                    <ExclamationCircleOutlined style={{ marginLeft: "3%" }} />
                                                </Tooltip></span>
                                                <div>
                                                    <span style={{ whiteSpace: "nowrap" }} id="fecha">Fecha de entrega: {(item.datosCompra.fechaEntrega) ? item.datosCompra.fechaEntrega?.toString() : "-"}</span>
                                                </div>
                                                <div>
                                                    <span style={{ whiteSpace: "nowrap" }} id="tipoEntrega">Tipo de entrega: {(item.datosCompra.esEnvio) ? "Envío" : "Retiro"}</span>
                                                </div>
                                                <div>
                                                    <span id="direccion">Dirección: {item.datosCompra.direccionEntrega}</span>
                                                </div>
                                            </Space>
                                        </div>

                                        {
                                            !listarRealizados &&
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                                                <Space direction="vertical" size={15}>

                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Tooltip title="Inicia el chat con el comprador, para resolver el reclamo."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faCircleQuestion} /> </Tooltip>
                                                        <Button disabled={item.estado !== TipoResolucion.NoResuelto} style={{ width: "170px", textShadow: (item.estado === TipoResolucion.NoResuelto) ? "0 0 2px black" : "" }}
                                                            loading={isLoading} type="primary" onClick={() => { iniciarChat(item.datosCompra.idCompra, item.autor); setLoading(true) }}><b>{(item.tieneChat) ? "Ir al chat" : "Iniciar chat"}</b> <FontAwesomeIcon icon={faComments} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                        </Button>

                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Tooltip title="Devuelve el total del dinero al comprador, esta acción no se puede deshacer."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faCircleQuestion} /> </Tooltip>
                                                        <Button disabled={item.estado !== TipoResolucion.NoResuelto} style={{ width: "170px", textShadow: (item.estado === TipoResolucion.NoResuelto) ? "0 0 2px black" : "" }}
                                                            type="warning" onClick={() => devolverDinero(item.idReclamo, item.datosCompra.idCompra)}> <b>Devolver dinero</b> <FontAwesomeIcon icon={faMoneyBillTransfer} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                        </Button>

                                                    </div>
                                                </Space>
                                            </div>
                                        }
                                    </Row>
                                </Row>
                                <Divider></Divider>
                                <Row>
                                    <Collapse accordion style={{ width: "100%" }}>
                                        <Panel header="Ver descripción del reclamo" key="1">
                                            <p><i>{"Escrito por: " + item.autor}</i></p>
                                            <p>{item.descripcion}</p>
                                        </Panel>
                                    </Collapse>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%', marginBottom: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
            </div >
        </div>
    )
}
