import React, { useEffect, useState } from "react";
import { Card, Menu, List, message, Input, Dropdown, Space, Button, Layout, Image, Steps, Descriptions, Select } from 'antd';
import { SearchOutlined, SlidersOutlined, DownOutlined } from '@ant-design/icons';
import { CompradorService } from "shopit-shared";
import { DtCompraSlimComprador, EstadoCompra } from "shopit-shared/dist/user/VendedorService";
import { DtFiltrosCompras } from "shopit-shared/dist/user/CompradorService";




const menu = (
    <Menu
        items={[
            {
                label: <a>Este mes</a>,
                key: 'estemes',
            },
            {
                label: <a>Mes Pasado</a>,
                key: 'mespasado',
            },
            {
                label: <a>Este año</a>,
                key: 'esteanio',
            },
            {
                label: <a>2021</a>,
                key: '2021',
            },
            {
                label: <a>2020</a>,
                key: '2020',
            },
            {
                label: <a>2019</a>,
                key: '2019',
            }
        ]}
    />
);

interface AppState {
    compras: DtCompraSlimComprador[],
    filtros: DtFiltrosCompras
}

const { Option } = Select;

export const MisCompras: React.FC<{}> = (props) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { Header, Footer, Sider, Content } = Layout;
    const { Step } = Steps;
    const [filtroActual, setFiltroActual] = useState("Todas");
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
    }, [])

    const busqueda = () => {
        CompradorService.listarCompras(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
            if (result.compras !== undefined) {
                setCompras(result.compras);
                setInfoPaginacion({ paginaActual: result.currentPage, paginasTotales: result.totalPages, totalItems: result.totalItems })
                console.log(result)
            }
        })
    }


    const iniciarChat = () => { }

    const handleChange = (value: string, id: string) => {
        setValoresOrdenamiento({ ...valoresOrdenamiento, [id]: value })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setFiltros({ ...filtros, [id]: e.target.value })
    }


    function stepCompra(estado: EstadoCompra) {
        console.log(estado)
        if (estado === EstadoCompra.EsperandoConfirmacion)
            return 0
        if (estado === EstadoCompra.Confirmada || estado === EstadoCompra.Cancelada)
            return 1
        return 2


    }

    return (
        <div style={{ margin: "auto", width: "80%", padding: "50px" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
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
                        <Select id="orden" value={valoresOrdenamiento.ordenamiento} style={{ width: '100%' }} onChange={(value) => handleChange(value, "ordenamiento")}>
                            <Option value="fecha">Fecha</Option>
                            <Option value="estado">Estado</Option>

                        </Select>
                    </div>

                    <div>
                        <label htmlFor="direccion" style={{ display: "block" }}>Dirección:</label>
                        <Select id="direccion" value={valoresOrdenamiento.dirOrdenamiento} style={{ width: '100%' }} onChange={(value) => handleChange(value, "dirOrdenamiento")}>
                            <Option value="dsc">Descendente</Option>
                            <Option value="asc">Ascendente</Option>

                        </Select>
                    </div>

                    <div>
                        <label htmlFor="Estado" style={{ display: "block" }}>Dirección:</label>
                        <Select id="Estado" value={valoresOrdenamiento.dirOrdenamiento} style={{ width: '100%' }} onChange={(value) => handleChange(value, "dirOrdenamiento")}>
                            <Option value="dsc">Descendente</Option>
                            <Option value="asc">Ascendente</Option>

                        </Select>
                    </div>
                    <div>
                        <Button type="primary" size="large" icon={<SearchOutlined />}>Buscar</Button>
                    </div>

                    <div style={{ marginLeft: "30px", marginBottom: "auto", fontSize: "12px", display: "flex" }}>
                        <div style={{ marginLeft: "30px", marginTop: "7px" }}>
                            <p>Cantidad: {infoPaginacion.totalItems}</p>
                        </div>
                    </div>
                </Space>
            </div>

            <List
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
                                            <div className="one" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <p style={{ font: "menu", color: "grey" }}>{item.nombreProducto}</p>
                                            </div>
                                            <div className="two" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                <p style={{ font: "revert-layer", color: "grey" }}>{item.nombreVendedor}</p>
                                                <a onClick={iniciarChat}>Iniciar chat</a>
                                            </div>
                                            <div className="three" style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                                <Button style={{ width: "150px" }}>Realizar reclamo</Button>
                                                <Button style={{ width: "150px" }} disabled={item.estadoCompra !== EstadoCompra.Completada}>Calificar</Button>
                                                <Button disabled={item.estadoCompra != EstadoCompra.Completada || !item.esEnvio} style={{ width: "150px" }} type="primary">Completar compra</Button>
                                            </div>
                                        </div>
                                    </Content>
                                    <Footer>
                                        {"Cantidad: " + item.cantidad + " Precio: $ " + item.montoUnitario + " Total:" + item.montoTotal}

                                    </Footer>
                                </Layout>
                            </Layout>
                        </Card>
                    </List.Item>
                )}
            />
        </div >

    );
}