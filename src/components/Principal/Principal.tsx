import React from 'react'
import Footer from '../Footer/Footer'
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Style.css'
import { Col, Row, PageHeader, Button, Tag, Card } from 'antd';
import {ItemPublicacion} from '../ItemPublicacion';

// @ts-check

function Principal() {

  const items = [];



  for (let i = 0; i < 3; i++) {
    items.push(
      <ItemPublicacion precio={0} titulo='El que quieras' descripcion='el que quieras tambien' imagen="https://images.unsplash.com/photo-1546448396-6aef80193ceb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"></ItemPublicacion>
    );
  }

  var nombreUsuario: String;
  nombreUsuario = "Vitto";

  return (
    <>
      <div className='principalBox' >
        <div className="row">
          <div className="col">
              <Row justify="center" gutter={[50, { xs: 8, sm: 16, md: 24, lg: 32 }]}> 
                {items}
              </Row>
          </div>
          
        </div>
        
      </div>
      
      </>
  )
}

export default Principal;



/* esto es el header que habia hecho yo <PageHeader
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
            /> */
