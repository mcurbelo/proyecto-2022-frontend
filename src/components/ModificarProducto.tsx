import { Checkbox, Col, Collapse, Form, Image, Input, InputNumber, List, Modal, Row, Tooltip, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { VendedorService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { DtMiProducto, DtModificarProducto } from "shopit-shared/dist/user/VendedorService";
import DatePicker, { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faArrowUpFromBracket, faFloppyDisk, faRightLong, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { createUseStyles } from "react-jss";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { RcFile } from "antd/lib/upload";
import { CheckboxChangeEvent } from "antd/lib/checkbox";



const useStyles = createUseStyles({
    "@global": {
        ".ant-upload-list ant-upload-list-text": {
            width: "200px"
        },
        ".ant-upload-list-text-container": {
            width: "200px"
        },
    },

    container: {

    },

    containerFixedBotton: {

    },

    imagenesContainer: {
        height: "150px",
        width: "150px"
    },

    '@media screen and (max-width: 992px)': {
        container: {
            width: "100% !important"
        },
        containerFixedBotton: {
            justifyContent: "center !important"
        },
        imagenesContainer: {
            height: "100px",
            width: "100px"
        },

    }
})

const { confirm } = Modal;

export const ModificarProducto = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { productoInfo } = state;
    const [form] = Form.useForm();
    const id: string = (localStorage.getItem("uuid") as string);
    const token: string = (localStorage.getItem("token") as string);
    const [producto, setProducto] = useState(productoInfo as DtMiProducto);
    const [datosModificar, setDatosModificar] = useState<DtModificarProducto>({
        descripcion: undefined,
        fechaFin: undefined,
        imagenesQuitar: [],
        precio: undefined,
        stock: undefined,
        permiteEnvio: undefined
    })
    const [imagenesMax, setImangenesMax] = useState<Array<string>>([])
    const [fileList, setFileList] = useState<Array<RcFile | null>>([]);
    const [iguales, setIguales] = useState(true)
    const [imagenesAux, setImagenAux] = useState(producto.imagenes)
    const [key, setKey] = useState(0);

    // eslint-disable-next-line arrow-body-style
    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    };


    useEffect(() => {
        form.resetFields()
    }, [producto]);

    useEffect(() => {
        let defaultImg = [] as (RcFile | null)[]
        producto.imagenes.map((value, index) => {
            defaultImg[index] = null
        })
        setFileList(defaultImg);
        let imagenesMax = ["", "", "", "", ""];
        producto.imagenes.map((value, index) => {
            imagenesMax[index] = producto.imagenes[index];
        })
        setImangenesMax(imagenesMax)
        form.resetFields()
    }, [key]);


    const disableButton = () => {
        const buttonCancel = document.getElementById("cancelButton")
        buttonCancel?.setAttribute("disabled", "true");
    }

    const modificarProducto = () => {
        confirm({
            title: 'Realmente desea guardar los cambios?',
            icon: <ExclamationCircleOutlined />,
            content: 'Los cambios serán permanentes una vez confirmados.',
            cancelText: "Cancelar",
            cancelButtonProps: { id: "cancelButton" },
            onOk() {
                disableButton();
                let productoInfoNuevo = producto;
                let imagenesEnviar = new Array<File>();
                let imagenesNuevas = new Array<string>();
                Array.from(Object.values(fileList)).map((value, index) => {
                    if (value !== null) {
                        imagenesEnviar[index] = value;
                        imagenesNuevas[index] = URL.createObjectURL(new File([value], "imagen" + index))
                    } else {
                        imagenesEnviar[index] = new File([""], "");
                        imagenesNuevas[index] = producto.imagenes[index];
                    }
                })
                return VendedorService.modificarProducto(id, token, producto.idProducto!, datosModificar, imagenesEnviar!).then((response) => {
                    if (response.success) {
                        Modal.success({
                            title: "Edición completada con éxito",
                            content: 'Sus datos se han actualizado exitosamente.',
                        });
                        productoInfoNuevo["descripcion"] = (datosModificar.descripcion) ? datosModificar.descripcion : productoInfoNuevo.descripcion
                        productoInfoNuevo["fechaFin"] = (datosModificar.fechaFin) ? datosModificar.fechaFin : productoInfoNuevo.fechaFin
                        productoInfoNuevo["stock"] = (datosModificar.stock) ? datosModificar.stock : productoInfoNuevo.stock
                        productoInfoNuevo["precio"] = (datosModificar.precio) ? datosModificar.precio : productoInfoNuevo.precio
                        productoInfoNuevo["imagenes"] = imagenesNuevas;
                        productoInfoNuevo["permiteEnvio"] = (datosModificar.permiteEnvio) ? datosModificar.permiteEnvio : productoInfoNuevo.permiteEnvio
                        navigate('/modificarProducto', { state: { productoInfo: productoInfoNuevo } })
                        navigate("/misProductos");
                    }
                    else {
                        Modal.error({
                            title: 'Error',
                            content: response.message,
                        });
                    }

                })
            },
            onCancel() {

            },
        });



    }

    const onRemove = (file: RcFile, esBase: boolean, index?: number) => {
        if (!esBase) {
            const newFileList = Array.from(Object.values(fileList));
            const indice = newFileList.indexOf(file);
            newFileList.splice(indice, 1)
            setFileList(newFileList);
        }
        else {
            setFileList({ ...fileList, [index!]: null });
        }
    }

    const beforeUpload = (file: RcFile, index?: number) => {
        if (index != undefined) {
            setFileList({ ...fileList, [index]: file });
        }
        else {
            setFileList({ ...fileList, [Object.keys(fileList).length]: file });
        }
        return false;
    }

    const eliminar = (index: number) => {

        confirm({
            title: 'Realmente quiere eliminar esta imagen?',
            icon: <ExclamationCircleOutlined />,
            content: 'Solo se podrá recuperar restableciendo los datos.',
            cancelText: "Cancelar",
            onOk() {
                const url = imagenesAux[index]

                const imagesSinEliminar = (imagenesAux).slice();
                imagesSinEliminar.splice(index, 1);
                setImagenAux(imagesSinEliminar);

                const newFileList = Array.from(Object.values(fileList));
                newFileList.splice(index, 1);
                setFileList(newFileList);

                let imagesEliminar = Array.from(datosModificar.imagenesQuitar!).slice();
                imagesEliminar.push(index)
                setDatosModificar({ ...datosModificar, imagenesQuitar: imagesEliminar });
            },
            onCancel() {

            }
        })
    }

    const hayModificacionDeImagen = () => {
        const imagenes = Array.from(Object.values(fileList)).slice()
        let retorno = false;
        imagenes.forEach((value, index) => {
            if (imagenes[index] !== null) {
                retorno = true;
                return;
            }
        })
        return retorno;
    }

    const igualesFuncion = () => {
        if ((datosModificar.descripcion != undefined && datosModificar.descripcion !== producto.descripcion) ||
            (datosModificar.stock != undefined && datosModificar.stock !== producto.stock) ||
            (datosModificar.fechaFin != undefined && datosModificar.fechaFin !== producto.fechaFin) ||
            (datosModificar.precio != undefined && datosModificar.precio !== producto.precio) ||
            (datosModificar.imagenesQuitar!.length > 0) ||
            (Object.keys(fileList).length !== imagenesAux.length) ||
            (Array.from(Object.values(fileList)).indexOf(null) == -1) ||
            (datosModificar.permiteEnvio != undefined && datosModificar.permiteEnvio !== producto.permiteEnvio) ||
            hayModificacionDeImagen())
            return false;
        return true
    }

    useEffect(() => { setIguales(igualesFuncion()) }, [datosModificar, fileList]);


    const restablecer = () => {
        confirm({
            title: 'Realmente quiere restablecer los datos a los originales?',
            icon: <ExclamationCircleOutlined />,
            content: 'Se perderán todos los cambios.',
            cancelText: "Cancelar",
            onOk() {
                setDatosModificar({
                    descripcion: producto.descripcion,
                    stock: producto.stock,
                    precio: producto.precio,
                    fechaFin: producto.fechaFin,
                    imagenesQuitar: []
                });
                let defaultImg = new Array<RcFile | null>();
                producto.imagenes.map((value, index) => {
                    defaultImg[index] = null;
                })
                setImagenAux(producto.imagenes);
                setFileList(defaultImg);
                let keyNueva = key;
                setKey(keyNueva + 1);
            },
            onCancel() {

            },
        });

    }
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDatosModificar({ ...datosModificar, "fechaFin": dateString })
    };

    const onChangeCheck = (e: CheckboxChangeEvent) => {
        setDatosModificar({ ...datosModificar, permiteEnvio: (e.target.checked === producto.permiteEnvio) ? undefined : e.target.checked })
    };

    const { Text } = Typography;
    const { Panel } = Collapse;

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <h1>Modificación de producto</h1>
            </div >
            <Row justify="center" >
                <div className={styles.container} style={{ width: "60%", display: "flex", justifyContent: "end", paddingBottom: "1%" }}>
                    <Button type="primary" onClick={restablecer} disabled={iguales}>Restablecer <FontAwesomeIcon icon={faRotateRight} style={{ marginLeft: "5px" }} /></Button>
                </div>
            </Row>

            <Row justify="center" style={{ paddingBottom: "15%" }}>
                <Collapse className={styles.container} defaultActiveKey={['1']} style={{ width: "60%" }}>
                    <Panel header="Información" key="1" >
                        <Row justify="center">
                            <Form
                                name="basic"
                                className={styles.container}
                                form={form}
                                initialValues={{
                                    descripcion: producto?.descripcion,
                                    precio: producto?.precio, stock: producto?.stock,
                                    fechaFin: (producto.fechaFin) ? moment(producto.fechaFin, "DD/MM/YYYY") : "",
                                    permiteEnvio: producto.permiteEnvio
                                }}
                                style={{ width: "60%" }}
                                onFinish={modificarProducto}
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Descripción: "
                                    name="descripcion"
                                    rules={[{ required: true, message: 'La descripción no puede ser vacía' }]}
                                >
                                    <Input.TextArea showCount maxLength={255} onChange={(e) => { setDatosModificar({ ...datosModificar, "descripcion": e.target.value }); }} />
                                </Form.Item>

                                <Form.Item
                                    label="Fecha fin publicación:"
                                    name="fechaFin">
                                    <DatePicker placeholder="Seleccione una fecha de fin" disabledDate={disabledDate} style={{ width: "100%" }} format="DD/MM/YYYY" onChange={onChange} />
                                </Form.Item>
                                <Row justify="space-between">
                                    <div style={{ width: "45%" }}>
                                        <Form.Item
                                            label="Precio ($):"
                                            name="precio"
                                            rules={[{ required: true, message: 'El precio no puede ser vacío' }]}
                                        >
                                            <InputNumber style={{ width: "100%" }} type="number" min={1} onChange={(value) => { setDatosModificar({ ...datosModificar, "precio": value! }); }} />
                                        </Form.Item>
                                    </div>
                                    <div style={{ width: "45%" }}>
                                        <Form.Item
                                            label="Stock:"
                                            name="stock"
                                            rules={[{ required: true, message: 'El stock no puede ser vacío' }]}
                                        >
                                            <InputNumber style={{ width: "100%" }} type="number" min={0} onChange={(value) => setDatosModificar({ ...datosModificar, "stock": value! })} />
                                        </Form.Item>
                                    </div>
                                </Row>

                                <Form.Item
                                    name="permiteEnvio"
                                    valuePropName="checked"
                                >
                                    <Checkbox onChange={onChangeCheck} > Permite envío </Checkbox>
                                </Form.Item>

                            </Form>
                        </Row>
                    </Panel>
                    <Panel header={<span>Imágenes actuales<Tooltip title="Son las imágenes que ya tiene el producto, estas se puede cambiar o quitar (siempre y cuando haya al menos una).">
                        <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>
                    } key="2">
                        <Row justify="center">
                            <Col className={styles.container} style={{ width: "60%" }}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={imagenesAux}
                                    renderItem={(item, index) => (
                                        <List.Item style={{ display: "flex", justifyContent: "center" }}>
                                            <div style={{ width: "80%" }}>
                                                <h4 style={{ textAlign: "center" }}>Imagen {index + 1}</h4>
                                                {

                                                    (item !== "") &&
                                                    <>
                                                        <Row justify="space-around" >
                                                            <Col>
                                                                <Image src={item} className={styles.imagenesContainer} />
                                                            </Col>
                                                            {fileList[index] !== null &&
                                                                <>
                                                                    <Col style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                                                                        <FontAwesomeIcon size="2x" color="black" icon={faRightLong} style={{ padding: "20px" }} />
                                                                    </Col>

                                                                    <Col>
                                                                        <Image className={styles.imagenesContainer} alt="Sin imagen" src={URL.createObjectURL(new File([fileList[index]!], "imagen"))} />
                                                                    </Col>
                                                                </>
                                                            }
                                                        </Row>
                                                        <Row justify="space-around" style={{ alignItems: "flex-start", width: "100%", marginTop: "3%", rowGap: 20 }}>
                                                            <Upload onRemove={(file) => onRemove(file.originFileObj!, true, index)} maxCount={1} beforeUpload={(file) => beforeUpload(file, index)} accept="image/png, image/jpeg">
                                                                <Button type="info" with="dashed" style={{ width: "200px" }} >Cambiar imagen <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ marginLeft: "5px" }} /></Button>
                                                            </Upload>
                                                            {fileList[index] === null &&
                                                                <div>
                                                                    <Button type="danger" disabled={imagenesAux.length === 1} style={{ width: "200px" }} onClick={() => eliminar(index)}>Quitar <FontAwesomeIcon icon={faTrashCan} style={{ marginLeft: "5px" }} /></Button>
                                                                </div>
                                                            }
                                                        </Row>
                                                    </>
                                                }


                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Col>
                        </Row>
                    </Panel>
                    <Panel header={<span>Agregar nuevas imágenes <Tooltip title="Agregar imágenes en el orden deseado de aparición. En total pueden haber 5 imagenes."><FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} />  </Tooltip></span>} key="3">
                        <div style={{ width: "100%" }}>
                            <List
                                grid={{
                                    xs: 3,
                                    sm: 4,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 4,
                                }}
                                dataSource={["", "", "", ""]}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        {fileList[index + producto.imagenes.length] &&
                                            <div>
                                                <Image className={styles.imagenesContainer} alt="Sin imagen" src={URL.createObjectURL(new File([fileList[index + producto.imagenes.length]!], "imagen"))} />
                                            </div>
                                        }
                                    </List.Item>

                                )}
                            />

                            <Row justify="center" style={{ alignItems: "center", width: "100%" }}>

                                <Row justify="center" style={{ alignItems: "center", width: "100%" }}>
                                    <Upload key={key} onRemove={(file) => onRemove(file.originFileObj!, false)} beforeUpload={(file) => beforeUpload(file, undefined)} maxCount={5 - imagenesAux.length} accept="image/png, image/jpeg">
                                        <Button type="dashed" disabled={Object.keys(fileList).length === 5} style={{ width: "200px" }}>Seleccione una imágen <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ marginLeft: "5px" }} /></Button>
                                    </Upload>
                                </Row>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
                <div className={styles.containerFixedBotton} style={{ position: "fixed", bottom: "0", width: "59.9%", display: "flex", justifyContent: "end", paddingBottom: "1%", paddingRight: "0.5%" }}>

                    <Button type="success" size="large" disabled={iguales} htmlType="submit" onClick={() => form.submit()}>
                        Terminar edición <FontAwesomeIcon icon={faFloppyDisk} style={{ marginLeft: "5px" }} />
                    </Button>
                </div>
            </Row>
        </div >

    )

}