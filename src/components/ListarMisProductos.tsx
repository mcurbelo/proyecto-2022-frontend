import { SearchOutlined, UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { faCircleQuestion, faSquareCheck, faComments, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Card, Collapse, DatePicker, DatePickerProps, Divider, Empty, Input, List, Pagination, Row, Select, Space, Tooltip, Image } from "antd";
import locale from "antd/lib/date-picker/locale/en_US";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { VendedorService } from "shopit-shared";
import { DtFiltrosMisProductos, DtMiProducto, EstadoProducto, TipoReclamo, TipoResolucion } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'

interface AppState {
    productos: DtMiProducto[],
    filtros: DtFiltrosMisProductos
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

})

const { Option } = Select;

export const MisProductos = () => {
    const styles = useStyles();
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const [productos, setProductos] = useState<AppState["productos"]>()
    const [filtros, setFiltros] = useState<AppState["filtros"]>({
        fecha: undefined,
        categorias: undefined,
        nombre: undefined,
        estadoProducto: undefined
    })
    const [valoresOrdenamiento, setValoresOrdenamiento] = useState({
        ordenamiento: "fecha_inicio",
        dirOrdenamiento: "dsc",
        cantidadItems: "20"
    })
    const [infoPaginacion, setInfoPaginacion] = useState({
        paginaActual: 0,
        paginasTotales: 0,
        totalItems: 0
    })
    const [paginaAbuscar, setPaginaAbuscar] = useState(0)

    const { Panel } = Collapse;


    useEffect(() => {
        busqueda()
    }, [paginaAbuscar])

    const busqueda = () => {
        VendedorService.listarMisProductos(id!, token!, paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, filtros).then((result) => {
            if (result.misProductos !== undefined) {
                setProductos(result.misProductos);
                setInfoPaginacion({ paginaActual: result.currentPage + 1, paginasTotales: result.totalPages * 10, totalItems: result.totalItems })
            }
        })
    }

    const handleChange = (value: string) => {
        if (value === "fechaAsc")
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "asc", "ordenamiento": "fecha_inicio" })
        else
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "dsc", "ordenamiento": "fecha_inicio" })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setFiltros({ ...filtros, [id]: e.target.value === "" ? undefined : e.target.value })
    }

    const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        setFiltros({ ...filtros, "fecha": dateString === "" ? undefined : dateString })
    };

    const onChangeTipo = (value: EstadoProducto | boolean) => {
        if (typeof value === "boolean") {
            setFiltros({ ...filtros, estadoProducto: undefined })
        } else {
            setFiltros({ ...filtros, estadoProducto: value })
        }
    };

    let locale = {
        emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No se encontraron resultados :(" />
        )
    }


    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#F0F0F0" }}>
            <div className={styles.container} style={{ backgroundColor: "#F0F0F0" }} >
                <h1 style={{ textAlign: "center" }}>Mis productos</h1>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "2%" }}>
                    <Card style={{ width: "100%" }}>
                        <div>
                            <Row className={styles.containerFiltros}>

                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="nPro" style={{ display: "block" }}>Producto:</label>
                                    <Input id="nPro" placeholder="Buscar" onChange={(e) => handleInputChange(e, "nombre")} prefix={<SearchOutlined />} />
                                </div>

                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                                    <Select id="orden" className={styles.filtros} defaultValue={"fechaDsc"} style={{ minWidth: "202px" }} onChange={handleChange}>
                                        <Option value="fechaDsc">Últimos productos</Option>
                                        <Option value="fechaAsc">Productos más antiguos</Option>
                                        <Option value="fechaAsc">Nombre (A-Z)</Option>
                                        <Option value="fechaAsc">Nombre (Z-A)</Option>
                                    </Select>
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="fecha" style={{ display: "block" }}>Fecha de ingreso:</label>
                                    <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "202px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="tipo" style={{ display: "block" }}>Tipo:</label>
                                    <Select id="tipo" defaultValue={true} className={styles.filtros} style={{ minWidth: "202px" }} onChange={(value) => onChangeTipo(value)}>
                                        <Option value={true}>Todos</Option>
                                        <Option value={EstadoProducto.Activo}>Producto con desperfecto</Option>
                                        <Option value={EstadoProducto.Pausado}>No listado</Option>
                                        <Option value={EstadoProducto.BloqueadoADM}>Bloqueado</Option>
                                    </Select>
                                </div>


                            </Row>
                            <Divider></Divider>
                            <Row style={{ gap: "10px", marginTop: "2%", justifyContent: "space-evenly" }}>

                                <div style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
                                    <span>Resultados: {infoPaginacion.totalItems}</span>
                                </div>

                                <div style={{ minWidth: "150px" }}>
                                    <Button type="primary" size="large" icon={<SearchOutlined />} onClick={busqueda} style={{ width: '150px', height: "47px" }}>Buscar</Button>
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
                    dataSource={productos}
                    renderItem={item => (
                        <List.Item>
                            <Card style={{ width: 300 }}>
                                    <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{item.nombre}</p>
                          
                                    <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{"Fecha ingresado: " + item.fechaInicio}</p>
                  
                                    <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>{"Fecha fin: "+item.fechaFin}</p>

                                    <p style={{ font: "menu", textAlign: "justify", textJustify: "inter-word" }}>Stock: {item.stock}</p>

                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual} onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
            </div >
        </div>
    )
}