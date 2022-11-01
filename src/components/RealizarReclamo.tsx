import { Button, Form, FormInstance, Input, Modal, Result, Select } from "antd"
import React, { useState } from "react";
import { CompradorService } from "shopit-shared";
import { DtAltaReclamo } from "shopit-shared/dist/user/CompradorService";
import { TipoReclamo } from "shopit-shared/dist/user/VendedorService"

const { Option } = Select;

type reclamoProps = {
    idCompra: string,

}

export const RealizarReclamo = (props: reclamoProps) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { idCompra } = props
    const [open, setOpen] = useState(true);
    const [datosReclamos, setDatosReclamos] = useState<DtAltaReclamo>({
        descripcion: "",
        tipo: TipoReclamo.Otro
    });
    const hideModal = () => {
        setOpen(false);
    };

    const hacerReclamo = () => {
        const datos: DtAltaReclamo = {
            descripcion: datosReclamos.descripcion,
            tipo: datosReclamos.tipo
        }
        return (
            <Result
                status="success"
                title="Reclamo enviado correctamente"
                subTitle="Se ha notificado al comprador que tiene un nuevo reclamo. Se te avisará cuando haya una respuesta."
                extra={[
                    <Button type="primary" key="console">
                        Entendido
                    </Button>,
                ]}
            />
        )
    }


    const formRef = React.createRef<FormInstance>();

    return (
        <Modal title="Iniciar reclamo a vendedor" open={open} onCancel={hideModal}>
            <Form ref={formRef} name="control-ref" onFinish={hacerReclamo}>
                <Form.Item name="note" label="Tipo:" rules={[{ required: true }]}>
                    <Select placeholder="Seleccione el tipo de reclamo" value={TipoReclamo.DesperfectoProducto} onChange={(value) => setDatosReclamos({ ...datosReclamos, "tipo": value })}>
                        <Option value={TipoReclamo.DesperfectoProducto}>Desperfecto en el prroducto</Option>
                        <Option value={TipoReclamo.ProductoNoRecibido}>Producto no recibido</Option>
                        <Option value={TipoReclamo.ProducoErroneo}>Producto erroneo</Option>
                        <Option value={TipoReclamo.Otro}>Otro</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="note" label="Descripcion:" rules={[{ required: true }]}>
                    <Input.TextArea showCount maxLength={255} onChange={(e) => setDatosReclamos({ ...datosReclamos, "descripcion": e.target.value })} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Enviar reclamo
                    </Button>
                    <Button htmlType="button" onClick={hideModal}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default RealizarReclamo;