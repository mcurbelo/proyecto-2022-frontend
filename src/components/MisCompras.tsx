import React, { useEffect, useState } from "react";
import { Card, Menu, List, message, Input, Dropdown, Space, Button, Layout, Image, Steps } from 'antd';
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


    return (
        <div style={{ margin: "auto", width: "80%", padding: "50px" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                <div style={{ marginBottom: "20px" }}>
                    <Input size="large" placeholder="Buscar" prefix={<SearchOutlined />} />
                </div>
                <div style={{ marginLeft: "30px", marginBottom: "auto", fontSize: "12px", display: "flex" }}>
                    <div style={{ float: "left" }}>
                        <Dropdown overlay={menu} trigger={['click']} >
                            <a onClick={e => e.preventDefault()}>
                                <Button style={{ border: "0px" }}>
                                    <Space>
                                        {filtroActual}
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </a>
                        </Dropdown>

                    </div>
                    <div style={{ marginLeft: "30px", marginTop: "7px" }}>
                        <p>Cantidad: 19</p>
                    </div>

                </div>

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
                        <Card title={item.fecha.toString()}>
                            <Layout>
                                <Sider style={{ backgroundColor: "transparent" }}>
                                    <div style={{ margin: "10px" }}>
                                        <Image
                                            width={150}
                                            src={""}
                                        />
                                    </div>
                                </Sider>
                                <Layout>
                                    <Header style={{ backgroundColor: "transparent" }}>
                                        <Steps style={{ marginTop: "10px" }} size="small" current={item.estadoCompra}>
                                            <Step title="Esperando aceptacion" />
                                            <Step title="Aceptada" />
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
                                                <a onClick={iniciarChat}>Iniciar Chat</a>
                                            </div>
                                            <div className="three" style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                                <Button style={{ width: "50%" }}>Realizar Reclamo</Button>
                                                <Button style={{ width: "50%" }}>Calificar</Button>
                                                <Button disabled={item.estadoCompra != EstadoCompra.Completada} style={{ width: "50%" }} type="primary">Completar compra</Button>
                                            </div>
                                        </div>
                                    </Content>
                                    <Footer>Llegó el {item.fecha.toString()}</Footer>
                                </Layout>
                            </Layout>
                        </Card>
                    </List.Item>
                )}
            />
        </div>

    );
}