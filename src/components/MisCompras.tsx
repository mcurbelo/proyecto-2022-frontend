import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, List, Input, Space, Image, Steps, Select, DatePicker, DatePickerProps, Empty, Pagination, Tooltip, Row, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { CompartidoUsuario, CompradorService } from "shopit-shared";
import { DtCompraSlimComprador, EstadoCompra } from "shopit-shared/dist/user/VendedorService";
import { DtFiltrosCompras } from "shopit-shared/dist/user/CompradorService";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquareCheck, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import RealizarReclamo from "./RealizarReclamo";
import RealizarCalificacion from "./RealizarCalificacion";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp, getApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyBpBoAHC1LdQijNpCLt9UfNGKHkjbKs3Bs",
    authDomain: "shopnowproyecto2022.firebaseapp.com",
    projectId: "shopnowproyecto2022",
    storageBucket: "shopnowproyecto2022.appspot.com",
    messagingSenderId: "319527562925",
    appId: "1:319527562925:web:2f6681c9cc98e1eb95a024",
    measurementId: "G-2S8M3F9J9J"
};

const createFirebaseApp = (config = {}) => {
    try {
        return getApp();
    } catch (e) {
        return initializeApp(config);
    }
};



const firebaseApp = createFirebaseApp(firebaseConfig);
const db = getFirestore(firebaseApp);


interface AppState {
    compras: DtCompraSlimComprador[],
    filtros: DtFiltrosCompras
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
        gap: "6%",
        width: "100%",
        justifyContent: "center"
    },
    filtros: {
        minWidth: "192px",
        width: "250px"
    },

    containerFiltros: {
        justifyContent: "space-between"
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
    '@media screen and (max-width: 1184px)': {
        filtros: {
            width: "100% !important"
        }
    },
    '@media screen and (max-width: 1674px)': {
        containerFiltros: {
            justifyContent: "space-between",
            gap: "10px"
        },

        filtros: {
            minWidth: "201px",
            width: "auto"
        },
    }
})


const crearChat = async (idcompra: string) => {
    let collectionRef = collection(db, "mensajes");
    return addDoc(collectionRef, {}).then(referece => {
        let id = referece.id;
        CompradorService.iniciarChat(idcompra, id, localStorage.getItem("token")!);
        return id;
    }).catch(e => { })
};


export const MisCompras: React.FC<{}> = () => {
    const navigate = useNavigate();
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { Step } = Steps;
    const [compras, setCompras] = useState<AppState["compras"]>()
    const [filtros, setFiltros] = useState<AppState["filtros"]>({
        fecha: undefined,
        nombreVendedor: undefined,
        nombreProducto: undefined,
        estado: undefined
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
    const [mostrarReclamo, setMostrarReclamo] = useState({
        mostrar: false,
        id: "",
        nombreUsuario: ""
    })
    const [mostrarCalificar, setMostrarCalificar] = useState({
        mostrar: false,
        id: "",
        nombreUsuario: "",
    })
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = (inicio?: boolean) => {
        CompradorService.listarCompras(id!, token!, (inicio) ? "0" : paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
            if (result.compras !== undefined) {
                setCompras(result.compras);
                setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
            }
        })
    }


    const iniciarChat = (idCompra: string, nombreVendedor: string) => {
        let token = localStorage.getItem("token");
        CompradorService.obtenerChat(idCompra, token!).then(res => {
            if (res === "") {
                crearChat(idCompra).then(idChat => {
                    setLoading(false);
                    navigate("/chat/" + idChat, { state: { receptor: nombreVendedor } });
                })
            } else {
                setLoading(false);
                navigate("/chat/" + res, { state: { receptor: nombreVendedor } });
            }
        })
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

    const onChangeEstado = (value: EstadoCompra | boolean) => {
        if (typeof value === "boolean") {
            setFiltros({ ...filtros, estado: undefined })
        } else {
            setFiltros({ ...filtros, estado: value })
        }
    };

    function stepCompra(estado: EstadoCompra) {
        if (estado === EstadoCompra.EsperandoConfirmacion)
            return 0
        if (estado === EstadoCompra.Confirmada || estado === EstadoCompra.Cancelada)
            return 1
        return 2
    }

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

    const cambiarEstadoCalificar = (idCompra: string) => {
        const comprasActualizadas = compras!.map(compra => {
            if (compra.idCompra === idCompra)
                return { ...compra, puedeCalificar: false };

            return compra;
        });
        setCompras(comprasActualizadas);
    }

    const disableButton = () => {
        const buttonCancel = document.getElementById("cancelButton")
        buttonCancel?.setAttribute("disabled", "true");
    }

    const completarCompra = (id: string) => {

        confirm({
            title: 'Estás seguro que desea completar esta compra?',
            icon: <ExclamationCircleOutlined />,
            content: 'Al confirmar la compra se completará y podra calificar al vendedor.',
            cancelText: "Cancelar",
            cancelButtonProps: {id:"cancelButton"},
            onOk() {
                disableButton();
                return CompartidoUsuario.completarEnvio(id, token!).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title: "Acción exitosa",
                            content: 'Estado de la compra actualizado exitosamente',
                        });
                        cambiarEstadoCompra(id, EstadoCompra.Completada)
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

    const cambiarEstadoCompra = (idCompra: string, estadoCompra: EstadoCompra) => {
        const comprasAct = compras!.map(compra => {
            if (compra.idCompra === idCompra && estadoCompra === EstadoCompra.Completada)
                return { ...compra, estadoCompra: estadoCompra, puedeCalificar: true, puedeCompletar: false };
            return compra;
        });
        setCompras(comprasAct);
    }

    const garantiaEstado = (garantiaActiva: boolean, estado: EstadoCompra) => {
        if (estado === EstadoCompra.Completada && garantiaActiva) {
            return (<span style={{ color: "#28a745" }}>Activa</span>)
        }
        if (estado === EstadoCompra.Completada && !garantiaActiva) {
            return (<span style={{ color: "#ff4d4f" }}>Expirada</span>)
        }
        return (<span>-</span>)
    }

    const cambiarPuedeReclamar = (idCompra: string) => {
        const comprasAct = compras!.map(compra => {
            if (compra.idCompra === idCompra)
                return { ...compra, puedeReclamar: false };
            return compra;
        });
        setCompras(comprasAct);
    }

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#F0F0F0" }}>
            <div className={styles.container} style={{ backgroundColor: "#F0F0F0" }} >
                <h1 style={{ textAlign: "center" }}>Mis compras</h1>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                    <Card style={{ width: "100%" }} >
                        <Row className={styles.containerFiltros} style={{ gap: "10px" }}>
                            <div className={styles.filtros}>
                                <label htmlFor="nProd" style={{ display: "block" }}>Producto:</label>
                                <Input id="nProd" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreProducto")} prefix={<SearchOutlined />} />
                            </div>
                            <div className={styles.filtros}>
                                <label htmlFor="nVen" style={{ display: "block" }}>Vendedor:</label>
                                <Input id="nVen" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreVendedor")} prefix={<SearchOutlined />} />
                            </div>

                            <div className={styles.filtros}>
                                <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                                <Select id="orden" className={styles.filtros} defaultValue={"fechaDsc"} style={{ minWidth: "201px" }} onChange={handleChange}>
                                    <Option value="fechaDsc">Últimas compras</Option>
                                    <Option value="fechaAsc">Compras más antiguas</Option>
                                </Select>
                            </div>
                            <div className={styles.filtros}>
                                <label htmlFor="fecha" style={{ display: "block" }}>Fecha:</label>
                                <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "201px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                            </div>
                            <div className={styles.filtros}>
                                <label htmlFor="Estado" style={{ display: "block" }}>Estado:</label>
                                <Select id="Estado" defaultValue={true} className={styles.filtros} style={{ minWidth: "201px" }} onChange={(value) => onChangeEstado(value)}>
                                    <Option value={true}>Todos</Option>
                                    <Option value={EstadoCompra.EsperandoConfirmacion}>Esperando confirmación</Option>
                                    <Option value={EstadoCompra.Confirmada}>Confirmada</Option>
                                    <Option value={EstadoCompra.Cancelada}>Cancelada</Option>
                                    <Option value={EstadoCompra.Completada}>Completada</Option>
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
                    dataSource={compras}
                    renderItem={item => (
                        <List.Item>
                            <Card title={"Realizada el " + item.fecha.toString()} >
                                <Row className={styles.comprasContainer} >
                                    {
                                        item.estadoCompra !== EstadoCompra.Devolucion &&
                                        <Steps style={{ marginTop: "10px", width: "84%" }} size="small" current={stepCompra(item.estadoCompra)}>
                                            <Step title="Esperando confirmación" />
                                            <Step title={item.estadoCompra === "Cancelada" ? "Cancelada" : "Confirmada"} {... (item.estadoCompra === EstadoCompra.Cancelada) ? { status: "error" } : {}} />
                                            <Step title="Completada" status={(item.estadoCompra === EstadoCompra.Completada) ? "finish" : "wait"} />
                                        </Steps>
                                    }
                                    {
                                        item.estadoCompra === EstadoCompra.Devolucion && <h2 style={{ color: "#ff4d4f" }}>Reembolsada</h2>

                                    }

                                    <Divider></Divider>
                                    <Row gutter={[0, 20]} className={styles.comprasContainer} >
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Image width={150} src={item.imagenURL} />
                                        </div>

                                        <div className={styles.divTitulo} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ textJustify: "inter-word" }}>{item.nombreProducto}</p>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <div>
                                                <p style={{ textAlign: "center" }}>{item.nombreVendedor}</p>

                                                <Button type="link" onClick={e => { iniciarChat(item.idCompra, item.nombreVendedor); setLoading(true) }} loading={isLoading}
                                                    disabled={(item.estadoCompra !== EstadoCompra.Confirmada && item.estadoCompra !== EstadoCompra.Completada) || (item.estadoCompra !== EstadoCompra.Confirmada && !item.garantiaActiva)}
                                                >{(item.tieneChat) ? "Ir al chat" : "Iniciar chat"}</Button>
                                                <Tooltip title="Solo se puede iniciar o acceder al chat cuando la compra haya sido confirmada y se esté dentro de la garantía del producto"> <FontAwesomeIcon type="regular" icon={faQuestionCircle} /></Tooltip>
                                            </div>
                                        </div>
                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "baseline", justifyContent: "center", minWidth: "13%" }}>
                                            <Space direction="vertical">
                                                <span style={{ whiteSpace: "nowrap" }} id="Total">{"Total: $" + item.montoTotal}<Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} title={tootlipRender(item.cantidad, item.montoUnitario)}>
                                                    <ExclamationCircleOutlined style={{ marginLeft: "3%" }} />
                                                </Tooltip></span>
                                                <div>
                                                    <span style={{ whiteSpace: "nowrap" }} id="fecha">Fecha de entrega: {(item.fechaEntrega) ? item.fechaEntrega?.toString() : "-"}</span>
                                                </div>
                                                <div>
                                                    <span style={{ whiteSpace: "nowrap" }} id="garantia">Estado de garantía: {garantiaEstado(item.garantiaActiva, item.estadoCompra)}</span>
                                                </div>
                                                <div>
                                                    <span style={{ whiteSpace: "nowrap" }} id="tipoEntrega">Tipo de entrega: {(item.esEnvio) ? "Envío" : "Retiro"}</span>
                                                </div>
                                            </Space>
                                        </div>


                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                                            <Space direction="vertical" size={15}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Tooltip title="Solo se puede reclamar cuando la compra haya sido confirmada y se esté dentro de la garantía. Solo se puede tener un reclamo activo por compra."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                    <Button style={{ width: "170px", textShadow: (item.puedeReclamar) ? "0 0 2px black" : "" }}
                                                        disabled={!item.puedeReclamar} type="primary"
                                                        onClick={() => { setMostrarReclamo({ mostrar: true, id: item.idCompra, nombreUsuario: item.nombreVendedor }) }}><b>Realizar reclamo</b> <FontAwesomeIcon icon={faPenToSquare} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Tooltip title="Solo se puede calificar una vez y cuando se haya completado la compra."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                    <Button style={{ width: "170px", textShadow: (item.puedeCalificar) ? "0 0 2px black" : "" }}
                                                        disabled={!item.puedeCalificar} type="warning"
                                                        onClick={() => { setMostrarCalificar({ mostrar: true, id: item.idCompra, nombreUsuario: item.nombreVendedor }) }}><b>Calificar</b>
                                                        <FontAwesomeIcon icon={faStarHalfStroke} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                    </Button>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Tooltip title="Solo se puede completar compras de tipo envío, una vez superada la fecha estimada de entrega."> <FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                    <Button disabled={!item.puedeCompletar} style={{ width: "170px", textShadow: (item.puedeCompletar) ? "0 0 2px black" : "" }}
                                                        type="success" onClick={() => completarCompra(item.idCompra)}> <b>Completar compra</b>
                                                        <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                    </Button>
                                                </div>
                                            </Space>
                                        </div>
                                    </Row>
                                    <Divider></Divider>
                                    <Row><span style={{ textAlign: "center" }}>Dirección de entrega elegida: {item.direccionEntrega}</span></Row>
                                </Row>

                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
                {
                    (mostrarReclamo.mostrar) ? <RealizarReclamo realizoReclamo={() => { cambiarPuedeReclamar(mostrarReclamo.id) }} nombreUsuario={mostrarReclamo.nombreUsuario} showModal={() => { setMostrarReclamo({ mostrar: false, id: "", nombreUsuario: "" }) }} idCompra={mostrarReclamo.id} /> : null
                }

                {
                    (mostrarCalificar.mostrar) ? <RealizarCalificacion califico={() => { cambiarEstadoCalificar(mostrarCalificar.id) }} nombreUsuario={mostrarCalificar.nombreUsuario} idCompra={mostrarCalificar.id} showModal={() => { setMostrarCalificar({ mostrar: false, id: "", nombreUsuario: "" }) }}></RealizarCalificacion> : null
                }
            </div >
        </div>

    );
}