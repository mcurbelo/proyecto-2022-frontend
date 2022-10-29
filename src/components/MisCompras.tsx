import React, {useEffect, useState} from "react";
import { Card, Menu, List, message, Input, Dropdown, Space, Button, Layout, Image, Steps} from 'antd';
import { SearchOutlined, SlidersOutlined, DownOutlined } from '@ant-design/icons';

enum EstadosCompra {
    Completado = 2,
    Aceptado = 1,
    EsperandoConfirmacion = 0
  }

const data = [
    {
      title: '17 de julio',
      descripcion: "Cinta Tira Luces Led Rgb 5m 3528 C/ Transformador + Control®",
      imagen: "https://http2.mlstatic.com/D_825963-MLU45756476728_042021-N.jpg",
      estado: EstadosCompra.Completado
    },
    {
      title: '6 de marzo',
      descripcion: "Termo Termolar R-evolution 1lt - 5 Años De Garantía Acero",
      imagen: "https://http2.mlstatic.com/D_903165-MLU50613172225_072022-N.jpg",
      estado: EstadosCompra.Aceptado
    }
  ];

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


export const MisCompras: React.FC<{}> = (props) => {
    const { Header, Footer, Sider, Content } = Layout;
    const { Step } = Steps;
    const [filtroActual, setFiltroActual] = useState("Todas");


    const iniciarChat = () =>{}


    return (
    <div style={{margin: "auto",width: "80%", padding: "50px"}}>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <div style={{ marginBottom:"20px" }}>
                <Input  size="large" placeholder="Buscar" prefix={<SearchOutlined />} />
            </div>
            <div style={{marginLeft: "30px", marginBottom:"auto", fontSize: "12px", display:"flex" }}>
                <div style={{ float:"left"}}>
                    <Dropdown overlay={menu} trigger={['click']} >
                        <a onClick={e => e.preventDefault()}>
                        <Button style={{border: "0px"}}>
                            <Space>
                                {filtroActual}
                                <DownOutlined />
                            </Space>
                        </Button>
                        </a>
                    </Dropdown>
                    
                </div>
                <div style={{marginLeft: "30px", marginTop: "7px"}}>
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
            dataSource={data}
            renderItem={item => (
            <List.Item>
                <Card title={item.title}>
                    <Layout>
                        <Sider style={{backgroundColor:"transparent"}}>
                            <div style={{margin:"10px"}}>
                                <Image
                                    width={150}
                                    src={item.imagen}
                                />
                            </div>
                        </Sider>
                        <Layout>
                            <Header style={{backgroundColor:"transparent"}}>
                            <Steps style={{marginTop:"10px"}} size="small" current={item.estado}>
                                <Step title="Esperando aceptacion" />
                                <Step title="Aceptada" />
                                <Step title="Completada" />
                            </Steps>
                            </Header>
                            <Content>
                                <div className="misCompras-principal-div">
                                    <div className="one" style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                        <p style={{font:"menu", color:"grey"}}>{item.descripcion}</p>
                                    </div>
                                    <div className="two" style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                                        <p style={{font:"revert-layer", color:"grey"}}>HTS IMPORT SRL</p>
                                        <a onClick={iniciarChat}>Iniciar Chat</a>
                                    </div>
                                    <div className="three" style={{width:"90%", display:"flex", flexDirection:"column", alignItems:"flex-end",justifyContent:"flex-end"}}>
                                        <Button style={{width:"50%"}}>Realizar Reclamo</Button>
                                        <Button style={{width:"50%"}}>Calificar</Button>
                                        <Button disabled={item.estado != EstadosCompra.Completado} style={{width:"50%"}} type="primary">Completar compra</Button>
                                    </div>
                                </div>
                            </Content>
                            <Footer>Llegó el {item.title}</Footer>
                        </Layout>
                    </Layout>
                </Card>
            </List.Item>
            )}
    />
    </div>
    
    );
}