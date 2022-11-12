import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, DatePicker, DatePickerProps, Divider, Empty, Input, List, Pagination, Row, Select, Image, Carousel, Modal } from "antd";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { CategoriaService, VendedorService } from "shopit-shared";
import { DtFiltrosMisProductos, DtMiProducto, EstadoProducto } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleCheck, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { DtCategoria } from "shopit-shared/dist/user/CategoriaService";
import { useNavigate } from "react-router-dom";

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

        filtros: {
            width: "100%"
        }

    },

})

const { Option } = Select;
const { confirm } = Modal;

export const MisProductos = () => {
    const styles = useStyles();
    const navigate = useNavigate();
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
    const [categorias, setCategorias] = useState<DtCategoria[]>()


    useEffect(() => {
        busqueda()
        obtenerCategorias()
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
        if (value === "fechaDsc")
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "dsc", "ordenamiento": "fecha_inicio" })
        if (value === "nombreAsc")
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "asc", "ordenamiento": "nombre" })
        if (value === "nombreDsc")
            setValoresOrdenamiento({ ...valoresOrdenamiento, "dirOrdenamiento": "dsc", "ordenamiento": "nombre" })
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


    const cambiarEstadoProducto = (idProducto: string, nuevoEstado: EstadoProducto) => {
        confirm({
            title: "Estás seguro que deseas cambiar de estado el producto a '" + nuevoEstado + "' ?",
            icon: <ExclamationCircleOutlined />,
            content: 'Al confirmar se cambiará el estado del producto.',
            cancelText: "Cancelar",
            onOk() {
                return VendedorService.cambiarEstadoProducto(id!, token!, idProducto, nuevoEstado).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title: "Acción exitosa",
                            content: 'Estado del producto actualizado exitosamente',
                        });
                        actualizarEstadoProducto(idProducto, nuevoEstado);
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

    const actualizarEstadoProducto = (idProducto: string, estado: EstadoProducto) => {
        const productosActualizados = productos!.map(producto => {
            if (producto.idProducto === idProducto)
                return { ...producto, estado: estado };
            return producto;
        });
        setProductos(productosActualizados);
    }

    const obtenerCategorias = () => {
        CategoriaService.listarCategorias().then((result) => {
            if (result) {
                setCategorias(result);
            }
        })
    }

    const handleChangeCategorias = (value: string[]) => {
        setFiltros({ ...filtros, categorias: value })
    };

    const modificarProducto = (producto: DtMiProducto) => {
        navigate('/modificarProducto', { state: { productoInfo: producto } })
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
                                        <Option value="nombreAsc">Nombre (A-Z)</Option>
                                        <Option value="nombreDsc">Nombre (Z-A)</Option>
                                    </Select>
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="fecha" style={{ display: "block" }}>Fecha de ingreso:</label>
                                    <DatePicker placeholder="Eliga una fecha" className={styles.filtros} id="fecha" style={{ minWidth: "202px" }} format={"DD/MM/YYYY"} onChange={onChangeDatePicker} />
                                </div>
                                <div style={{ minWidth: "202px" }} className={styles.filtros}>
                                    <label htmlFor="tipo" style={{ display: "block" }}>Estado:</label>
                                    <Select id="tipo" defaultValue={true} className={styles.filtros} style={{ minWidth: "202px" }} onChange={(value) => onChangeTipo(value)}>
                                        <Option value={true}>Todos</Option>
                                        <Option value={EstadoProducto.Activo}>Activo</Option>
                                        <Option value={EstadoProducto.Pausado}>Pausado</Option>
                                        <Option value={EstadoProducto.BloqueadoADM}>Bloqueado</Option>
                                    </Select>
                                </div>

                                <div style={{ minWidth: "300px" }} className={styles.filtros}>
                                    <label htmlFor="categorias" style={{ display: "block" }}>Por categorias:</label>
                                    <Select
                                        id="categorias"
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%', minWidth: "300px" }}
                                        placeholder="Categorias"
                                        onChange={handleChangeCategorias}
                                        options={categorias?.map(categoria => ({ label: categoria.nombre, value: categoria.nombre }))}
                                    />
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
                        gutter: 20,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 4,
                    }}
                    dataSource={productos}
                    renderItem={item => (
                        <List.Item>
                            <Card>
                                <div style={{ textAlign: "center" }}>
                                    <Carousel>
                                        {
                                            item.imagenes.map((option, index) => {
                                                return (<Image key={index} src={option} height={200} ></Image>)
                                            })
                                        }

                                    </Carousel>
                                </div>
                                <Divider></Divider>
                                <div >
                                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{item.nombre}</p>

                                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>{"Fecha ingresado: " + item.fechaInicio}</p>

                                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>Fecha fin: {(item.fechaFin) ? item.fechaFin : "-"}</p>

                                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>Cantidad de stock: {(item.stock === 1) ? item.stock + " unidad" : item.stock + " unidades"}</p>

                                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>Estado publicación: {(item.estado === EstadoProducto.BloqueadoADM) ? "Bloqueado" : item.estado}</p>
                                </div>
                                <Divider></Divider>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ width: "45%" }}>
                                        <Button type="warning" disabled={item.estado === EstadoProducto.BloqueadoADM || item.estado === EstadoProducto.Pausado}
                                            style={{ textShadow: (item.estado !== EstadoProducto.BloqueadoADM && item.estado !== EstadoProducto.Pausado) ? "0 0 2px black" : "" }}
                                            block={true} onClick={() => cambiarEstadoProducto(item.idProducto, EstadoProducto.Pausado)}>Pausar <FontAwesomeIcon icon={faPause} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                    </div>
                                    <div style={{ width: "45%" }}>
                                        <Button type="success" disabled={item.estado === EstadoProducto.BloqueadoADM || item.estado === EstadoProducto.Activo}
                                            style={{ textShadow: (item.estado !== EstadoProducto.BloqueadoADM && item.estado !== EstadoProducto.Activo) ? "0 0 2px black" : "" }}
                                            block={true} onClick={() => cambiarEstadoProducto(item.idProducto, EstadoProducto.Activo)}>Habilitar <FontAwesomeIcon icon={faCircleCheck} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                    </div>
                                </div>
                                <Divider></Divider>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button type="primary" block={true} style={{ textShadow: "0 0 2px black" }} onClick={() => { modificarProducto(item) }}>Ver detalles | Editar <FontAwesomeIcon icon={faPenToSquare} style={{ display: "inline-block", marginLeft: "10px" }} /></Button>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />


                <Pagination hideOnSinglePage style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}
                    defaultCurrent={infoPaginacion.paginaActual} total={infoPaginacion.paginasTotales} current={infoPaginacion.paginaActual}
                    onChange={(value) => { setPaginaAbuscar(value - 1); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
            </div >
        </div>
    )
}