import React, { useEffect, useState } from 'react'
import '../main.css'
import { Button, Card, Divider, Pagination, PaginationProps, Result, Row, Select, Space } from 'antd';
import { ItemPublication } from './ItemPublication';
import { DtFiltros } from 'shopit-shared/dist/user/ProductoService';
import { CategoriaService, ProductoService } from 'shopit-shared';
import { DtProductoSlim } from 'shopit-shared/dist/user/VendedorService';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMitt } from 'react-mitt';
import { DtCategoria } from 'shopit-shared/dist/user/CategoriaService';
import CheckableTag from 'antd/lib/tag/CheckableTag';


// @ts-check

interface AppState {
  productos: Array<DtProductoSlim>
  filtros: DtFiltros
  paginaActual: number
  paginasTotales: number
  paginaAbuscar: number
  categorias: DtCategoria[]
}


function Publicactions() {
  const [productos, setProductos] = useState<AppState["productos"]>([]);
  const [valoresFiltros, setValoresFiltro] = useState<AppState["filtros"]>({
    recibirInfoEventoActivo: undefined,
    nombre: undefined,
    categorias: undefined,
    idEventoPromocional: undefined
  });
  const [paginaActual, setPaginaActual] = useState<AppState["paginaActual"]>()
  const [paginasTotales, setpaginasTotales] = useState<AppState["paginasTotales"]>()
  const [paginaAbuscar, setPaginaAbuscar] = useState<AppState["paginaAbuscar"]>(0)
  const [valoresOrdenamiento, setValoresOrdenamiento] = useState({
    ordenamiento: "",
    dirOrdenamiento: "",
    cantidadItems: ""
  })
  const [categorias, setCategorias] = useState<AppState["categorias"]>([])
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([])
  const [cambioFiltro, setCambioFiltro]= useState<boolean>(false)

  const { emitter } = useMitt()

  const busqueda = () => {
    ProductoService.listarProductos(paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, valoresFiltros).then((result) => {
      if (result.productos != undefined) {
        setProductos(result.productos);
        setPaginaActual(result.currentPage + 1)
        setpaginasTotales(result.totalPages * 10)
        setCambioFiltro(false);
      }
    })
  }

  const obtenerCategorias = () => {
    CategoriaService.listarCategorias().then((result) => {
      if (result) {
        setCategorias(result);
      }
    })
  }

  useEffect(() => {
    emitter.on('busquedaProducto', event => { setValoresFiltro({ ...valoresFiltros, ["nombre"]: event.data }); setPaginaAbuscar(0) })
    emitter.on('busquedaCategoria', event => alert(event.data))
    busqueda();
    if (categorias.length == 0) {
      obtenerCategorias();
    }
  }, [valoresFiltros, paginaAbuscar])

  const handleChange = (value: string, id: string) => {
    setCambioFiltro(true);
    setValoresOrdenamiento({ ...valoresOrdenamiento, [id]: value })
  };

  const onChange: PaginationProps['onChange'] = pageNumber => {
    setPaginaAbuscar(pageNumber - 1);
  };

  const handleChangeCategoria = (tag: string, checked: boolean) => {
    setCambioFiltro(true);
    const nextSelectedTags = checked ? [...categoriasSeleccionadas, tag] : categoriasSeleccionadas.filter(t => t !== tag.toString());
    setCategoriasSeleccionadas(nextSelectedTags);
  };

  const agregarCategoriasAFiltro = () => {
    if (categoriasSeleccionadas.length == 0)
      setValoresFiltro({ ...valoresFiltros, ['categorias']: undefined })
    else
      setValoresFiltro({ ...valoresFiltros, ['categorias']: categoriasSeleccionadas })
  };

  const { Option } = Select;

//TODO Recordar filtros anteriores y arreglar card de productos. Tambien las Categorias desde el main header. Evento promocional chan

  return (
    <React.Fragment>
      <div style={{ display: 'flex', marginTop: '30px', marginLeft: "5%" }}>
        <div style={{ width: '20%', display: 'flex' }}>
          <div>
            <Card title="Filtros aplicados" bodyStyle={{ padding: "5%" }} extra={<Space size={20}> <Button type="primary"  disabled={!cambioFiltro} icon={<ReloadOutlined />} onClick={(JSON.stringify(categoriasSeleccionadas) === JSON.stringify(valoresFiltros.categorias)) ? busqueda : agregarCategoriasAFiltro} ></Button> </Space>}>
              <Space direction="vertical" size={10} style={{ display: 'flex' }}>
                <div>
                  <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                  <Select defaultValue="nombre" id="orden" style={{ width: '100%' }} onChange={(value) => handleChange(value, "ordenamiento")}>
                    <Option value="nombre">Nombre</Option>
                    <Option value="fecha_inicio">Más nuevos</Option>
                    <Option value="precio">Precio</Option>
                    <Option value="permite_envio">Permiten envio</Option>
                  </Select>
                </div>
                <hr />
                <div>
                  <label htmlFor="direccion" style={{ display: "block" }}>Dirección:</label>
                  <Select defaultValue="asc" id="direccion" style={{ width: '100%' }} onChange={(value) => handleChange(value, "dirOrdenamiento")}>
                    <Option value="asc">Ascendente</Option>
                    <Option value="dsc">Descendente</Option>
                  </Select>
                </div>
                <hr />
                <div>
                  <label htmlFor="cantidad" style={{ display: "block" }}>Cantidad:</label>
                  <Select defaultValue="20" id="cantidad" style={{ width: '100%' }} onChange={(value) => handleChange(value, "cantidadItems")}>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                  </Select>
                </div>
                <hr />
                <label style={{ display: "block" }}>Categorias:</label>
                {categorias.map(tag => (
                  <CheckableTag
                    key={tag.toString()}
                    checked={categoriasSeleccionadas.indexOf(tag.toString()) > -1}
                    onChange={checked => handleChangeCategoria(tag.toString(), checked)}
                  >
                    &#9675; {tag.toString()}
                  </CheckableTag>
                ))}
              </Space>
            </Card>
          </div>
        </div>
        <div className="row" style={{ flex: 1 }}>
          <div className="col">
            <Row justify="center" gutter={[50, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              {
                productos.map((producto, index) => {
                  return (
                    <ItemPublication producto={producto} key={index}></ItemPublication>
                  )
                })
              }
            </Row>
          </div>
        </div>
      </div>
      <Pagination style={{ display: 'flex', justifyContent: 'center' }} defaultCurrent={paginaActual} total={paginasTotales} current={paginaActual} onChange={onChange} />
    </React.Fragment>
  );
}
export default Publicactions;
