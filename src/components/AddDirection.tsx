import React, { useState } from "react";
import { Form, Input, Button, Select, message, Row, Divider, RadioChangeEvent, Radio } from 'antd';
import { CompradorService } from "shopit-shared";


const AddDirection: React.FC<{ esVendedor: boolean, callBack: any, editar: boolean, idDireccion?: string, datosActuales?: editDireccion }> = (props) => {
  const token: string = localStorage.getItem("token") as string;
  const doc: any = document;
  const { datosActuales } = props;
  let [esEnvio, setEsEnvio] = useState(false);
  let [local, setEsLocal] = useState(false);
  const { Option } = Select;
  const { TextArea } = Input;
  let { callBack } = props;
  const [form] = Form.useForm();
  const [cheked, setCheked] = useState("");

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

    if (props.editar) {
      requestBody.id = props.idDireccion != undefined ? props.idDireccion : "";
      CompradorService.editarDireccion(token, requestBody).then(res => {
        if (res.status === 200) {
          message.success('Dirección editada con éxito');
          callBack();
        }
      })
    } else {
      CompradorService.agregarDireccion(token, requestBody).then(res => {

        doc.getElementById("aclaracion").value = "";
        doc.getElementById("calle").value = "";
        doc.getElementById("numero").value = "";
        setEsEnvio(false);
        setEsLocal(false);
        if (res.success) {
          message.success('Dirección agregada con éxito');
          callBack();
        } else {
          message.error(res.message);
        }

        form.setFieldsValue({
          calle: "",
          numero: "",
          localidad: "",
          departamento: "",
          aclaracion: ""
        });

      })
    }

  };

  const onChange = (e: RadioChangeEvent) => {
    setCheked(e.target.value);
    if (e.target.value == "envio") {
      setEsEnvio(true);
      setEsLocal(false);
    } else {
      setEsEnvio(false);
      setEsLocal(true);
    }
  };



  React.useEffect(() => {
    if (datosActuales != null) {
      form.setFieldsValue({
        calle: datosActuales.calle,
        numero: datosActuales.numero,
        localidad: datosActuales.localidad,
        departamento: datosActuales.departamento,
        aclaracion: datosActuales.aclaracion
      });
      if (datosActuales.esLocal) {
        setEsLocal(true);
      }
    }

  }, [datosActuales]);


  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: (props.editar) ? "100%" : "50%" }}>
        <h2 style={{ textAlign: "center" }}>Datos de la dirección</h2>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Calle"
            name="calle"
            rules={[{ required: true, message: 'La calle no puede ser vacía' }]}
          >
            <Input id="calle" />
          </Form.Item>

          <Form.Item
            label="Número"
            name="numero"
            rules={[{ required: true, message: 'El número no puede ser vacío' }]}
          >
            <Input id="numero" />
          </Form.Item>

          <Form.Item
            label="Localidad"
            name="localidad"
            rules={[{ required: true, message: 'La localidad no puede ser vacía' }]}>
            <Input id="localidad" />
          </Form.Item>

          <Form.Item
            name="departamento"
            rules={[{ required: true, message: 'Debe elegir un departamento' }]}
            label="Departamento">
            <Select id="departamentos" placeholder="Seleccione uno" >
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

          <Form.Item label="Aclaración (opcional)" name="aclaracion">
            <TextArea rows={2} id="aclaracion" />
          </Form.Item>
          {!props.editar &&
            <Form.Item style={props.esVendedor ? { display: "block" } : { display: "none" }} name="tipoDireccion" label="Tipo"
              rules={[props.esVendedor ? { required: true, message: 'Debe elegir un tipo' } : {}]}
            >

              <Radio.Group onChange={onChange} value={cheked}>
                <Radio value="envio" checked={esEnvio}>Envío</Radio>
                <Radio value="local" checked={local}>Local</Radio>
              </Radio.Group>
            </Form.Item>
          }
          <Divider></Divider>
          <Form.Item >
            <Row justify="center">
              <Button type="primary" htmlType="submit">
                {props.editar ? "Editar dirección" : 'Agregar nueva dirección'}
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}


export default AddDirection;

type editDireccion = { calle: string, numero: number, departamento: string, localidad: string, aclaracion: string, esLocal: boolean }