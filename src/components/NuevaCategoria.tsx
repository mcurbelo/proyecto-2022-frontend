import { Card, Form, Input, Modal, Row, Space } from "antd"
import { useState } from "react";
import { CategoriaService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NuevaCategoria = () => {
    const token = localStorage.getItem("token");
    const [categoria, setCategoria] = useState("");
    const [isLoading, setLoading] = useState(false)

    const onFinish = () => {
        setLoading(true);
        CategoriaService.agregarCategoria({ nombre: categoria }, token!).then((respose) => {
            if (respose.success) {
                Modal.success({
                    content: 'Categoría creada con éxito.',
                    afterClose: () => window.location.href = "/",
                });

            } else {
                Modal.error({
                    title: 'Error',
                    content: respose.message + ".",
                });
            }
            setLoading(false);
        })
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoria(e.target.value);
    };

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{
            height: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "25%" }} >
                <h1 style={{ textAlign: "center" }}>Crear nueva categoría</h1>
                <Row justify="center" style={{ width: "100%" }}>
                    <Card style={{ width: "100%" }}>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Nombre de la categoría:"
                                name="categoria"
                                rules={[{ required: true, message: 'Por favor ingrese un nombre categoría' }]}
                            >
                                <Input onChange={onChange} />
                            </Form.Item>

                            <Form.Item style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                                <Space size={50}>
                                    <Button type="success" htmlType="submit" loading={isLoading} >
                                        Agregar categoría<FontAwesomeIcon style={{ display: "inline-block", marginLeft: "10px" }} icon={faCircleCheck} />
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Row>
            </div>
        </div>
    )
}