import React from 'react'
import Item from '../Item/Item'
import Footer from '../Footer/Footer'
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Style.css'
import { Col, Row, PageHeader, Button, Tag, Card } from 'antd';

// @ts-check

function Principal() {

  const cols = [];


  for (let i = 0; i < 8; i++) {
    cols.push(
      <Col key={i.toString()} span={24 / 8}>
        <Item key={i} />
      </Col>,
    );
  }

  var nombreUsuario: String;
  nombreUsuario = "Vitto";

  

  const { Meta } = Card;

  return (
    <>
      <div className='principalBox' >
        <div className="row">
          <div className="col">
            {/* <PageHeader
              title="ShopNow"
              className="site-page-header"
              subTitle={nombreUsuario}
              //tags={<Tag color="blue">Running</Tag>}
              extra={[
                <Button key="inicio" shape='round'>Inicio</Button>,
                <Button key="prefil" shape='round'>Perfil</Button>,
                <Button key="miscompras" shape='round'>Mis compras</Button>,
                <Button key="vender" shape='round'>Vender</Button>,
                <Button icon={<ShoppingCartOutlined />} key="vender" shape='round'></Button>
      
              ]}
              avatar={{ src: 'https://cdn-icons-png.flaticon.com/512/1413/1413908.png' }}
            /> */}
              <Row justify="center" gutter={[50, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={5}>
                  <Card
                      hoverable
                      style={{ width: '100%', height: '450px'}}
                      cover={<img src="https://images.unsplash.com/flagged/photo-1593005510329-8a4035a7238f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />}
                    >
                    <Meta style={{position: "absolute", bottom: 20,left: 20}} title="Europe Street beat" description="www.instagram.com" />
                  </Card>
                </Col>
                <Col span={5}>
                  <Card
                      hoverable
                      style={{ width: '100%', height: '450px'}}
                      cover={<img  src="https://images.unsplash.com/photo-1546448396-6aef80193ceb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" />}
                    >
                    <Meta style={{position: "absolute", bottom: 20,left: 20}} title="Europe Street beat" description="www.instagram.com" />
                  </Card>
                </Col>
                <Col span={5}>
                  <Card
                      hoverable
                      style={{ width: '100%', height: '450px'}}
                      cover={<img  src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1429&q=80" />}
                    >
                    <Meta style={{position: "absolute", bottom: 20,left: 20}} title="Europe Street beat" description="99.99" />
                  </Card>
                </Col>
                
              </Row>
          </div>
          
        </div>
        
      </div>
      
      </>
  )
}

export default Principal;


