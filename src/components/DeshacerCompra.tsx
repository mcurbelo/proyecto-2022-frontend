import { Card, Descriptions, Divider, Form, Input, Modal, Row, Space, Tooltip } from "antd"
import { useState } from "react";
import { AdministradorService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faClipboardList, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoCompra } from "shopit-shared/dist/user/AdministradorService";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { EstadoCompra } from "shopit-shared/dist/user/VendedorService";

export const DeshacerCompra = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");
    const [idCompra, setCategoria] = useState("");
    const [isLoading, setLoading] = useState(false)
    const [datosCompra, setDatosCompra] = useState<InfoCompra>();
    const [mostrar, setMostrar] = useState(false);
    const onFinish = () => {
        setLoading(true);
        AdministradorService.infoCompraDeshacer(token!, idCompra).then((response) => {
            if (response.idCompra) {
                setDatosCompra(response);
                setMostrar(true);
            }
            else {
                alert(response)
            }
            setLoading(false);
        })
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoria(e.target.value);
    };


    const disableButton = () => {
        const buttonCancel = document.getElementById("cancelButton")
        buttonCancel?.setAttribute("disabled", "true");
    }
    
    const deshacerVenta = () => {
        Modal.confirm({
            title: '¿Seguro desea deshacer esta compra/venta?',
            icon: <ExclamationCircleOutlined />,
            content: 'Se devolverá el dinero, tanto al comprador como al vendedor. Además de enviarle una notificación.',
            okText: 'Confirmar',
            cancelButtonProps: { disabled: isLoading, id: "cancelButton" },
            cancelText: 'Cancelar',
            onOk() {
                disableButton()
                return AdministradorService.deshacerCompra(token!, idCompra).then((result) => {
                    if (result == "200") {
                        Modal.success({
                            title:"Acción exitosa",
                            content: 'Compra/venta reembolsada con éxito',
                        });
                        navigate("/");
                    } else {
                        Modal.error({
                            title: 'Error',
                            content: result,
                        });
                    }
                })
            },
            onCancel() { },
        });
    }

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            paddingBottom: "10%"
        }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "25%" }} >
                <h1 style={{ textAlign: "center" }}>Deshacer compra/venta</h1>
                <Row justify="center" style={{ width: "100%" }}>
                    <Card style={{ width: "100%" }}>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item
                                label="Identificador de la compra:"
                                name="idCompra"
                                rules={[{ required: true, message: 'Por favor ingrese un identifcador valído.', pattern: new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) }]}
                            >
                                <Input onChange={onChange} />
                            </Form.Item>

                            <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                                <Space size={50}>
                                    <Button type="primary" htmlType="submit" loading={isLoading}  >
                                        Ver información<FontAwesomeIcon style={{ display: "inline-block", marginLeft: "10px" }} icon={faClipboardList} />
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Row>
            </div>
            {mostrar &&
                <Row style={{ marginTop: "20px" }}>
                    <Card>
                        <Descriptions title="Información de la compra/venta" bordered column={2}>
                            <Descriptions.Item label="ID">{datosCompra?.idCompra}</Descriptions.Item>
                            <Descriptions.Item label="Comprador">{datosCompra?.nombreComprador}</Descriptions.Item>
                            <Descriptions.Item label="Vendedor">{datosCompra?.nombreVendedor}</Descriptions.Item>
                            <Descriptions.Item label="Producto">{datosCompra?.nombreProducto}</Descriptions.Item>
                            <Descriptions.Item label="Precio unitario">$ {datosCompra?.montoUnitario}</Descriptions.Item>
                            <Descriptions.Item label="Cantidad">{datosCompra?.cantidad}</Descriptions.Item>
                            <Descriptions.Item label="Precio total">$ {datosCompra?.montoTotal}</Descriptions.Item>
                            <Descriptions.Item label="Fecha realización">{datosCompra?.fecha}</Descriptions.Item>
                            <Descriptions.Item label="Estado">{datosCompra?.estadoCompra}</Descriptions.Item>
                            <Descriptions.Item label="Es envío">{(datosCompra?.esEnvio) ? "Sí" : "No"}</Descriptions.Item>
                            <Descriptions.Item label="Fecha entrega">{datosCompra?.fechaEntrega}</Descriptions.Item>
                            <Descriptions.Item label="Dirección de entrega">{datosCompra?.direccionEntrega}</Descriptions.Item>
                            <Descriptions.Item label="Garantía activa">{(datosCompra?.garantiaActiva) ? "Sí" : "No"}</Descriptions.Item>
                            <Descriptions.Item label="Reclamo no resuelto">{(datosCompra?.tieneReclamoNoResuelto) ? "Sí" : "No"}</Descriptions.Item>
                        </Descriptions>
                        <Divider></Divider>
                        <Row justify="center" >
                            <Button type="warning" disabled={!datosCompra?.tieneReclamoNoResuelto || datosCompra.estadoCompra === EstadoCompra.Cancelada || datosCompra.estadoCompra === EstadoCompra.Devolucion}
                                onClick={deshacerVenta}>Deshacer compra/venta<FontAwesomeIcon style={{ display: "inline-block", marginLeft: "10px" }} icon={faRotateLeft}/></Button>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Tooltip title="Solo se puede realizar esta acción cuando haya un reclamo no resuelto. Y la compra no haya sido cancelada o tenido una devolución"> <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faCircleQuestion} /> </Tooltip>
                            </div>
                        </Row>
                    </Card>
                </Row>
            }
        </div>
    )
}