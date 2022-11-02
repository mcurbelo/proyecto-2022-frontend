import { Button, Form, FormInstance, Input, Modal, Result, Select, Space } from "antd"
import React, { useState } from "react";
import { CompradorService } from "shopit-shared";
import { DtAltaReclamo } from "shopit-shared/dist/user/CompradorService";
import { TipoReclamo } from "shopit-shared/dist/user/VendedorService"

const { Option } = Select;

type reclamoProps = {
    idCompra: string,
    showModal: () => void,
    nombreUsuario: string
}

export const RealizarReclamo = (props: reclamoProps) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { idCompra, showModal, nombreUsuario } = props
    const [open, setOpen] = useState(true);
    const [datosReclamos, setDatosReclamos] = useState<DtAltaReclamo>({
        descripcion: "",
        tipo: TipoReclamo.Otro
    });
    const [isLoading, setLoading] = useState(false);

    const hideModal = () => {
        setOpen(false);
    };

    const hacerReclamo = () => {
        setLoading(true);
        CompradorService.nuevoReclamo(id!, token!, idCompra, datosReclamos).then((result) => {
            if (result == "200") {
                Modal.success({
                    title: "Reclamo enviado correctamente",
                    content: "Se ha notificado al comprador que tiene un nuevo reclamo. Se te avisará cuando haya una respuesta.",
                });
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


    const formRef = React.createRef<FormInstance>();

    return (
        <Modal title={"Iniciar reclamo a vendedor - " + nombreUsuario} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
            <Form ref={formRef} name="control-ref" layout="vertical" onFinish={hacerReclamo}>
                <Form.Item name="tipo" label="Tipo:" rules={[{ required: true, message: "El tipo es obligatorio." }]} >
                    <Select placeholder="Seleccione el tipo de reclamo" value={TipoReclamo.DesperfectoProducto} onChange={(value) => setDatosReclamos({ ...datosReclamos, "tipo": value })}>
                        <Option value={TipoReclamo.DesperfectoProducto}>Desperfecto en el producto</Option>
                        <Option value={TipoReclamo.ProductoNoRecibido}>Producto no recibido</Option>
                        <Option value={TipoReclamo.ProducoErroneo}>Producto erroneo</Option>
                        <Option value={TipoReclamo.Otro}>Otro</Option>
                    </Select>
                </Form.Item >
                <Form.Item name="desc" label="Descripción:" rules={[{ required: true, message: "La descripcion es obligatoria." }]}>
                    <Input.TextArea showCount maxLength={255} onChange={(e) => setDatosReclamos({ ...datosReclamos, "descripcion": e.target.value })} />
                </Form.Item>

                <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <Space size={50}>
                        <Button htmlType="button" onClick={hideModal} style={{ width: "150px" }}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
                            Enviar reclamo
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default RealizarReclamo;