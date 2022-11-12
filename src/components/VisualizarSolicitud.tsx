import { FormInstance, Image, List, Modal, Row, Select, Tabs, Typography } from "antd"
import React, { useState } from "react";
import { DtSolicitudPendiente } from "shopit-shared/dist/user/VendedorService";

const { Option } = Select;

type solcitudProps = {
    solicitud: DtSolicitudPendiente,
    showModal: () => void,
    acepto?: () => void,
}



export const Solicitud = (props: solcitudProps) => {
    const token = localStorage.getItem("token");
    const { solicitud, showModal, acepto } = props
    const { producto } = solicitud;
    const [open, setOpen] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const hideModal = () => {
        setOpen(false);
    };

    const { Text, Link } = Typography;

    const formRef = React.createRef<FormInstance>();

    const informacionVendedor = () => {
        return (
            <div>
                {
                    (!solicitud.nombreEmpresa) && <Row justify="center">
                        <Text>Tipo de vendedor: <b>Independiente.</b></Text>
                        <Text>Dirección de local: <b>{solicitud.direccionLocal}</b></Text>
                    </Row>
                }
                {
                    (solicitud.nombreEmpresa) && <Row justify="center">
                        <Text>Tipo de vendedor: <b>Empresa.</b></Text>
                        <Text>Teléfono: <b>{solicitud.telefonoEmpresa}</b></Text>
                        <Text>RUT: <b>{solicitud.rut}</b></Text>
                        <Text>Dirección de local: <b>{solicitud.direccionLocal}</b></Text>
                    </Row>
                }
            </div>
        )
    }



    const infromacionProducto = () => {
        return (
            <Row>
                <div>
                    <List
                        grid={{ column: 5 }}
                        dataSource={producto.imagenes}
                        renderItem={(item, index) => (
                            <List.Item>
                                <div>
                                    <Image height={150} width={150} src={item} />
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
                <Row>
                    <Text>Nombre: {producto.nombre}</Text>
                    <Text>Descripción: {producto.descripcion}</Text>
                    <Text>Catégorias: {producto.categorias.join(" ")}</Text>
                    <Text>Precio: ${producto.precio}</Text>
                    <Text>Stock: {producto.stock}</Text>
                </Row>
            </Row>
        )
    }

    return (
        <Modal title={"Solicitud de " + solicitud.nombreApellido} open={open} onCancel={() => { showModal() }} footer={null} afterClose={() => { showModal() }}>
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
                        children: (infromacionProducto()),
                    },

                ]}
            />
        </Modal>
    )
}

export default Solicitud;