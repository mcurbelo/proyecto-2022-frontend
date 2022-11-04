import React, { useEffect, useState } from "react";
import { Card, List, Input, Space, Image, Steps, Select, DatePicker, DatePickerProps, Empty, Pagination, Tooltip, Row, Divider, Modal, Dropdown, Menu, Rate } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { CompartidoUsuario, VendedorService } from "shopit-shared";
import { DtCompraSlimVendedor, DtFiltrosVentas, EstadoCompra } from "shopit-shared/dist/user/VendedorService";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSquareCheck, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark, faHandshake, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import RealizarCalificacion from "./RealizarCalificacion";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { MenuInfo } from "rc-menu/lib/interface";
import GestionarVenta from "./GestionarVenta";

interface AppState {
    ventas: DtCompraSlimVendedor[],
    filtros: DtFiltrosVentas
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
        margin: "auto"
    },
    comprasContainer: {
        gap: "8%",
        width: "100%",
        justifyContent: "center"
    },
    filtros: {

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
    }

})

export const MisVentas: React.FC<{}> = () => {
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { Step } = Steps;
    const [ventas, setVentas] = useState<AppState["ventas"]>()
    const [filtros, setFiltros] = useState<AppState["filtros"]>({
        fecha: undefined,
        nombre: undefined,
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
    const [mostrarCalificar, setMostrarCalificar] = useState({
        mostrar: false,
        id: "",
        nombreUsuario: "",
        idBoton: ""
    })
    const [mostrarGestionVenta, setGestionVenta] = useState({
        mostrar: false,
        idVenta: "",
        nombreUsuario: "",
        esEnvio: false,
        aceptar: false,
        direccion: ""
    })


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = () => {
        VendedorService.listarMisVentas(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
            if (result.ventas !== undefined) {
                setVentas(result.ventas);
                setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
            }
        })
    }


    const iniciarChat = () => { }

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
        console.log(value)
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
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No se encontraron resultados :(" />
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

    const changeButtonAttribute = (id: string) => {
        var botonCalificar = document.getElementById(id);
        botonCalificar?.setAttribute("disabled", "true");
    }

    const completarVenta = (idVenta: string, esEnvio: boolean) => {

        confirm({
            title: 'Estás seguro que desea completar esta venta?',
            icon: <ExclamationCircleOutlined />,
            content: 'Al confirmar se completará la venta y podrá calificar al comprador.',
            onOk() {
                if (esEnvio) {
                    return CompartidoUsuario.completarEnvio(idVenta, token!).then((result) => {
                        if (result == "200") {
                            Modal.success({
                                title: "Acción exitosa",
                                content: 'Estado de la venta actualizado exitosamente',
                            });
                            cambiarEstadoVenta(idVenta, EstadoCompra.Completada)
                        } else {
                            Modal.error({
                                title: 'Error',
                                content: 'Ha ocurrido un error inesperado',
                            });
                        }
                    })
                } else {
                    return VendedorService.completarVentaRetiro(id!, token!, idVenta).then((result) => {
                        if (result == "200") {
                            Modal.success({
                                title: "Acción exitosa",
                                content: 'Estado de la venta actualizado exitosamente',
                            });
                        } else {
                            Modal.error({
                                title: 'Error',
                                content: 'Ha ocurrido un error inesperado',
                            });
                        }

                    })
                }
            },
            onCancel() { },
        });
    }

    const cambiarEstadoVenta = (idVenta: string, estadoCompra: EstadoCompra, fechaEntrega?: string) => {
        const ventasActualizadas = ventas!.map(venta => {
            if (venta.idVenta === idVenta && estadoCompra !== EstadoCompra.Completada)
                return { ...venta, estadoCompra: estadoCompra, fechaEntrega: (fechaEntrega) ? fechaEntrega : undefined };

            if (venta.idVenta === idVenta && estadoCompra === EstadoCompra.Completada)
                return { ...venta, estadoCompra: estadoCompra, puedeCalificar: true, puedeCompletar: false };

            return venta;
        });
        setVentas(ventasActualizadas);
    }


    const opciones = [
        {
            label: 'Aceptar',
            key: '1',
            icon: <FontAwesomeIcon icon={faHandshake} />,
        },
        {
            label: 'Rechazar',
            key: '2',
            icon: <FontAwesomeIcon icon={faCircleXmark} />,
        },
    ];

    const handleAcciones = (e: MenuInfo, venta: DtCompraSlimVendedor) => {
        setGestionVenta({
            mostrar: true, idVenta: venta.idVenta, esEnvio: venta.esEnvio,
            nombreUsuario: venta.nombreComprador, direccion: venta.direccionEntrega,
            aceptar: (e.key === "1") ? true : false
        })
    }




    return (
        <div className={styles.container} >
            <h1 style={{ textAlign: "center" }}>Mis ventas</h1>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                <Card>
                    <Row style={{ gap: "20px" }}>
                        <div style={{ minWidth: "192px" }} className={styles.filtros}>
                            <label htmlFor="nVen" style={{ display: "block" }}>Vendedor:</label>
                            <Input id="nVen" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombre")} prefix={<SearchOutlined />} />
                        </div>

                        <div style={{ minWidth: "192px" }} className={styles.filtros}>
                            <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                            <Select id="orden" className={styles.filtros} defaultValue={"fechaDsc"} style={{ minWidth: "192px" }} onChange={handleChange}>
                                <Option value="fechaDsc">Últimas compras</Option>
                                <Option value="fechaAsc">Compras más antiguas</Option>
                            </Select>
                        </div>
                        <div style={{ minWidth: "192px" }} className={styles.filtros}>
                            <label htmlFor="fecha" style={{ display: "block" }}>Fecha:</label>
                            <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "192px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                        </div>
                        <div style={{ minWidth: "192px" }} className={styles.filtros}>
                            <label htmlFor="Estado" style={{ display: "block" }}>Estado:</label>
                            <Select id="Estado" defaultValue={true} className={styles.filtros} style={{ minWidth: "192px" }} onChange={(value) => onChangeEstado(value)}>
                                <Option value={true}>Todos</Option>|
                                <Option value={EstadoCompra.EsperandoConfirmacion}>Confirmación pendiente</Option>
                                <Option value={EstadoCompra.Confirmada}>Confirmada</Option>
                                <Option value={EstadoCompra.Cancelada}>Cancelada</Option>
                                <Option value={EstadoCompra.Completada}>Completada</Option>
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
                dataSource={ventas}
                renderItem={item => (
                    <List.Item>
                        <Card title={"Iniciada el " + item.fecha.toString()} bodyStyle={{ background: "#f0f2f5" }}>
                            <Row className={styles.comprasContainer} >
                                <Steps style={{ marginTop: "10px", width: "84%" }} size="small" current={stepCompra(item.estadoCompra)}>
                                    <Step title="Confirmación pendiente" />
                                    <Step title={item.estadoCompra === "Cancelada" ? "Cancelada" : "Confirmada"} {... (item.estadoCompra === EstadoCompra.Cancelada) ? { status: "error" } : {}} />
                                    <Step title="Completada" status={(item.estadoCompra === EstadoCompra.Completada) ? "finish" : "wait"} />
                                </Steps>
                                <Divider></Divider>
                                <Row gutter={[0, 20]} className={styles.comprasContainer} >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Image width={150} src={item.imagenURL} />
                                    </div>


                                    <div className={styles.divTitulo} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{item.nombreProducto}</p>
                                    </div>

                                    <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <Space direction="vertical">
                                            <div>
                                                <p style={{ font: "revert-layer" }}>{item.nombreComprador}</p>
                                            </div>
                                            <Tooltip title={"Calificación: " + item.calificacionComprador + "/5"} placement="bottom">
                                                <div>
                                                    <Rate allowHalf disabled defaultValue={item.calificacionComprador} />
                                                </div>
                                            </Tooltip>
                                        </Space>
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
                                                <span style={{ whiteSpace: "nowrap" }} id="tipoEntrega">Tipo de entrega: {(item.esEnvio) ? "Envío" : "Retiro"}</span>
                                            </div>
                                        </Space>
                                    </div>


                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                        <Space direction="vertical" size={15}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Tooltip title="Solo se puede realizar acciones en ventas en esperando confirmación."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                <Dropdown overlay={<Menu items={opciones} onClick={(e) => handleAcciones(e, item)} />} disabled={item.estadoCompra !== EstadoCompra.EsperandoConfirmacion}>
                                                    <Button disabled={item.estadoCompra !== EstadoCompra.EsperandoConfirmacion} style={{ width: "170px" }}><b>Acciones</b><FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faBars} /></Button>
                                                </Dropdown>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Tooltip title="Solo se puede calificar una vez y cuando se haya completado la venta."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                <Button style={{ width: "170px" }} disabled={!item.puedeCalificar} id={item.idVenta + "Calificar"} type="warning" onClick={() => { setMostrarCalificar({ mostrar: true, id: item.idVenta, nombreUsuario: item.nombreComprador, idBoton: item.idVenta + "Calificar" }) }}><b>Calificar</b> <FontAwesomeIcon icon={faStarHalfStroke} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Tooltip title="Solo se puede completar ventas una vez superada la fecha estimada de entrega."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                <Button disabled={!item.puedeCompletar} style={{ width: "170px" }} type="success" onClick={() => completarVenta(item.idVenta, item.esEnvio)}> <b>Completar venta</b> <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                            </div>
                                        </Space>
                                    </div>
                                </Row>
                                <Row style={{ marginTop: "3%" }}><span style={{ textAlign: "center" }}>Dirección de entrega elegida: {item.direccionEntrega}</span></Row>
                            </Row>

                        </Card>
                    </List.Item>
                )}
            />
            <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
            {
                (mostrarGestionVenta.mostrar) ? <GestionarVenta realizoAccion={(idVenta, aceptar) => cambiarEstadoVenta(idVenta, (aceptar) ? EstadoCompra.Confirmada : EstadoCompra.Cancelada)} informacion={mostrarGestionVenta} showModal={() => { setGestionVenta({ ...mostrarGestionVenta, mostrar: false }) }}></GestionarVenta> : null
            }

            {
                (mostrarCalificar.mostrar) ? <RealizarCalificacion califico={() => { changeButtonAttribute(mostrarCalificar.idBoton) }} nombreUsuario={mostrarCalificar.nombreUsuario} idCompra={mostrarCalificar.id} showModal={() => { setMostrarCalificar({ mostrar: false, id: "", nombreUsuario: "", idBoton: "" }) }}></RealizarCalificacion> : null
            }
        </div >
    );
}