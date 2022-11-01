import React, { useEffect, useState } from "react";
import { Card, List, Input, Space, Button, Layout, Image, Steps, Select, DatePicker, DatePickerProps, Empty, Pagination, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CompradorService } from "shopit-shared";
import { DtCompraSlimComprador, EstadoCompra } from "shopit-shared/dist/user/VendedorService";
import { DtFiltrosCompras } from "shopit-shared/dist/user/CompradorService";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquareCheck, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";


interface AppState {
    compras: DtCompraSlimComprador[],
    filtros: DtFiltrosCompras
}

const { Option } = Select;

const useStyles = createUseStyles({
    "@global": {
        ".ant-layout-sider-children": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    }
})

export const MisCompras: React.FC<{}> = () => {
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { Header, Footer, Sider, Content } = Layout;
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

    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = () => {
        CompradorService.listarCompras(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
            console.log(paginaAbuscar.toString())
            if (result.compras !== undefined) {
                setCompras(result.compras);
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



    return (
        <div style={{ margin: "auto", width: "80%", padding: "50px" }}>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                <Card>
                    <Space size={30}>
                        <div >
                            <label htmlFor="nProd" style={{ display: "block" }}>Producto:</label>
                            <Input id="nProd" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreProducto")} prefix={<SearchOutlined />} />
                        </div>
                        <div >
                            <label htmlFor="nVen" style={{ display: "block" }}>Vendedor:</label>
                            <Input id="nVen" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombreVendedor")} prefix={<SearchOutlined />} />
                        </div>

                        <div style={{ marginBottom: "auto", }}>
                            <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                            <Select id="orden" defaultValue={"fechaDsc"} style={{ width: '180px' }} onChange={handleChange}>
                                <Option value="fechaDsc">Últimas compras</Option>
                                <Option value="fechaAsc">Compras más antiguas</Option>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="fecha" style={{ display: "block" }}>Fecha:</label>
                            <DatePicker placeholder="Eliga una fecha" id="fecha" format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                        </div>
                        <div>
                            <label htmlFor="Estado" style={{ display: "block" }}>Estado:</label>
                            <Select id="Estado" defaultValue={true} style={{ width: '180px' }} onChange={(value) => onChangeEstado(value)}>
                                <Option value={true}>Todos</Option>
                                <Option value={EstadoCompra.EsperandoConfirmacion}>Esperando confirmación</Option>
                                <Option value={EstadoCompra.Confirmada}>Confirmada</Option>
                                <Option value={EstadoCompra.Cancelada}>Cancelada</Option>
                                <Option value={EstadoCompra.Completada}>Completada</Option>
                            </Select>
                        </div>
                        <div style={{ marginBottom: "-7px" }}>
                            <Button type="primary" size="large" icon={<SearchOutlined />} onClick={busqueda} style={{ width: '150px' }}>Buscar</Button>
                        </div>

                        <div style={{ marginBottom: "auto", fontSize: "12px", display: "flex" }}>
                            <div style={{ marginTop: "7px" }}>
                                <p>Cantidad: {infoPaginacion.totalItems}</p>
                            </div>
                        </div>
                    </Space>
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
                        <Card title={"Realizada el " + item.fecha.toString()}>
                            <Layout>
                                <Sider style={{ backgroundColor: "transparent" }}>
                                    <div style={{ margin: "10px" }}>
                                        <Image
                                            width={150}
                                            src={item.imagenURL}
                                        />
                                    </div>
                                </Sider>
                                <Layout>
                                    <Header style={{ backgroundColor: "transparent" }}>
                                        <Steps style={{ marginTop: "10px" }} size="small" current={stepCompra(item.estadoCompra)}>
                                            <Step title="Esperando confirmación" />
                                            <Step title={item.estadoCompra === "Cancelada" ? "Cancelada" : "Confirmada"} />
                                            <Step title="Completada" />
                                        </Steps>
                                    </Header>
                                    <Content>
                                        <div className="misCompras-principal-div">
                                            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                                <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{item.nombreProducto}</p>
                                            </div>
                                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                <p style={{ font: "revert-layer" }}>{item.nombreVendedor}</p>
                                                <a onClick={iniciarChat}>Iniciar chat</a>
                                            </div>
                                            <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                <Space>
                                                    <div>
                                                        <label htmlFor="cantidad" style={{ display: "block" }}>Unidades</label>
                                                        <Input bordered={false} id="cantidad" value={item.cantidad} style={{ width: "97px" }} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="unidad" style={{ display: "block" }}>Precio unitario</label>
                                                        <Input bordered={false} id="unidad" value={"$ " + item.montoUnitario} style={{ width: "97px" }} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="total" style={{ display: "block" }}>Precio total</label>
                                                        <Input bordered={false} id="total" value={"$ " + item.montoTotal} style={{ width: "97px" }} />
                                                    </div>
                                                </Space>
                                            </div>



                                            <div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                                <Space direction="vertical" size={15}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Tooltip title="Solo se puede reclamar cuando la compra haya sido confirmada y se esté dentro de la garantía."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                        <Button style={{ width: "150px" }} disabled={item.estadoCompra == EstadoCompra.EsperandoConfirmacion}> Realizar reclamo <FontAwesomeIcon icon={faPenToSquare} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Tooltip title="Solo se puede calificar una vez y cuando se haya completado la compra."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                        <Button style={{ width: "150px" }} disabled={!item.puedeCalificar}>Calificar <FontAwesomeIcon icon={faStarHalfStroke} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Tooltip title="Solo se puede completar compras de tipo envío, una vez superada la fecha estimada de entrega."> <FontAwesomeIcon type="regular" color="#17a2b8" style={{ marginRight: "5px" }} icon={faQuestionCircle} /> </Tooltip>
                                                        <Button disabled={!item.puedeCompletar} style={{ width: "150px" }} type="primary">Completar compra <FontAwesomeIcon icon={faSquareCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                                    </div>
                                                </Space>
                                            </div>
                                        </div>
                                    </Content>
                                    <Footer>
                                    </Footer>
                                </Layout>
                            </Layout>
                        </Card>
                    </List.Item>
                )}
            />
            <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
        </div >

    );
}