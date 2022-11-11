import { Card, Col, Divider, Form, Image, Input, InputNumber, List, Modal, Row, Tooltip, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { VendedorService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { DtMiProducto, DtModificarProducto } from "shopit-shared/dist/user/VendedorService";
import DatePicker, { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faArrowUpFromBracket, faFloppyDisk, faRightLong, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { createUseStyles } from "react-jss";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { RcFile } from "antd/lib/upload";


const useStyles = createUseStyles({
    "@global": {
        ".ant-upload-list ant-upload-list-text": {
            width: "200px"
        },
        ".ant-upload-list-text-container": {
            width: "200px"
        },
    },
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
        stock: undefined
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
        if (!productoInfo) {
            console.log("hola");
        }

        form.resetFields()
    }, [producto]);


    useEffect(() => {
        let defaultImg = [] as (RcFile | null)[]
        producto.imagenes.map((value, index) => {
            setFileList({ ...fileList, [index]: null });
            defaultImg[index] = null
        })

        let imagenesMax = ["", "", "", "", ""];
        producto.imagenes.map((value, index) => {
            imagenesMax[index] = producto.imagenes[index];
        })
        let p = [] as (number | string)[]
        producto.imagenes.map((value, index) => {
            p[index] = index
        })
        setImangenesMax(imagenesMax)
        form.resetFields()
    }, [key]);


    const modificarProducto = () => {
        confirm({
            title: 'Realmente desea guardar los cambios?',
            icon: <ExclamationCircleOutlined />,
            content: 'Los cambios serán permanentes una vez confirmados.',
            cancelText: "Cancelar",
            onOk() {
                let imagenesEnviar = new Array<File>();
                Array.from(Object.values(fileList)).map((value, index) => {
                    if (value !== null)
                        imagenesEnviar[index] = value;
                    else
                        imagenesEnviar[index] = new File([""], "");
                })

                return VendedorService.modificarProducto(id, token, producto.idProducto!, datosModificar, imagenesEnviar!).then((response) => {
                    if (response.success) {
                        Modal.success({
                            title: "Edición completada con éxito",
                            content: 'Sus datos se han actualizado exitosamente',
                        });
                        window.history.replaceState({}, document.title)
                        //navigate("/misProductos");
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
                imagesEliminar.push(url)
                setDatosModificar({ ...datosModificar, imagenesQuitar: imagesEliminar });
            },
            onCancel() {

            }
        })
    }

    const igualesFuncion = () => {
        if ((datosModificar.descripcion != undefined && datosModificar.descripcion !== producto.descripcion) ||
            (datosModificar.stock != undefined && datosModificar.stock !== producto.stock) ||
            (datosModificar.fechaFin != undefined && datosModificar.fechaFin !== producto.fechaFin) ||
            (datosModificar.precio != undefined && datosModificar.precio !== producto.precio) ||
            (datosModificar.imagenesQuitar!.length > 0) ||
            (Object.keys(fileList).length !== imagenesAux.length) ||
            (Array.from(Object.values(fileList)).indexOf(null) == -1))
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

    const { Text, Link } = Typography;

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div>
            <div style={{ textAlign: "center" }}>

                <h1>Modificación de producto</h1>
            </div>
            <Row justify="center">
                <Card style={{ width: "70%" }} title="Datos editables" extra={<Button type="primary" onClick={restablecer} disabled={iguales}>Restablecer <FontAwesomeIcon icon={faRotateRight} style={{ marginLeft: "5px" }} /></Button>}>

                    <Row>
                        <div>
                            <Text>{producto.nombre} | Fecha de ingreso: {producto.fechaInicio}</Text>
                        </div>

                    </Row>
                    <Divider></Divider>
                    <Row justify="space-between">
                        <Col style={{ width: "60%" }}>
                            <h2>Imágenes actuales <Tooltip title="Son las imágenes que ya tiene el producto, estas se puede cambiar o quitar (siempre y cuando haya al menos una)."><FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faQuestionCircle} />  </Tooltip></h2>
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
                                                    <Row justify="space-around">
                                                        <Col>
                                                            <Image src={item} height={150} width={150} />
                                                        </Col>
                                                        {fileList[index] !== null &&
                                                            <>
                                                                <Col style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                                                                    <FontAwesomeIcon size="2x" color="black" icon={faRightLong} style={{ padding: "20px" }} />
                                                                </Col>

                                                                <Col>
                                                                    <Image height={150} width={150} alt="Sin imagen" src={URL.createObjectURL(new File([fileList[index]!], "imagen"))} />
                                                                </Col>
                                                            </>
                                                        }
                                                    </Row>
                                                    <Row justify="space-around" style={{ alignItems: "flex-start", width: "100%", marginTop: "3%" }}>
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
                            <Divider></Divider>
                            <h2>Agregar nuevas imágenes <Tooltip title="Agregar imágenes en el orden deseado de aparición. En total pueden haber 5 imagenes."><FontAwesomeIcon type="regular" style={{ marginRight: "5px" }} icon={faQuestionCircle} />  </Tooltip></h2>
                            <List
                                grid={{ column: 5, gutter: 20 }}
                                dataSource={imagenesMax}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        {index >= imagenesAux.length && (item === "") && fileList[index] &&
                                            <div>
                                                <Image height={150} width={150} alt="Sin imagen" src={URL.createObjectURL(new File([fileList[index]!], "imagen"))} />
                                            </div>
                                        }
                                    </List.Item>
                                )}
                            />

                            <Row justify="center" style={{ alignItems: "center", width: "100%" }}>

                                <Row justify="center" style={{ alignItems: "center", width: "100%" }}>
                                    <Upload key={key} onRemove={(file) => onRemove(file.originFileObj!, false)} beforeUpload={(file) => beforeUpload(file, undefined)} maxCount={5 - imagenesAux.length} accept="image/png, image/jpeg">
                                        <Button type="dashed" disabled={fileList.length === 5} style={{ width: "200px" }}>Seleccione una imágen <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ marginLeft: "5px" }} /></Button>
                                    </Upload>
                                </Row>
                            </Row>
                        </Col>

                        <Col style={{ width: "40%" }}>
                            <h2>Información</h2>
                            <Form
                                name="basic"
                                form={form}
                                initialValues={{ descripcion: producto?.descripcion, precio: producto?.precio, stock: producto?.stock, fechaFin: (producto.fechaFin) ? moment(producto.fechaFin, "DD/MM/YYYY") : "" }}
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

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="success" disabled={iguales} htmlType="submit">
                                        Terminar edición <FontAwesomeIcon icon={faFloppyDisk} style={{ marginLeft: "5px" }} />
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Card>

            </Row >
        </div >
    )

}