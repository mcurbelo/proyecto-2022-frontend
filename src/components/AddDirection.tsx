import React, { useState } from "react";
import { Form, Input, Button, Select, message, Row, Divider, RadioChangeEvent, Radio } from 'antd';
import { CompradorService } from "shopit-shared";


const AddDirection: React.FC<{ esVendedor: boolean, callBack: any, editar: boolean, idDireccion?: string, datosActuales?: editDireccion }> = (props) => {
  const token: string = localStorage.getItem("token") as string;
  const doc: any = document;
  const { datosActuales } = props;
  const { Option } = Select;
  const { TextArea } = Input;
  let { callBack } = props;
  const [form] = Form.useForm();
  const [esLocal, setEsLocal] = useState(false);

  const onFinish = (values: any) => {
    let requestBody = {
      calle: values.calle,
      numero: values.numero,
      departamento: values.departamento,
      localidad: values.localidad,
      notas: values.aclaracion,
      esLocal: esLocal,
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
    setEsLocal(e.target.value)
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
              <Option value="Cerro Largo">Cerro Largo</Option>
              <Option value="Canelones">Canelones</Option>
              <Option value="Artigas">Artigas</Option>
              <Option value="Salto">Salto</Option>
              <Option value="Rocha">Rocha</Option>
              <Option value="Rivera">Rivera</Option>
              <Option value="Río Negro">Río Negro</Option>
              <Option value="Paysandú">Paysandú</Option>
              <Option value="Montevideo">Montevideo</Option>
              <Option value="Maldonado">Maldonado</Option>
              <Option value="Treinta y Tres">Treinta y Tres</Option>
              <Option value="Tacuarembó">Tacuarembó</Option>
              <Option value="Soriano">Soriano</Option>
              <Option value="San José">San José</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Aclaración (opcional)" name="aclaracion">
            <TextArea rows={2} id="aclaracion" />
          </Form.Item>
          {!props.editar && props.esVendedor &&
            <Form.Item name="tipoDireccion" label="Tipo"
              rules={[{ required: true, message: 'Debe elegir un tipo' }]}
            >
              <Radio.Group onChange={onChange} value={esLocal}>
                <Radio value={false}>Envío</Radio>
                <Radio value={true}>Local</Radio>
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