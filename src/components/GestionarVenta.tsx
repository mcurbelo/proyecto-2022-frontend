import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DatePicker, Divider, Form, FormInstance, Input, Modal, Row, Select, Space, TimePicker } from "antd"
import { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import React, { useState } from "react";
import { VendedorService } from "shopit-shared";
import { DtConfirmarCompra, EstadoCompra } from "shopit-shared/dist/user/VendedorService"
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'


type acciones = {
    informacion: {
        idVenta: string,
        nombreUsuario: string,
        esEnvio: boolean,
        aceptar: boolean
        direccion: string
    },
    showModal: () => void,
    realizoAccion: (idVenta: string, aceptar: boolean, fechaEntrega: string) => void

}

export const GestionarVenta = (props: acciones) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { showModal, informacion, realizoAccion } = props
    const { idVenta, nombreUsuario, esEnvio, aceptar, direccion } = informacion
    const [open, setOpen] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [datosGestion, setDatosGestion] = useState<DtConfirmarCompra>({
        fechayHoraEntrega: undefined,
        fechayHoraRetiro: undefined,
        motivo: undefined
    })

    const hideModal = () => {
        setOpen(false);
    };
    const tipo = (esEnvio) ? "Envío" : "Retiro"
    const titulo = "Gestionar estado de venta - " + nombreUsuario;
    const contenido = () => {
        return (
            <>
                <p><b>Forma de entrega por</b>: {tipo}</p>
                <p><b>Dirección</b>: {direccion}</p>
            </>
        )
    }

    const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
        if (esEnvio)
            setDatosGestion({ ...datosGestion, fechayHoraEntrega: dateString });
        else
            setDatosGestion({ ...datosGestion, fechayHoraRetiro: dateString });
    };



    const cambiarEstadoVenta = () => {
        setLoading(true);
        VendedorService.cambiarEstadoVenta(id!, token!, idVenta, (aceptar) ? EstadoCompra.Confirmada : EstadoCompra.Cancelada, datosGestion).then((result) => {
            if (result == "200") {
                Modal.success({
                    title: "Estado de venta cambiado con éxito",
                    content: "Se ha notificado al comprador el nuevo estado de su compra.",
                });
                realizoAccion(idVenta, aceptar, (datosGestion.fechayHoraEntrega) ? datosGestion.fechayHoraEntrega : datosGestion.fechayHoraRetiro!)
            } else {
                const mensaje = result;
                Modal.error({
                    title: 'Ha ocurrido un error inesperado',
                    content: mensaje
                });
            }
            setLoading(false);
            showModal()
        })

    }


    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    // eslint-disable-next-line arrow-body-style
    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    };

    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(0, 7),
    });


    const formRef = React.createRef<FormInstance>();

    return (
        <>
            {aceptar && <Modal title={titulo} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
                {contenido()}
                <Divider></Divider>
                <h3 style={{ textAlign: "center", marginBottom: "8%" }}>Selecciona la fecha y hora de retiro:</h3>
                <Form ref={formRef} name="control-ref" layout="vertical" onFinish={cambiarEstadoVenta}>
                    <Row style={{ justifyContent: "space-around" }}>
                        <Form.Item name="tipo" label="Calendario:" rules={[{ required: true, message: "La fecha y hora es obligatoria" }]} >
                            <DatePicker showNow={false} placeholder="Seleccionar..." showTime={true} format={"DD/MM/YYYY HH:mm"} onChange={onChangeDate} disabledDate={disabledDate} />
                        </Form.Item >
                    </Row>
                    <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                        <Space size={"large"}>
                            <Button htmlType="button" onClick={hideModal} style={{ width: "150px" }}>
                                Cancelar
                            </Button>
                            <Button type="success" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
                                Aceptar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            }

            {!aceptar && <Modal title={titulo} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
                {contenido()}
                <Divider></Divider>
                <h3 style={{ textAlign: "center", marginBottom: "8%" }}>Ingrese el motivo por el cual rechaza la compra:</h3>
                <Form ref={formRef} name="control-ref" layout="vertical" onFinish={cambiarEstadoVenta}>
                    <Form.Item name="desc">
                        <Input.TextArea showCount maxLength={255} onChange={(e) => setDatosGestion({ ...datosGestion, "motivo": e.target.value })} />
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                        <Space size={"large"}>
                            <Button htmlType="button" onClick={hideModal} style={{ width: "150px" }}>
                                Cancelar
                            </Button>
                            <Button type="success" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
                                Aceptar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>}
        </>
    )

}

export default GestionarVenta;