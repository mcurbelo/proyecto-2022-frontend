import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import '../main.css'
import { Col, Row, PageHeader, Button, Tag, Card } from 'antd';
import {ItemPublication} from './ItemPublication';

// @ts-check

function Publicactions() {

  const items = [];
  for (let i = 0; i < 3; i++) {
    items.push(
      <ItemPublication precio={0} titulo='El que quieras' descripcion='el que quieras tambien' imagen="https://images.unsplash.com/photo-1546448396-6aef80193ceb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"></ItemPublication>
    );
  }
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
export default Publicactions;
