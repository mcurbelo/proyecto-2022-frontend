import React, {useEffect, useState} from "react";
import {Form, Input, Checkbox, Button, Select, message } from 'antd';
import { CompradorService } from "shopit-shared";
import { type } from "@testing-library/user-event/dist/type";
import { debug } from "console";


const AddDirection: React.FC<{esVendedor:boolean, callBack: any, editar: boolean, idDireccion?: string, datosActuales?: editDireccion }> = (props) => {
  const token : string =  localStorage.getItem("token") as string;
  const doc: any = document;
  const {datosActuales} = props;
  let [esEnvio, setEsEnvio] = useState(false);
  let [local, setEsLocal] = useState(false);
  const { Option } = Select;
  const { TextArea } = Input;
  let {callBack} = props;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    let requestBody = {
      calle: values.calle,
      numero: values.numero,
      departamento: values.departamento,
      localidad: values.localidad,
      notas: values.aclaracion,
      esLocal: local,
      id: ""
    }

    if(props.editar){
      requestBody.id = props.idDireccion != undefined? props.idDireccion : "";
      CompradorService.editarDireccion(token, requestBody).then(res => {
          if(res.status === 200){
            message.success('Direccion editada con exito');
            callBack();
          }
      }).catch(e => {
        console.log(e);
      })
    }else{
      CompradorService.agregarDireccion(token, requestBody).then(res => {
  
        doc.getElementById("aclaracion").value = "";
        doc.getElementById("calle").value = "";
        doc.getElementById("numero").value = "";
        setEsEnvio(false);
        setEsLocal(false);
        if(res.success){
          message.success('Direccion agregada con exito');
        }else{
          message.success('Direccion agregada con exito');
        }
        
        form.setFieldsValue({
          calle: "",
          numero: "",
          localidad: "",
          departamento: "",
          aclaracion: ""
        });
      
        callBack();
      }).catch(e => {
        console.log(e);
      })
    }
    

    
    
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


  
  React.useEffect(() => {
    if(datosActuales != null){
      form.setFieldsValue({
        calle: datosActuales.calle,
        numero: datosActuales.numero,
        localidad: datosActuales.localidad,
        departamento: datosActuales.departamento,
        aclaracion: datosActuales.aclaracion
      });
      if(datosActuales.esLocal){
        setEsLocal(true);
      }
    }
    
  }, [datosActuales]);


  return (


    
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="Calle"
        name="calle">
        <Input id="calle"/>
      </Form.Item>

      <Form.Item
        label="Numero"
        name="numero"
      >
        <Input type="Number" id="numero" />
      </Form.Item>

      <Form.Item
        label="Localidad"
        name="localidad"
        >
        <Input id="localidad" />
      </Form.Item>
      
      <Form.Item
        name="departamento"
        label="Departamento">
        <Select id="departamentos" >
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
          <TextArea rows={2} id="aclaracion" />
        </Form.Item>

      <Form.Item style={props.esVendedor ? {display:"block"} : {display:"none"}} name="tipoDireccion" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox value="envio" checked={esEnvio} onChange={onChangeCombo}>Envio</Checkbox>
        <Checkbox value="local" checked={local} onChange={onChangeCombo}>Local</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          { props.editar ? "Editar direccion" : 'Agregar nueva direccion'}
        </Button> 
      </Form.Item>
    </Form>
  );
}


export default AddDirection;
 
type editDireccion =  {calle:string, numero: number, departamento:string, localidad: string, aclaracion:string, esLocal: boolean}