import { Card, Form, Input, Modal, Row } from "antd"
import { useState } from "react";
import { AdministradorService, CategoriaService } from "shopit-shared";


export const NuevaCategoria = () => {
    const token = localStorage.getItem("token");
    const [categoria, setCategoria] = useState("");

    const onFinish = () => {
        CategoriaService.agregarCategoria({ nombre: categoria }, token!).then((respose) => {
            if (respose.success) {
                Modal.success({
                    content: 'Categoría creada con éxito.',
                });
            } else {
                Modal.error({
                    title: 'Error',
                    content: respose.message,
                });
            }
        })
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoria(e.target.value);
    };
    return (
        <div>
            <h1>Nueva categoría</h1>
            <Row justify="center">
                <Card>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Nombre de la categoría:"
                            name="categoria"
                            rules={[{ required: true, message: 'Por favor ingrese un nombre categoría' }]}
                        >
                            <Input onChange={onChange} />
                        </Form.Item>
                    </Form>
                </Card>
            </Row>

        </div>
    )
}