import React, { useEffect, useState } from 'react'
import '../main.css'
import { Button, Pagination, PaginationProps, Row, Select, Space } from 'antd';
import { ItemPublication } from './ItemPublication';
import { DtFiltros } from 'shopit-shared/dist/user/ProductoService';
import { ProductoService } from 'shopit-shared';
import { DtProductoSlim, listados } from 'shopit-shared/dist/user/VendedorService';
import { SearchOutlined } from '@ant-design/icons';


// @ts-check

interface AppState {
  productos: Array<DtProductoSlim>
  filtros: DtFiltros
  paginaActual: number
  paginasTotales: number
  paginaAbuscar: number
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

  const busqueda = () => {
    ProductoService.listarProductos(paginaAbuscar.toString(), valoresOrdenamiento.cantidadItems, valoresOrdenamiento.ordenamiento, valoresOrdenamiento.dirOrdenamiento, valoresFiltros).then((result) => {
      if (result.productos != undefined) {
        setProductos(result.productos);
        setPaginaActual(result.currentPage + 1)
        setpaginasTotales(result.totalPages * 10)
      }
    })
  }

  useEffect(() => {
    busqueda();
  }, [])

  const handleChange = (value: string, id: string) => {
    setValoresOrdenamiento({ ...valoresOrdenamiento, [id]: value })
  };

  const onChange: PaginationProps['onChange'] = pageNumber => {
    setPaginaAbuscar(pageNumber);
    busqueda();
  };

  const { Option } = Select;

  return (
    <React.Fragment>
      <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
        <Space size={30}>
        <Select defaultValue="nombre" style={{ width: 120 }} onChange={(value) => handleChange(value, "ordenamiento")}>
          <Option value="nombre">Nombre</Option>
          <Option value="fecha_inicio">Más nuevos</Option>
          <Option value="precio">Precio</Option>
          <Option value="permite_envio">Permiten envio</Option>
        </Select>

        <Select defaultValue="asc" style={{ width: 120 }} onChange={(value, id) => handleChange(value, "dirOrdenamiento")}>
          <Option value="asc">Ascendente</Option>
          <Option value="dsc">Descendente</Option>
        </Select>

        <Select defaultValue="20" style={{ width: 120 }} onChange={(value, id) => handleChange(value, "cantidadItems")}>
          <Option value="20">20</Option>
          <Option value="30">30</Option>
        </Select>

        <Button type="primary" icon={<SearchOutlined />} onClick={busqueda} style={{marginLeft:8}}>
          Actualizar resultados
        </Button>
        </Space>
      </div>
      <div className="row">
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
      <Pagination style={{display:'flex', justifyContent:'center'}} defaultCurrent={paginaActual} total={paginasTotales} current={paginaActual} onChange={onChange} />
    </React.Fragment>
  );
}
export default Publicactions;
