import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Card, Col, Empty, List, Pagination, Radio, RadioChangeEvent, Rate, Row, Space, Spin, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { AdministradorService } from "shopit-shared";
import { DtSolicitudPendiente } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faEye } from "@fortawesome/free-regular-svg-icons";
import Solicitud from "./VisualizarSolicitud";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";



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
        width: "20%"
    },

    divPequeño: {},

    container: {
        width: "80%",
    },
    solicitudContainer: {
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
    const [loadingItems, setLoadingItems] = useState(true);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = () => {
        setLoadingItems(true);
        AdministradorService.listadoSolicitudes(token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento).then((result) => {
            if (result.solicitudes !== undefined) {
                setSolicitudes(result.solicitudes);
                setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
            }
            setLoadingItems(false);
        })
    }



    let locale = {
        emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No se encontraron resultados :(" />
        )
    }

    const onChange = (e: RadioChangeEvent) => {
        setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": e.target.value })
        setPaginaAbuscar(0);
    };

    const quitarSolicitud = (solicitud: DtSolicitudPendiente) => {
        const solicitudesReclamoNueva = solicitudes!.slice();
        const indice = solicitudesReclamoNueva.indexOf(solicitud);
        solicitudesReclamoNueva.splice(indice, 1)
        setSolicitudes(solicitudesReclamoNueva);
    }


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

                <Spin indicator={antIcon} spinning={loadingItems}>
                    <List locale={loadingItems ? { emptyText: " " } : locale}
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 1,
                            xl: 1,
                            xxl: 2,
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
                                    <Row className={styles.solicitudContainer} >
                                        <Row gutter={[10, 25]} className={styles.solicitudContainer} >
                                            <Col style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Avatar
                                                    size={100}
                                                    icon={<UserOutlined />}
                                                    src={item.imagenPerfil}
                                                />
                                            </Col>

                                            <Col className={styles.divPequeño} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", minWidth: "200px" }}>

                                                <Row>
                                                    <p>{item.nombreApellido}</p>
                                                </Row>
                                                <Row>
                                                    <Tooltip title={"Calificación: " + item.calificacion.toFixed(2) + "/5"} placement="bottom">
                                                        <Rate allowHalf disabled defaultValue={parseFloat(item.calificacion.toFixed(2))} />
                                                    </Tooltip>
                                                </Row>

                                            </Col>

                                            <Col className={styles.divPequeño} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "200px" }}>
                                                <Space direction="vertical">
                                                    <div>
                                                        <p>{"Correo: " + item.correo}</p>
                                                        <p>Teléfono: {(item.telefono) ? item.telefono : "-"}</p>
                                                    </div>
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Row>

                                </Card>
                            </List.Item>
                        )}
                    />
                </Spin>
                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%', marginBottom: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
                {
                    (mostrarVisualizarSolicitud!.mostrar) ? <Solicitud solicitud={mostrarVisualizarSolicitud?.solicitud!} quitar={() => quitarSolicitud(mostrarVisualizarSolicitud?.solicitud!)} showModal={() => { setVisualizarSolicitud({ solicitud: undefined, mostrar: false }) }} ></Solicitud> : null
                }
            </div >
        </div >
    )

}
