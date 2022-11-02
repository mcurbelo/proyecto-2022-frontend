import { Button, Form, FormInstance, Input, Modal, Rate, Select, Space } from "antd"
import React, { useState } from "react";
import { CompartidoUsuario } from "shopit-shared";
import { DtCalificacion } from "shopit-shared/dist/user/CompartidoUsuarios";

const { Option } = Select;

type reclamoProps = {
    idCompra: string,
    showModal: () => void,
    nombreUsuario: string
    califico: () => void
}

export const Calificar = (props: reclamoProps) => {
    const id = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const { idCompra, showModal, nombreUsuario, califico } = props
    const [open, setOpen] = useState(true);
    const [datosCalificacion, setDatosCalificacion] = useState<DtCalificacion>({
        puntuacion: 0,
        comentario: "",
        autor: id!,
    });
    const [isLoading, setLoading] = useState(false);

    const hideModal = () => {
        setOpen(false);
    };

    const hacerCalificacion = () => {
        setLoading(true)
        CompartidoUsuario.calificar(idCompra, token!, datosCalificacion).then((result) => {
            if (result == "200") {
                califico()
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
            setLoading(false)
            showModal()
        })

    }


    const formRef = React.createRef<FormInstance>();
    return (
        <Modal title={"Calificando a " + nombreUsuario} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
            <Form ref={formRef} name="control-ref" layout="vertical" onFinish={hacerCalificacion}>
                <Form.Item name="tipo" label={"Calificación: " + datosCalificacion.puntuacion + "/5"} rules={[{ required: true, message: "La puntuación es obligatoria." }]}>
                    <Rate allowHalf value={datosCalificacion.puntuacion} onChange={(value) => setDatosCalificacion({ ...datosCalificacion, "puntuacion": value })} />
                </Form.Item >

                <Form.Item name="desc" label="Descripción:">
                    <Input.TextArea showCount maxLength={255} onChange={(e) => setDatosCalificacion({ ...datosCalificacion, "comentario": e.target.value })} />
                </Form.Item>

                <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <Space size={50}>
                        <Button htmlType="button" onClick={hideModal} style={{ width: "150px" }}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: "150px" }}>
                            Enviar calificación
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Calificar;