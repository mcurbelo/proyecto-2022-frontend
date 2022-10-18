import { FC } from 'react';
import { Button, Select, Form, Input} from 'antd';
import { createUseStyles } from "react-jss"
import '../main.css';

const { Option } = Select;

interface otherInfoProps {
  nombre: string,
  apellido: string, 
  correo: string,
  imagen: string,
  telefono: string
}

export const OtherInfo: FC<otherInfoProps> = (props) => {
  return (
    <div className='otherinfocolumn'>
      <div style={{marginBottom: "50px"}}>
        <h3 style={{marginBottom: "5px"}}>Informacion basica</h3>
          <Form
            name="basic"
            labelCol={{ span: 32 }}
            wrapperCol={{ span: 32 }}
            initialValues={{ remember: true }}
            autoComplete="off">
            <Form.Item
              label="Nombre"
              name="nombre">
              <Input value={props.nombre} />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="apellido" >
              <Input value={props.apellido} />
            </Form.Item>

            <Form.Item
              label="Correo"
              name="correo" >
              <Input value={props.correo} />
            </Form.Item>

            <Form.Item
              label="Telefono"
              name="telefono">
              <Input value={props.telefono}/>
            </Form.Item>
          </Form>
        </div>
        {/* <div>
          <h3 style={{marginBottom: "5px"}}>Direccion</h3>
          <Form
            name="basic"
            labelCol={{ span: 32 }}
            wrapperCol={{ span: 32 }}
            initialValues={{ remember: true }}
            autoComplete="off">
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
                placeholder="">
                <Option value="canelones">Canelones</Option>
                <Option value="montevideo">Montevideo</Option>
                <Option value="florida">Florida</Option>
              </Select>
            </Form.Item>
            
          </Form>
      </div> */}
    </div>
    
  );
}
export default OtherInfo;
