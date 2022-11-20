import { faCoins, faSackDollar, faShop, faTruckFast, faUser, faUserCheck, faUserLock, faUsersViewfinder, faUserTie, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Checkbox, Col, DatePicker, Divider, Form, Radio, Row, Statistic } from "antd"
import { RangePickerProps } from "antd/lib/date-picker";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { AdministradorService, VendedorService } from "shopit-shared";
import { DtBalance, EstVendedor } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { SearchOutlined } from "@ant-design/icons";
import { EstAdm, UsuariosEst, UsuariosEstAll } from "shopit-shared/dist/user/AdministradorService";

const { RangePicker } = DatePicker;


export const EstUsuarios = () => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [eleccion, setEleccion] = useState({
        esHistorico: true,
        inicio: "",
        fin: ""
    })
    const [datos, setDatos] = useState<UsuariosEstAll>()
    const [buscar, setBuscar] = useState(false);

    const onChangeRangePicker: RangePickerProps['onChange'] = (date, dateString) => {
        setEleccion({ inicio: dateString[0], fin: dateString[1], esHistorico: false })
    };

    useEffect(() => {
        busqueda()
    }, [])

    const busqueda = () => {
        setBuscar(true)
        AdministradorService.estadisticasAdm( token!, EstAdm.Usuarios, (eleccion.esHistorico) ? "" : eleccion.inicio, (eleccion.esHistorico) ? "" : eleccion.fin).then((response) => {
            if (response.usuarios) {
                setDatos(response.usuarios);
                setBuscar(false)
            }
        })
    }

    const COLORS = ['#2d77f5', '#04143b' ];
    const RADIAN = Math.PI / 180;


    const dataUsuariosTipo = [
        { name: 'Solo compradores', Cantidad: datos?.usuarios.cantidadSoloCompradores },
        { name: 'Comprador y vendedor', Cantidad: datos?.usuarios.cantidadVendedores },
    ];




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
            {(datos) && (datos!.muestra != 0) ?
                <div style={{marginTop:"10px"}}>
                    <Card>
                        <Divider plain><h2>Usuarios</h2></Divider>
                        <Row justify="space-around">
                            <Statistic
                                title="Solo compradores"
                                value={datos.usuarios.cantidadSoloCompradores}
                                valueStyle={{ color: '#2d77f5' }}
                                suffix={<FontAwesomeIcon icon={faUser} />}
                            />
                            <Statistic
                                title="Comprador y vendedor"
                                value={datos.usuarios.cantidadVendedores}
                                valueStyle={{color:'#04143b'}}
                                suffix={<FontAwesomeIcon icon={faUserTie} />}
                            />
                            <Statistic
                                title="Activos"
                                value={datos.usuarios.cantidadActivos}
                                valueStyle={{ color: '#389e0d' }}
                                suffix={<FontAwesomeIcon icon={faUserCheck} />}
                            />
                            <Statistic
                                title="Bloqueados"
                                value={datos.usuarios.cantidadBloqueados}
                                valueStyle={{ color: '#d48806' }}
                                suffix={<FontAwesomeIcon icon={faUserLock} />}
                            />
                            <Statistic
                                title="Eliminados"
                                value={datos.usuarios.cantidadEliminados}
                                valueStyle={{ color: '#cf1322' }}
                                suffix={<FontAwesomeIcon icon={faUserXmark} />}
                            />
                        </Row>

                        <Divider plain><h2>Administradores</h2></Divider>
                        <Row justify="space-around">
                        
                            <Statistic
                                title="Activos"
                                value={datos.admins.cantidadActivos}
                                valueStyle={{ color: '#389e0d' }}
                                suffix={<FontAwesomeIcon icon={faUserCheck} />}
                            />
                            <Statistic
                                title="Bloqueados"
                                value={datos.admins.cantidadBloqueados}
                                valueStyle={{ color: '#d48806' }}
                                suffix={<FontAwesomeIcon icon={faUserLock} />}
                            />
                            <Statistic
                                title="Eliminados"
                                value={datos.admins.cantidadEliminados}
                                valueStyle={{ color: '#cf1322' }}
                                suffix={<FontAwesomeIcon icon={faUserXmark} />}
                            />
 
                        </Row>

                        <Divider ></Divider>
                        <Row justify="space-around">
                    
                            <Statistic
                                title="Muestra / Total"
                                value={datos.muestra}
                                suffix={<><span>/ {datos.total}</span> <FontAwesomeIcon icon={faUser} /></>}
                            />
                        </Row>
                   
                   <Divider/>
                    <Row gutter={16} justify="center" style={{marginTop:"10px"}}>
                                <h1 style={{ textAlign: "center" }}>Distribución en la aplicacion por tipo de usuario</h1>
                                <ResponsiveContainer width={'95%'} height={400}>
                                    <PieChart>
                                        <Pie
                                            data={dataUsuariosTipo}
                                            cx="50%"
                                            cy="50%"
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="Cantidad"
                                            labelLine={false}>

                                            {dataUsuariosTipo.map((entry, index) =>
                                                (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)

                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>

                    </Row>
                    </Card>
                </div>
                :
                <Row gutter={16} justify="center">
                    <Card bordered={false}>
                        <h2>No se encontraron datos :(</h2>
                    </Card>
                </Row>

            }
        </div >
    )
}
