import { message, Modal, Space, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation, useNavigate } from 'react-router';
import { CompradorService } from 'shopit-shared';
import { DtCompra } from 'shopit-shared/dist/user/CompradorService';
import CompraDireccion from './CompraDireccion';
import CompraTarjeta from './CompraTarjetas';
import { DtDireccion } from "shopit-shared/dist/user/CompradorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleLeft, faCircleRight, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CompraFinal from './CompraFin';
import { DtProducto } from 'shopit-shared/dist/user/ProductoService';
import { CreditCardData } from './CardList';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Step } = Steps;


const useStyles = createUseStyles({
    stepsContent: {
        minHeight: "200px",
        marginTop: "16px",
        paddingTop: "80px",
        textAlign: "center",
        backgroundColor: "#fafafa",
        border: "1px dashed #e9e9e9",
        borderRadius: "2px",
    },
    stepsAction: {
        marginTop: "24px",
        display: "flex",
        justifyContent: "center"
    },

    container: {
        width: "80%"
    },

    "@global": {
        ".ant-modal-confirm-btns": {
            display: "flex",
            justifyContent: "center"
        },
        ".ant-modal-confirm .ant-modal-confirm-btns .ant-btn + .ant-btn": {
            marginLeft: "30px",
            background: "#28a745",
            borderColor: "#28a745"
        }
    },

    '@media screen and (max-width: 800px)': {
        container: {
            width: "100%"
        },
    }

})

interface AppState {
    datosCompra: DtCompra
    datosTarjeta: CreditCardData
}


export const RealizarCompra = () => {
    const { state } = useLocation();
    const { producto } = state;
    const [productoInfo] = useState(producto as DtProducto)
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [infoTarjeta, setInfoTarjeta] = useState<AppState["datosTarjeta"]>();
    const [direccionesVendedor] = useState(productoInfo.localesParaRetiro)
    const [datosDireccion, setDatosDireccion] = useState("");
    const [datosCompra, setDatosCompra] = useState<AppState["datosCompra"]>({
        idVendedor: "",
        idProducto: "",
        cantidad: 0,
        idTarjeta: "",
        esParaEnvio: false,
        idDireccionEnvio: -1,
        idDireccionLocal: -1
    })
    const styles = useStyles();
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    useEffect(() => {
        if (localStorage.getItem("infoCompra") === null)
            navigate("/");
        let value = JSON.parse(localStorage.getItem("infoCompra") || "")
        setDatosCompra(value)

    }, [])

    const onChangeDatos = (id: string, campo: string) => {
        if (id !== undefined) {
            setDatosCompra({ ...datosCompra, [campo]: id })
        }
    }

    const onChangeEnvio = (opc: boolean) => {
        let items = datosCompra;
        items["esParaEnvio"] = opc;
        setDatosCompra(items)
        if (opc)
            setDatosCompra({ ...datosCompra, "idDireccionLocal": -1 })
        else
            setDatosCompra({ ...datosCompra, "idDireccionEnvio": -1 })
    }

    const titulo = (productoInfo.permiteEnvio) ? "Elegir ubicación de retiro o entrega" : "Elegir ubicacion de retiro"

    const steps = [
        {
            title: titulo,
            content: <CompraDireccion permiteEnvio={productoInfo.permiteEnvio} direccionesVendedor={direccionesVendedor}
                onSelectEsEnvio={(opc) => { onChangeEnvio(opc) }}
                onSelectDireccion={(direccion) => {
                    onChangeDatos(direccion.id!.toString(), (datosCompra.esParaEnvio) ? "idDireccionEnvio" : "idDireccionLocal");
                    setDatosDireccion(direccion.calle + " " + direccion.numero + ". " + direccion.localidad + ", " + direccion.departamento)
                }} selecionPrevia={datosCompra} />
        },
        {
            title: 'Seleccionar forma de pago',
            content: <CompraTarjeta onSelectCard={(id) => { onChangeDatos(id, "idTarjeta") }} idSeleccionPrevia={datosCompra.idTarjeta} infoCard={(info) => { setInfoTarjeta(info); }} />
        },
        {
            title: 'Realizar compra',
            content: <CompraFinal producto={productoInfo} compra={datosCompra} infoTarjeta={infoTarjeta!} direccion={datosDireccion} />
        },
    ];
    const { confirm } = Modal;

    const disableButton = () => {
        const buttonCancel = document.getElementById("cancelButton")
        buttonCancel?.setAttribute("disabled", "true");
    }

    const realizarPago = () => {
        let token = localStorage.getItem("token");
        let idUsuarios = localStorage.getItem("uuid");
        confirm({
            title: 'Está seguro de confirmar el pago?',
            icon: <ExclamationCircleOutlined />,
            content: 'Este proceso de pago puede tomar unos segundos.',
            okText: 'Confirmar',
            closeIcon: false,
            cancelButtonProps: { id: "cancelButton" },
            cancelText: "Cancelar",
            onOk() {
                return CompradorService.nuevaCompra(idUsuarios!, token!, datosCompra).then((result) => {
                    if (result === "200") {
                        Modal.success({
                            title:"Compra realizada!!!",
                            content: 'Compra finalizada con éxito!!! Recuerde que tiene que esperar la confirmación del vendedor. Puede ser hasta 48 hrs.',
                        });
                        localStorage.removeItem("infoCompra");
                    } else {
                        Modal.error({
                            title: 'Error en el pago',
                            content: 'Ha sucedido un problema al realizar el pago, intentelo de nuevo más tarde.',
                        });
                    }
                    navigate("/");
                })
            },
            onCancel() { },
        });
    };


    return (
        <div style={{ justifyContent: "center", display: "flex" }}>
            <div className={styles.container}>
                <Steps responsive={true} current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className={styles.stepsContent}>{steps[current].content}</div>
                <div className={styles.stepsAction}>
                    <Space size={100} align="center">
                        {current === 0 && (
                            <Button type='warning' size='large' style={{ width: "190px" }}
                                onClick={() => { localStorage.removeItem("infoCompra"); navigate("/productos/" + datosCompra.idProducto) }}
                            ><FontAwesomeIcon style={{ display: "inline-block", marginRight: "10px" }} icon={faCircleLeft} />
                                Volver al producto
                            </Button>
                        )}

                        {current > 0 && (
                            <Button type='info' size='large' style={{ width: "190px" }}
                                onClick={() => prev()}
                            ><FontAwesomeIcon style={{ display: "inline-block", marginRight: "10px" }} icon={faCircleLeft} />
                                Anterior
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="success" size='large' onClick={() => next()} style={{ width: "190px" }} disabled={(current === 0 && !(datosCompra.idDireccionEnvio! !== -1 || datosCompra.idDireccionLocal! !== -1)) || (current === 1 && (datosCompra.idTarjeta === ""))}>
                                Continuar  <FontAwesomeIcon style={{ display: "inline-block", marginLeft: "10px" }} icon={faCircleRight} />
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="success" size='large' onClick={realizarPago} style={{ width: "190px" }}>
                                Realizar pago <FontAwesomeIcon style={{ display: "inline-block", marginLeft: "10px" }} icon={faSackDollar} />
                            </Button>
                        )}
                    </Space>
                </div>
            </div>
        </div>
    );
}
export default RealizarCompra;