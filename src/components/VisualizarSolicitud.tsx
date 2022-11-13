import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Form, Image, Input, List, Modal, Row, Space, Tabs, Typography } from "antd"
import Button from "antd-button-color";
import { useState } from "react";
import { DtSolicitudPendiente } from "shopit-shared/dist/user/VendedorService";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AdministradorService } from "shopit-shared";
import imagenPH from "../images/imagenPH.png"


type solcitudProps = {
    solicitud: DtSolicitudPendiente,
    showModal: () => void,
    quitar: () => void,
}

const { confirm } = Modal;

export const Solicitud = (props: solcitudProps) => {
    const token = localStorage.getItem("token");
    const { solicitud, showModal, quitar } = props
    const { producto } = solicitud;
    const [open, setOpen] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const hideModal = () => {
        setOpen(false);
    };
    const [visible, setVisible] = useState(false);
    const [motivo, setMotivo] = useState<string>()

    const { Paragraph, Text } = Typography;
    const [form] = Form.useForm();

    const informacionVendedor = () => {
        return (
            <div>
                {
                    (!solicitud.nombreEmpresa) && <Space direction="vertical">
                        <div style={{ display: "inline-block" }}>
                            <Text strong>Tipo de vendedor:</Text> <Text>Independiente</Text>
                        </div>

                        <div style={{ display: "inline-block" }}>
                            <Text>Dirección de local:</Text> <Text>{solicitud.direccionLocal}</Text>
                        </div>
                    </Space>
                }
                {
                    (solicitud.nombreEmpresa) &&
                    <>
                        <div style={{ display: "inline-block" }}>
                            <Text strong >Tipo de vendedor:</Text> <Text>Empresa</Text>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "inline-block" }}>
                            <Text strong >Nombre empresa:</Text> <Text>{solicitud.nombreEmpresa}</Text>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "inline-block" }}>
                            <Text strong>Teléfono:</Text> <Text>{solicitud.telefonoEmpresa}</Text>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "inline-block" }}>
                            <Text strong>RUT:</Text> <Text>{solicitud.rut}</Text>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "inline-block" }}>
                            <Text strong>Dirección de local:</Text> <Text>{solicitud.direccionLocal}</Text>
                        </div>
                    </>
                }
            </div>
        )
    }



    const informacionProducto = () => {
        return (
            <div>
                <Row>
                    <Space direction="vertical">
                        <Text strong>Imágenes:</Text> <Text></Text>
                        <List
                            grid={{ column: 5 }}
                            dataSource={producto.imagenes}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <div>
                                        <Image height={"80%"} width={"80%"} src={item} placeholder={
                                            <Image
                                                preview={false}
                                                src={imagenPH}
                                                width={70}
                                            />
                                        } />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Space>
                </Row>

                <Row>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Paragraph style={{ textAlign: "justify", textJustify: "inter-word", margin: 0 }}><Text strong>Nombre: </Text>{producto.nombre}</Paragraph>
                    </div>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Paragraph style={{ textAlign: "justify", textJustify: "inter-word", margin: 0 }}><Text strong>Descripción: </Text>{producto.descripcion}</Paragraph>
                    </div>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Text strong>Catégorias:</Text> <Text>{producto.categorias.join(", ")}</Text>
                    </div>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Text strong>Precio:</Text> <Text>${producto.precio}</Text>
                    </div>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Text strong>Stock:</Text> <Text>{(producto.stock > 1) ? producto.stock + " unidades" : producto.stock + " unidad"}</Text>
                    </div>
                    <Divider></Divider>
                    <div style={{ display: "inline-block" }}>
                        <Text strong>Garantía:</Text> <Text>{producto.garantia} {producto.garantia > 1 ? "días" : "día"}</Text>
                    </div>

                </Row>
            </div>
        )
    }

    const disableButton = () => {
        const buttonCancel = document.getElementById("cancelButton")
        buttonCancel?.setAttribute("disabled", "true");
    }

    const revisarSolicitud = (esAceptar: boolean) => {
        let xd = false
        if (esAceptar) {
            confirm({
                title: 'Esta seguro que desea aceptar esta solicitud?',
                icon: <ExclamationCircleOutlined />,
                content: 'Al aceptar el usuario será notificado y tendrá todos los beneficios de ser vendedor.',
                cancelText: "Cancelar",
                cancelButtonProps: { disabled: isLoading, id: "cancelButton" },
                onOk() {
                    disableButton()
                    setLoading(true)
                    return AdministradorService.revisarSolicitudNuevoVendedor(solicitud.idSolicitante, token!, true).then((result) => {
                        if (result == "200") {

                            Modal.success({
                                title: "Solicitud aceptada con éxito",
                                content: "Se ha actualizado el estado de la solicitud y notificado al usuario exitosamente.",
                            });
                            setLoading(false)
                            quitar()
                            showModal()
                        } else {
                            const mensaje = result;
                            Modal.error({
                                title: 'Ha ocurrido un error inesperado',
                                content: mensaje
                            });
                        }
                    })

                },
                onCancel() {
                }
            })
        }
        else {
            setLoading(true)
            AdministradorService.revisarSolicitudNuevoVendedor(solicitud.idSolicitante, token!, false, { motivo: motivo! }).then((result) => {
                if (result == "200") {
                    Modal.success({
                        title: "Solicitud rechazada con éxito",
                        content: "Se ha actualizado el estado de la solicitud y notificado al usuario el motivo exitosamente.",
                    });
                    setLoading(false)
                    quitar()
                    showModal()
                } else {
                    const mensaje = result;
                    Modal.error({
                        title: 'Ha ocurrido un error inesperado',
                        content: mensaje
                    });
                }
            })
        }
    }

    return (
        <>
            <Modal title={"Solicitud de " + solicitud.nombreApellido} bodyStyle={{ paddingTop: 0 }} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: `Información adiccional de vendedor`,
                            key: '1',
                            children: (informacionVendedor()),
                        },
                        {
                            label: `Publicación de producto`,
                            key: '2',
                            children: (informacionProducto()),
                        },

                    ]}
                />
                <Divider></Divider>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <Space size={50}>
                        <div style={{ display: "flex", alignItems: "center" }}>

                            <Button style={{ width: "170px", textShadow: "0 0 2px black" }}
                                type="success" onClick={() => { revisarSolicitud(true) }}> <b>Aceptar</b> <FontAwesomeIcon icon={faCircleCheck} style={{ display: "inline-block", marginLeft: "10px" }} />
                            </Button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>

                            <Button style={{ width: "170px", textShadow: "0 0 2px black" }}
                                type="danger" onClick={() => { setVisible(true); setLoading(false) }}> <b>Rechazar</b> <FontAwesomeIcon icon={faCircleXmark} style={{ display: "inline-block", marginLeft: "10px" }} />
                            </Button>
                        </div>
                    </Space>
                </div>
            </Modal>

            <Modal open={visible} title={<><ExclamationCircleOutlined style={{ color: "#faad14" }} /><Text> Está seguro que desea rechazar esta solicitud?</Text></>} onOk={form.submit}
                cancelText="Cancelar" onCancel={() => { setVisible(false); form.resetFields(); }} cancelButtonProps={{ disabled: isLoading }} okButtonProps={{ loading: isLoading }} afterClose={() => setLoading(false)}>
                <Text>Al rechazar el usuario será notificado y <b>NO</b> tendrá los beneficios de vendedor.</Text>
                <Divider></Divider>
                <Form form={form} name="control-ref" layout="vertical" onFinish={() => { revisarSolicitud(false) }}>
                    <Form.Item name="desc" label="Motivo:" rules={[{ required: true, message: "El motivo es obligatorio." }]}>
                        <Input.TextArea showCount maxLength={255} onChange={(e) => setMotivo(e.target.value)} />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default Solicitud;