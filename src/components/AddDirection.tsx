import React, {useState} from "react";
import {Form, Input, Checkbox, Button, Select, } from 'antd';
import { CompradorService } from "shopit-shared";

 
const AddDirection: React.FC<{esVendedor:any, callBack: any}> = (props) => {
  const doc: any = document;
  let [esEnvio, setEsEnvio] = useState(false);
  let [local, setEsLocal] = useState(false);
  let [departamento, setDepartamento] = useState("");
  const { Option } = Select;
  const { TextArea } = Input;
  let valores = []; 
  let {callBack} = props;

  const onFinish = (values: any) => {
    let requestBody = {
      calle: values.calle,
      numero: values.numero,
      departamento: values.departamento,
      notas: values.aclaracion,
      esLocal: local 
    }

    CompradorService.agregarDireccion(requestBody).then(res => {
  
      doc.getElementById("aclaracion").value = "";
      doc.getElementById("calle").value = "";
      doc.getElementById("numero").value = "";
      setEsEnvio(false);
      setEsLocal(false);

      callBack();
    }).catch(e => {
      console.log(e);
    })

    
    
  };

  const onChangeCombo = (e: any) => {
    if(e.target.value === "envio"){
      setEsEnvio(true);
      setEsLocal(false);
    }else{
      setEsEnvio(false);
      setEsLocal(true);
    }
  }


  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Calle"
        name="calle"
        rules={[{ required: true }]}>
        <Input id="calle" />
      </Form.Item>

      <Form.Item
        label="Numero"
        name="numero"
        rules={[{ required: true }]}
      >
        <Input type="Number" id="numero" />
      </Form.Item>
      
      <Form.Item
        name="departamento"
        label="Departamento">
        <Select id="departamentos" >
            <Option value="vacia">Eliga un departamento</Option>
            <Option value="Lavalleja">Lavalleja</Option>
            <Option value="Florida">Florida</Option>
            <Option value="Flores">Flores</Option>
            <Option value="Durazno">Durazno</Option>
            <Option value="Colonia">Colonia</Option>
            <Option value="CerroLargo">Cerro Largo</Option>
            <Option value="Canelones">Canelones</Option>
            <Option value="Artigas">Artigas</Option>
            <Option value="Salto">Salto</Option>
            <Option value="Rocha">Rocha</Option>
            <Option value="Rivera">Rivera</Option>
            <Option value="RioNegro">Río Negro</Option>
            <Option value="Paysandu">Paysandú</Option>
            <Option value="Montevideo">Montevideo</Option>
            <Option value="Maldonado">Maldonado</Option>
            <Option value="TreintayTres">Treinta y Tres	</Option>
            <Option value="Tacuarembo">Tacuarembó</Option>
            <Option value="Soriano">Soriano</Option>
            <Option value="SanJose">San José</Option>
          </Select>
      </Form.Item>

      <Form.Item label="Aclaracion" name="aclaracion">
          <TextArea rows={2} id="aclaracion"/>
        </Form.Item>

      <Form.Item style={props.esVendedor ? {display:"block"} : {display:"none"}} name="tipoDireccion" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox value="envio" checked={esEnvio} onChange={onChangeCombo}>Envio</Checkbox>
        <Checkbox value="local" checked={local} onChange={onChangeCombo}>Local</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Agregar nueva direccion
        </Button>
      </Form.Item>
    </Form>
  );
}


export default AddDirection;
 
