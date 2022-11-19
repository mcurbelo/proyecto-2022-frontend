import { Card, DatePicker, Divider, Form, Radio, Row } from "antd"
import { RangePickerProps } from "antd/lib/date-picker";
import { useEffect, useState } from "react";
import { Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, TooltipProps } from 'recharts';
import { VendedorService } from "shopit-shared";
import { DtProductosMejoresCalificados, DtTopProductosVendidos, EstVendedor } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { SearchOutlined } from "@ant-design/icons";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const { RangePicker } = DatePicker;


export const EstVendedorTop10Calificados = () => {
    const idUsuario = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [eleccion, setEleccion] = useState({
        esHistorico: true,
        inicio: "",
        fin: ""
    })
    const [datos, setDatos] = useState<DtProductosMejoresCalificados[]>([])
    const [buscar, setBuscar] = useState(false);

    const onChangeRangePicker: RangePickerProps['onChange'] = (date, dateString) => {
        setEleccion({ inicio: dateString[0], fin: dateString[1], esHistorico: false })
    };

    useEffect(() => {
        busqueda()
    }, [])

    const busqueda = () => {
        setBuscar(true);
        VendedorService.estadisticasVenedor(idUsuario!, token!, EstVendedor.Top10ProdCalificados, (eleccion.esHistorico) ? "" : eleccion.inicio, (eleccion.esHistorico) ? "" : eleccion.fin).then((response) => {
            if (response.mejoresCalificados) {
                setDatos(response.mejoresCalificados);
                setBuscar(false)
            }
        })
    }


    const TooltipMod = ({
        active,
        payload,
        label,
    }: TooltipProps<ValueType, NameType>) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: "white", padding: "20px" }}>
                    <p className="label">{`${label}`} </p>
                    <p className="label">Calificación: {`${payload?.[0].value}`}/5</p>
                    <p className="label">Cantidad vendida: {`${payload?.[0].payload.cantidad}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <Row justify="center">
                <Card >
                    <Row justify="center">
                        <Radio.Group value={eleccion.esHistorico} onChange={(e) => setEleccion({ ...eleccion, esHistorico: e.target.value })} >
                            <Radio value={true} >
                                <h3>Historico</h3>
                            </Radio>
                            <Radio value={false} >
                                <h3>Por rango</h3>
                            </Radio>
                        </Radio.Group>
                    </Row>
                    <Form name="rango"
                        form={form}
                        onFinish={busqueda}>
                        <Row justify="center">
                            <Form.Item name="rango" rules={[{ required: !eleccion.esHistorico, message: "El rango de fecha es obligatorio" }]}>
                                <RangePicker id="rango" disabled={eleccion.esHistorico} format={"DD/MM/YYYY"} placeholder={["Inicio", "Fin"]} onChange={onChangeRangePicker} />
                            </Form.Item>
                        </Row>
                        <Divider></Divider>
                        <Row justify="center">
                            <Form.Item >
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={buscar}>Buscar</Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </Card>
            </Row >
            {(datos?.length != 0) ?
                <Row gutter={16} justify="center" >
                     <div style={{width:"100%"}}>
                        <Card>
                            <h1 style={{ textAlign: "center" }}>Top 10 productos mejores calificados</h1>
                            <ResponsiveContainer width={'99%'} height={datos!.length * 225}>
                                <BarChart
                                    layout="vertical"
                                    width={500}
                                    height={600}
                                    data={datos}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20
                                    }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis type="number" allowDecimals={true} tickLine={false} allowDataOverflow={true} tickCount={6} domain={[0, 5]}/>
                                    <YAxis dataKey="nombre" type="category" allowDataOverflow tickLine={false} />
                                    <Tooltip cursor={false} content={TooltipMod} />
                                    <Bar dataKey="calificacion" barSize={20} fill="#413ea0" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                </Row>

                :
                <Row gutter={16} justify="center" >
                    <Card bordered={false}>
                        <h2>No se encontraron ventas :(</h2>
                    </Card>
                </Row>

            }


        </div>

    )
}
