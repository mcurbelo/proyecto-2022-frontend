import React, { Component } from 'react';
import { Button, Select, Form, Input } from 'antd';
import { createUseStyles } from "react-jss"

import './styles.css';

const stylePass = {
  pass: {"outline": "0", "border-width": "0 0 1px", "border-color": "gainsboro", "background-color": "transparent"}
}
const { Option } = Select;

function OtherInfo() {

  return (
    
    <div className='otherinfocolumn'>
      <div style={{"margin-right": '50px'}}>
        <h3 style={{"margin-bottom": "5px"}}>Informacion basica</h3>
          <Form
            name="basic"
            labelCol={{ span: 32 }}
            wrapperCol={{ span: 32 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nombre"
              name="nombre"
              
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="apellido"
              
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Telefono"
              name="telefono"
              
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
        <div>
        <h3 style={{"margin-bottom": "5px"}}>Direccion</h3>
        <Form
          name="basic"
          labelCol={{ span: 32 }}
          wrapperCol={{ span: 32 }}
          initialValues={{ remember: true }}
          //disabled='false'
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Calle"
            name="calle">
            <Input />
          </Form.Item>

          <Form.Item
            label="Numero"
            name="numero">
            <Input type='Number' />
          </Form.Item>

          <Form.Item name="departamento" label="Departamento" >
            <Select
              placeholder=""
              //onChange={onGenderChange}
              //allowClear
            >
              <Option value="canelones">Canelones</Option>
              <Option value="montevideo">Montevideo</Option>
              <Option value="florida">Florida</Option>
            </Select>
          </Form.Item>
          
        </Form>
      </div>
    </div>
    
  );
}

export default OtherInfo;