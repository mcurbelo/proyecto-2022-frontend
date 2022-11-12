import { SearchOutlined } from "@ant-design/icons";
import { faCircleQuestion, faSquareCheck, faComments, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Card, Collapse, Divider, Empty, List, Pagination, Radio, RadioChangeEvent, Rate, Row, Select, Space, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { AdministradorService } from "shopit-shared";
import { DtSolicitudPendiente } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleCheck, faCircleXmark, faEye } from "@fortawesome/free-regular-svg-icons";
import Solicitud from "./VisualizarSolicitud";

interface AppState {
    reclamos: DtSolicitudPendiente[],
}


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
})

interface visualizar {
    mostrar: boolean,
    solicitud?: DtSolicitudPendiente
}

export const Solicitudes = () => {
    const styles = useStyles();
    const token = localStorage.getItem("token");
    const [solicitudes, setSolicitudes] = useState<AppState["reclamos"]>()
    const [valoresOrdenamiento, setValoresOrdenamiento] = useState({
        ordenamiento: "id",
        dirOrdenamiento: "dsc",
        cantidadItems: "20"
    })
    const [infoPaginacion, setInfoPaginacion] = useState({
        paginaActual: 0,
        paginasTotales: 0,
        totalItems: 0
    })
    const [paginaAbuscar, setPaginaAbuscar] = useState(0)
    const [mostrarVisualizarSolicitud, setVisualizarSolicitud] = useState<visualizar>({
        mostrar: false
    })


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar, valoresOrdenamiento.dirOrdenamiento])

    const busqueda = () => {
        AdministradorService.listadoSolicitudes(token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento).then((result) => {
            if (result.solicitudes !== undefined) {
                setSolicitudes(result.solicitudes);
                setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
            }
        })
    }


    const { Option } = Select;

    let locale = {
        emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No se encontraron resultados :(" />
        )
    }

    const onChange = (e: RadioChangeEvent) => {
        setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": e.target.value })
    };

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#F0F0F0" }}>
            <div className={styles.container} style={{ backgroundColor: "#F0F0F0" }} >
                <h1 style={{ textAlign: "center" }}>Solicitudes para ser vendedor</h1>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                    <Card style={{ width: "100%" }}>
                        <Row justify="center">
                            <Radio.Group onChange={onChange} value={valoresOrdenamiento.dirOrdenamiento}>
                                <Radio value={"dsc"} >
                                    <h2>Últimas solicitudes</h2>
                                </Radio>
                                <Radio value={"asc"}  >
                                    <h2>Solicitudes mas antiguas</h2>
                                </Radio>
                            </Radio.Group>
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
                    dataSource={solicitudes}
                    renderItem={item => (
                        <List.Item>
                            <Card title={"Solicitud enviada el " + item.producto.fechaInicio} extra={
                                <div style={{ display: "flex", alignItems: "center" }} >
                                    <Button style={{ width: "195px", textShadow: "0 0 2px black" }} type="primary" onClick={() => { setVisualizarSolicitud({ mostrar: true, solicitud: item }) }}> <b>Ver solicitud</b>
                                        <FontAwesomeIcon icon={faEye} style={{ display: "inline-block", marginLeft: "10px" }} />
                                    </Button>
                                </div>
                            }>
                                <Row className={styles.reclamosContainer} >
                                    <Row gutter={[0, 20]} className={styles.reclamosContainer} >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={item.imagenPerfil}
                                            />
                                        </div>

                                        <div className={styles.divTitulo} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Row >
                                                <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{item.nombreApellido}</p>
                                                <Tooltip title={"Calificación: " + item.calificacion + "/5"} placement="bottom">
                                                    <Rate allowHalf disabled defaultValue={item.calificacion} />
                                                </Tooltip>
                                            </Row>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <Space direction="vertical">
                                                <div>
                                                    <p>{"Correo: " + item.correo}</p>
                                                    <p>Teléfono: {(item.telefono) ? item.telefono : "-"}</p>
                                                </div>
                                            </Space>
                                        </div>

                                        <div className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "baseline", justifyContent: "center" }}>
                                            <Space direction="vertical" size={30}>
                                                <div style={{ display: "flex", alignItems: "center" }}>

                                                    <Button style={{ width: "170px", textShadow: "0 0 2px black" }}
                                                        type="success"> <b>Aceptar</b> <FontAwesomeIcon icon={faCircleCheck} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                    </Button>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center" }}>

                                                    <Button style={{ width: "170px", textShadow: "0 0 2px black" }}
                                                        type="danger"> <b>Rechazar</b> <FontAwesomeIcon icon={faCircleXmark} style={{ display: "inline-block", marginLeft: "10px" }} />
                                                    </Button>
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
                {
                    (mostrarVisualizarSolicitud!.mostrar) ? <Solicitud solicitud={mostrarVisualizarSolicitud?.solicitud!} showModal={() => { setVisualizarSolicitud({ solicitud: undefined, mostrar: false }) }} ></Solicitud> : null
                }
            </div >
        </div >
    )

}
