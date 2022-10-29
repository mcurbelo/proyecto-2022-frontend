import { Button, message, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router';
import { DtCompra } from 'shopit-shared/dist/user/CompradorService';
import CardList from './CardList';
import CompraTarjeta from './CompraTarjetas';
import { Directions } from './Directions';

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
        marginTop: "24px"
    }

})

interface AppState {
    datosCompra: DtCompra
}


export const RealizarCompra = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [datosCompra, setDatosCompra] = useState<AppState["datosCompra"]>({
        idVendedor: "",
        idProducto: "",
        cantidad: 0,
        idTarjeta: "",
        esParaEnvio: false
    })
    const styles = useStyles();
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem("infoCompra") || "")
        //TODO ver que onda
        if (value == null) {
            navigate("/");
        }
        setDatosCompra(value)

    }, [])

    const onChangeDatos = (id: string, campo: string) => {
        if (id !== undefined) {
            setDatosCompra({ ...datosCompra, [campo]: id })
        }
    }

    const steps = [
        {
            title: 'Elegir ubicación de retiro/entrega',
            content: <Directions />,
        },
        {
            title: 'Seleccionar forma de pago',
            content: <CompraTarjeta onSelectCard={(id) => { onChangeDatos(id, "idTarjeta") }} />
        },
        {
            title: 'Realizar compra',
            content: ""
        },
    ];



    return (
        <div style={{ justifyContent: "center", display: "flex" }}>
            <div style={{ width: "80%" }}>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className={styles.stepsContent}>{steps[current].content}</div>
                <div className={styles.stepsAction}>
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Siguiente
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Confirmar pago
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => prev()}
                        >
                            Anterior
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
export default RealizarCompra;