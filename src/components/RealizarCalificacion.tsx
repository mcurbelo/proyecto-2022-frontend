import { Button, Form, FormInstance, Input, Modal, Rate, Result, Select, Space } from "antd"
import React, { useState } from "react";
import { CompartidoUsuario, CompradorService } from "shopit-shared";
import { DtCalificacion } from "shopit-shared/dist/user/CompartidoUsuarios";
import { DtAltaReclamo } from "shopit-shared/dist/user/CompradorService";
import { TipoReclamo } from "shopit-shared/dist/user/VendedorService"

const { Option } = Select;

type reclamoProps = {
    idCompra: string,
}

export const Calificar = (props: reclamoProps) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { idCompra } = props
    const [open, setOpen] = useState(true);
    const [datosCalificacion, setDatosCalificacion] = useState<DtCalificacion>({
        puntuacion: 0,
        comentario: "",
        autor: id!,
    });
    const hideModal = () => {
        setOpen(false);
    };

    const hacerReclamo = () => {
        CompartidoUsuario.calificar(idCompra, token!, datosCalificacion).then((result) => {
            if (result == "200") {
                hideModal()
                Modal.success({
                    title: "Calificacion realizada",
                    content: "Se ha enviado exitosamente la calificación al usuario.",
                });
            } else {
                const mensaje = result;
                Modal.error({
                    title: 'Ha ocurrido un error inesperado',
                    content: mensaje
                });
            }
        })




    }


    const formRef = React.createRef<FormInstance>();

    return (
        <Modal title="Calificar" open={open} onCancel={hideModal} footer={null}>
            <Form ref={formRef} name="control-ref" layout="vertical" onFinish={hacerReclamo}>
                <Form.Item name="tipo" label="Calificación:" rules={[{ required: true, message: "La puntuacion es obligatoria." }]}>
                    <Rate allowHalf defaultValue={2.5} value={datosCalificacion.puntuacion} onChange={(value) => setDatosCalificacion({ ...datosCalificacion, "puntuacion": value })} />
                    <Input></Input>
                </Form.Item >

                <Form.Item name="desc" label="Descripción:">
                    <Input.TextArea showCount maxLength={255} onChange={(e) => setDatosCalificacion({ ...datosCalificacion, "comentario": e.target.value })} />
                </Form.Item>

                <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <Space size={50}>
                        <Button htmlType="button" onClick={hideModal} style={{ width: "130px" }}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ width: "130px" }}>
                            Enviar calificación
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Calificar;