import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { faQuestionCircle, faBars, faStarHalfStroke, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, DatePicker, DatePickerProps, Divider, Dropdown, Empty, Input, List, Menu, Modal, Pagination, Row, Select, Space, Steps, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { CompradorService, VendedorService } from "shopit-shared";
import { cambiarEstadoVenta, DtFiltoReclamo, DtReclamo, EstadoCompra, TipoReclamo, TipoResolucion } from "shopit-shared/dist/user/VendedorService";
import GestionarVenta from "./GestionarVenta";
import RealizarCalificacion from "./RealizarCalificacion";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'


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
        }
    },

    divTitulo: {
        width: "15%"
    },

    divPequeño: {},

    container: {
        width: "80%",
    },
    comprasContainer: {
        gap: "8%",
        width: "100%",
        justifyContent: "center"
    },
    filtros: {

    },

    containerFiltros: {
        justifyContent: "space-around"
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

        comprasContainer: {
            gap: "10%"
        },



    },
    '@media screen and (max-width: 589px)': {
        filtros: {
            width: "100%"
        }
    },
    '@media screen and (max-width: 1271px)': {
        containerFiltros: {
            justifyContent: "flex-start"
        }
    }

})

export const Reclamos = (props: propReclamo) => {
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { listarRealizados } = props
    const { Step } = Steps;
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


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = () => {
        if (listarRealizados) {
            CompradorService.reclamosHechos(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
                if (result.reclamos !== undefined) {
                    setReclamos(result.reclamos);
                    setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
                }
            })
        }
        else {
            VendedorService.listarReclamosRecibidos(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
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
            onOk() {
                return CompradorService.marcarReclamoResuelto(id!, token!, idCompra, idReclamo).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title: "Acción exitosa",
                            content: 'Estado del reclamo actualizado exitosamente',
                        });
                        cambiarEstadoReclamo(idReclamo);
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

    const iniciarChat = () => {

    }

    const cambiarEstadoReclamo = (idReclamo: string) => {
        const reclamosActualzados = reclamos!.map(reclamo => {
            if (reclamo.idReclamo === idReclamo)
                return { ...reclamo, estado: TipoResolucion.PorChat };
            return reclamo;
        });
        setReclamos(reclamosActualzados);
    }

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#F0F0F0" }}>
            <div className={styles.container} style={{ backgroundColor: "#F0F0F0" }} >
                <h1 style={{ textAlign: "center" }}>{(listarRealizados) ? "Mis reclamos hechos" : "Mis reclamos recibidos"}</h1>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                    <Card style={{ width: "100%" }}>
                        <Row className={styles.containerFiltros} style={{ gap: "10px" }}>
                            <div style={{ minWidth: "192px" }} className={styles.filtros}>
                                <label htmlFor="nVen" style={{ display: "block" }}>{(listarRealizados) ? "Vendedor:" : "Nombre comprador"}</label>
                                <Input id="nVen" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombre")} prefix={<SearchOutlined />} />
                            </div>

                            <div style={{ minWidth: "192px" }} className={styles.filtros}>
                                <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                                <Select id="orden" className={styles.filtros} defaultValue={"fechaDsc"} style={{ minWidth: "192px" }} onChange={handleChange}>
                                    <Option value="fechaDsc">Últimos reclamos</Option>
                                    <Option value="fechaAsc">Reclamos más antiguas</Option>
                                </Select>
                            </div>
                            <div style={{ minWidth: "192px" }} className={styles.filtros}>
                                <label htmlFor="fecha" style={{ display: "block" }}>Fecha:</label>
                                <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "192px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                            </div>
                            <div style={{ minWidth: "192px" }} className={styles.filtros}>
                                <label htmlFor="tipo" style={{ display: "block" }}>Tipo:</label>
                                <Select id="tipo" defaultValue={true} className={styles.filtros} style={{ minWidth: "192px" }} onChange={(value) => onChangeTipo(value)}>
                                    <Option value={true}>Todos</Option>|
                                    <Option value={TipoReclamo.DesperfectoProducto}>Desperfecto en el producto</Option>
                                    <Option value={TipoReclamo.ProductoNoRecibido}>Producto no recibido</Option>
                                    <Option value={TipoReclamo.ProducoErroneo}>Producto erroneo</Option>
                                    <Option value={TipoReclamo.Otro}>Otro</Option>
                                </Select>
                            </div>

                            <div style={{ minWidth: "192px" }} className={styles.filtros}>
                                <label htmlFor="resolucion" style={{ display: "block" }}>Estado:</label>
                                <Select id="resolucion" defaultValue={filtros.resolucion} className={styles.filtros} style={{ minWidth: "192px" }} onChange={(value) => onChangeResolucion(value)}>
                                    <Option value={true}>Todos</Option>
                                    <Option value={TipoResolucion.Devolucion}>Devolución</Option>
                                    <Option value={TipoResolucion.NoResuelto}>No resuelto</Option>
                                    <Option value={TipoResolucion.PorChat}>Por chat</Option>
                                </Select>
                            </div>

                            <div style={{ minWidth: "150px" }}>
                                <Button type="primary" size="large" icon={<SearchOutlined />} onClick={busqueda} style={{ width: '150px', height: "47px" }}>Buscar</Button>
                            </div>

                            <div style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                                <span>Cantidad: {infoPaginacion.totalItems}</span>
                            </div>
                        </Row>
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
                            <Card title={"Iniciado el " + item.fechaRealizado.toString()+ " | Motivo: | Estado: "}>
                                <Row className={styles.comprasContainer} >
                                    <Row gutter={[0, 20]} className={styles.comprasContainer} >
                                        <div className={styles.divTitulo} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{item.datosCompra.nombreProducto}</p>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <Space direction="vertical">
                                                <div>
                                                    <p style={{ font: "revert-layer" }}>{(listarRealizados) ? "Reclamando a: "+item.datosCompra.nombreVendedor : "Reclamo de: "+item.autor}</p>
                                                </div>
                                            </Space>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "baseline", justifyContent: "center", minWidth: "13%" }}>
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
                                            </Space>
                                        </div>


                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                            <Space direction="vertical" size={15}>
                                                <div style={{ display: "flex", alignItems: "center" }}>

                                                    {
                                                        listarRealizados &&
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <Tooltip title="Solo se pueden marcar como resueltos reclamos que la resolución haya sido por chat."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                            <Button disabled={item.estado !== TipoResolucion.PorChat} style={{ width: "170px", textShadow: (item.estado === TipoResolucion.PorChat) ? "0 0 2px black" : "" }} type="success" onClick={() => resolverReclamo(item.idReclamo, item.datosCompra.idCompra)}> <b>Marcar como resuelto</b> <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                        </div>
                                                    }
                                                    {
                                                        !listarRealizados && <>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <Tooltip title="Inicia el chat con el vendedor, para resolver el reclamo"> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                                <Button disabled={item.estado !== TipoResolucion.NoResuelto} style={{ width: "170px", textShadow: (item.estado === TipoResolucion.NoResuelto) ? "0 0 2px black" : "" }} type="success" onClick={() => iniciarChat()}> <b>Iniciar chat</b> <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <Tooltip title="Devuelve el total del dinero al comprador"> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                                <Button disabled={item.estado !== TipoResolucion.NoResuelto} style={{ width: "170px", textShadow: (item.estado === TipoResolucion.NoResuelto) ? "0 0 2px black" : "" }} type="success" onClick={() => iniciarChat()}> <b>Iniciar chat</b> <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                            </div>
                                                        </>
                                                    }

                                                </div>
                                            </Space>
                                        </div>
                                    </Row>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
            </div >
        </div>
    )
}
