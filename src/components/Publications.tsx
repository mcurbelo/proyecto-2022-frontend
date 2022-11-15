import React, { useEffect, useState } from 'react'
import '../main.css'
import { Button, Card, Col, List, Pagination, PaginationProps, Row, Select, Space } from 'antd';
import { ItemPublication } from './ItemPublication';
import { DtFiltros } from 'shopit-shared/dist/user/ProductoService';
import { CategoriaService, ProductoService } from 'shopit-shared';
import { DtProductoSlim } from 'shopit-shared/dist/user/VendedorService';
import { useMitt } from 'react-mitt';
import { DtCategoria } from 'shopit-shared/dist/user/CategoriaService';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import { createUseStyles } from 'react-jss';
import { table } from 'console';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';


// @ts-check

interface AppState {
  productos: Array<DtProductoSlim>
  filtros: DtFiltros
  paginaActual: number
  paginasTotales: number
  paginaAbuscar: number
  categorias: DtCategoria[]
}

const useStyles = createUseStyles({
  "@global": {
    ".ant-card-meta-title": {
      whiteSpace: "pre-line"
    }
  },
  container: {
    display: "inline-flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  filtros: {
    width: "18%"
  },
  '@media screen and (max-width: 500px)': {
    container: {
      flexDirection: "column"
    }
  },
  '@media screen and (max-width: 1241px)': {
    filtros: {
      width: "30%"
    }
  },
  '@media screen and (max-width: 833px)': {
    filtros: {
      width: "100%",
    },
    container: {
      marginRight:"5%"
    }
  }

})

//TODO Evento Promocional - Segun implementacion

function Publicactions() {
  const styles = useStyles();
  const [productos, setProductos] = useState<AppState["productos"]>([]);
  const [valoresFiltros, setValoresFiltro] = useState<AppState["filtros"]>({
    recibirInfoEventoActivo: undefined,
    nombre: undefined,
    categorias: [],
    idEventoPromocional: undefined
  });
  const [paginaActual, setPaginaActual] = useState<AppState["paginaActual"]>()
  const [paginasTotales, setpaginasTotales] = useState<AppState["paginasTotales"]>()
  const [paginaAbuscar, setPaginaAbuscar] = useState<AppState["paginaAbuscar"]>(0)
  const [valoresOrdenamiento, setValoresOrdenamiento] = useState({
    ordenamiento: "nombre",
    dirOrdenamiento: "dsc",
    cantidadItems: "20"
  })
  const [categorias, setCategorias] = useState<AppState["categorias"]>([])

  const { emitter } = useMitt()
  const { Option } = Select;

  useEffect(() => {
    emitter.on('busquedaProducto', event => { setValoresFiltro({ ...valoresFiltros, "nombre": event.data }); setPaginaAbuscar(0) });
    emitter.on('busquedaCategoria', event => { setValoresFiltro({ ...valoresFiltros, "categorias": [event.data] }); setPaginaAbuscar(0) });
    busqueda();
    if (categorias.length === 0) {
      obtenerCategorias();
    }
  }, [valoresFiltros, paginaAbuscar, valoresOrdenamiento])


  const busqueda = () => {
    ProductoService.listarProductos(paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, valoresFiltros).then((result) => {
      if (result.productos !== undefined) {
        setProductos(result.productos);
        setPaginaActual(result.currentPage + 1)
        setpaginasTotales(result.totalPages * 10)
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

  const handleChange = (value: string, id: string) => {
    setValoresOrdenamiento({ ...valoresOrdenamiento, [id]: value })
  };

  const onChange: PaginationProps['onChange'] = pageNumber => {
    setPaginaAbuscar(pageNumber - 1);
  };

  const handleChangeCategoria = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked ? [...valoresFiltros.categorias, tag] : valoresFiltros.categorias.filter(t => t !== tag);
    setValoresFiltro({ ...valoresFiltros, 'categorias': nextSelectedTags });
  };

  const reinicarBusqueda = () => {
    setValoresFiltro({
      recibirInfoEventoActivo: undefined,
      nombre: undefined,
      categorias: [],
      idEventoPromocional: undefined
    })
    setPaginaAbuscar(0);
    setValoresOrdenamiento({
      ordenamiento: "nombre",
      dirOrdenamiento: "asc",
      cantidadItems: "20"
    })
  }


  const productosRender = () => {
    if (productos.length === 0) {
      return <Row justify='center' gutter={[50, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Card title="No se encontraron resultados :(" style={{ width: '50%' }} headStyle={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }} >
            <Button type='primary' onClick={reinicarBusqueda}>Ver productos iniciales</Button>
          </div>
        </Card>
      </Row>
    }
    else {
      return <div>
        <div style={{ maxWidth: "100%", margin: " 0 auto", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }} >
          {
            productos.map((value, index) => {
              return (
                <Col key={index} style={{ display: 'flex', justifyContent:"center" }}>
                  <ItemPublication key={index} producto={value}></ItemPublication>
                </Col>
              )
            })
          }


        </div>
        <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={paginaActual} total={paginasTotales} current={paginaActual} onChange={onChange} />
      </div>
    }
  }

  document.body.style.backgroundColor = "#F0F0F0"

  return (
    <React.Fragment>
      <div className={styles.container} style={{ display: 'flex', marginTop: '30px', marginLeft: "5%", justifyContent: 'center', gap: "3%" }}>
        <div className={styles.filtros} style={{ display: 'flex', justifyContent: "center", marginBottom: '5%' }}>
          <div style={{ width: "100%", }}>
            <Card title="Filtros aplicados" bodyStyle={{ padding: "5%" }} >
              <Space direction="vertical" size={10} style={{ display: 'flex' }}>
                <div>
                  <label htmlFor="orden" style={{ display: "block" }}>Ordenar por:</label>
                  <Select id="orden" value={valoresOrdenamiento.ordenamiento} style={{ width: '100%' }} onChange={(value) => handleChange(value, "ordenamiento")}>
                    <Option value="nombre">Nombre</Option>
                    <Option value="fecha_inicio">Más nuevos</Option>
                    <Option value="precio">Precio</Option>
                    <Option value="permite_envio">Permite envío</Option>
                  </Select>
                </div>
                <hr />
                <div>
                  <label htmlFor="direccion" style={{ display: "block" }}>Dirección:</label>
                  <Select id="direccion" value={valoresOrdenamiento.dirOrdenamiento} style={{ width: '100%' }} onChange={(value) => handleChange(value, "dirOrdenamiento")}>
                    <Option value="asc">Ascendente</Option>
                    <Option value="dsc">Descendente</Option>
                  </Select>
                </div>
                <hr />
                <div>
                  <label htmlFor="cantidad" style={{ display: "block" }}>Cantidad:</label>
                  <Select id="cantidad" style={{ width: '100%' }} value={valoresOrdenamiento.cantidadItems} onChange={(value) => handleChange(value, "cantidadItems")}>
                    <Option value="20">20</Option>
                    <Option value="30">30</Option>
                  </Select>
                </div>
                <hr />
                <label style={{ display: "block" }}>Categorias:</label>
                {categorias.map(tag => (
                  <CheckableTag
                    key={tag.nombre}
                    checked={valoresFiltros.categorias.indexOf(tag.nombre) > -1}
                    onChange={checked => handleChangeCategoria(tag.nombre, checked)}>
                    &#9675; {tag.nombre}
                  </CheckableTag>
                ))}
              </Space>
            </Card>
          </div>
        </div>
        <div id="productos" style={{ flex: 1 }}>
          {productosRender()}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Publicactions;
