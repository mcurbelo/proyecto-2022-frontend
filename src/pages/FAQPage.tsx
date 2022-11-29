import { Col, Collapse, Divider, Row } from "antd"
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

const { Panel } = Collapse;

const FAQPage = () => {
    const navigate = useNavigate();
    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <>
            <h1 style={{ textAlign: "center" }}>Preguntas frecuentes</h1>
            <div style={{ justifyContent: "center", display: "flex" }}>
                <Row style={{ width: "85%", backgroundColor: "white", padding: "20px" }}>
                    <Row justify="center" style={{ columnGap: "5%" }}>
                        <div>
                            <p><b>Bienvenido a ShopNow</b>, esta es una plataforma de compra y venta de productos de forma online,
                                también conocido como ecommerce. La cual tiene como objetivo ser una plataforma que brinde sus servicios a nivel nacional (Uruguay),
                                para luego expandirse a otros países, junto con otras monedas.</p>

                            <p>Esta plataforma brinda seguridad y confiabilidad a la hora de la realizar la compra contando con un sistema de reclamos por si algo no sucede como es esperado y en última instancia se puede recurrir al soporte, como también seguridad y confiabilidad sobre los datos almacenados de los usuarios.</p>

                            <p>En esta sección se abordarán las <b>preguntas frecuentes</b> que suelen tener los <b>compradores/vendedores</b>, acerca de las diferentes funcionalidades que brindan los sitios de estas características. Por ende, esta divido en los dos roles, nombrados anteriormente.</p>
                        </div>
                        <Divider></Divider>
                        <Col style={{ width: "35%" }}>
                            <h2 style={{ textAlign: "center" }}>Comprador</h2>
                            <Collapse accordion >
                                <Panel header="¿Cómo funciona el proceso de compra?" key="1">
                                    <p>Primero se debe elegir un producto de los listados en la pagina de inicio, seleccionar “Ver detalle”,
                                        el cual lo enviara a una página con la información extra del producto en cuestión. Donde en la parte derecha
                                        de la pantalla podrá ingresar la cantidad de producto a comprar. Una vez asegurado que es el producto que busca
                                        y ingresando la cantidad a elegir, haga click en el botón de “Compra ahora”. </p>

                                    <p>La siguiente pantalla que se mostrara es la referida al proceso de compra donde, primero se solicitará elegir la
                                        dirección de entrega:</p>
                                    <ul>
                                        <li>Si el producto permite envío, podrá seleccionar la opción “Envío” y elegir de una de sus direcciones,
                                            si no tiene ninguna allí mismo puede agregar una y utilizarla al instante.</li>
                                        <li>Si solo permite retiro, deberá elegir de las direcciones que tiene el vendedor.</li>
                                    </ul>

                                    <p>Una vez elegida la forma de entrega y la dirección, podrá hacer click en siguiente.
                                        A continuación, deberá elegir la forma de pago, en ShopNow actualmente aceptamos las siguientes tarjetas:
                                    </p>

                                    <ul>
                                        <li>Visa</li>
                                        <li>Mastercard</li>
                                        <li>Amex</li>
                                        <li>Discover</li>
                                        <li>JCB</li>
                                        <li>Diners</li>
                                        <li>UnionPay</li>
                                    </ul>

                                    <p>Si no tiene ninguna, puede agregar una tarjeta dentro del mismo proceso con el botón “Agregar Tarjetas”
                                        Una vez elegida la forma de pago, podrá hacer click en el botón “Siguiente”.
                                    </p>

                                    <p>Por último, tendrá un resumen de su compra, una vez visualizado y entendiendo que todo este correcto, deberá hacer click en “Confirmar pago”,
                                        donde nuevamente deberá confirmar y donde comenzará a realizarse la transacción.
                                    </p>

                                    <p>Por el lado del vendedor, tendrá un máximo de 48hrs para confirmar o cancelar la compra. En cualquier caso, se notificará al comprador, conteniendo el motivo si es una cancelación.
                                    </p>
                                </Panel>
                                <Panel header="¿Cómo puedo reclamar por la compra de un producto?" key="2">
                                    <p>Para realizar reclamos, se debe ir a “Mis compras”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de su nombre (esquina superior derecha). Una vez en el historial se deberá buscar la compra, utilizando los filtros o buscando entre las diferentes compras hechas y hace click en “Realizar reclamo”, se deberá seleccionar el tipo de los predefinidos y si no encuentra su tipo de reclamo coloque “Otro”,
                                        luego deberá ingresar la descripción del reclamo para que el vendedor la vea.</p>
                                    <p>Flujos que pueden tener los reclamos:</p>
                                    <ul>
                                        <li>El vendedor inicia un chat con la persona que realizó el reclamo. En la cual se puede dialogar sobre el mismo. Si se inicia la instancia, como también si envía un nuevo mensaje el otro participante
                                            será notificado en la web, como por correo.</li>
                                        <li>Si el comprador considera que se resolvió el problema en la instancia de chat, el deberá marcar el reclamo como resuelto en la misma interfaz de “Mis reclamos”.</li>
                                        <li>El vendedor devuelve el dinero: Se devuelve el dinero de la compra en la tarjeta en la cual se realizó la compra. La devolución del producto entre el comprador y vendedor se realiza por fuera de la aplicación o dentro del chat.</li>
                                    </ul>
                                    <p><b>Importante:</b> Solo se puede tener un reclamo “No resuelto” por compra.</p>

                                </Panel>
                                <Panel header="¿Cómo puedo comenzar a vender en ShopNow?" key="3">
                                    <p>Para solicitar el rol de vendedor, se debe ir a “Solicitar rol vendedor”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de su nombre (equina superior derecha).
                                        En esta solicitud deberá primero elegir una dirección que será la dirección de retiro de sus productos. Si no tiene una dirección, podrá agregar una dirección dentro de la misma solicitud.
                                        Una vez elegida deberá ingresar los datos del producto que desea poner a la venta.  Por último, deberá especificar si será un vendedor que tiene una empresa, teniendo que ingresar los datos solicitado al marcar esa opción. </p>
                                    <p>Una vez la solicitud se haya enviado. Un administrador revisará su solicitud y podrá aceptarla o rechazarla, notificando la resolución mediante correo electrónico. </p>
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col style={{ width: "35%" }}>
                            <h2 style={{ textAlign: "center" }}>Vendedor</h2>
                            <Collapse accordion >
                                <Panel header="¿Cómo agrego nuevos productos?" key="1">
                                    <p>Para agregar nuevos productos, se debe ir a “Agregar producto”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de “Opciones de vendedor” (equina superior derecha).</p>
                                </Panel>

                                <Panel header="¿Cómo modifico alguno de mis productos?" key="2">
                                    <p>Para modificar los productos, se debe ir a “Mis productos”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de “Opciones de vendedor” (equina superior derecha).</p>
                                    <p>Una vez seleccionada esa opción se mostrarán todos los productos pertenecientes al vendedor, donde podrá filtrar para buscar uno especifico.</p>
                                    <p>Se puede modificar la visibilidad del producto al público y datos e imágenes.</p>
                                </Panel>

                                <Panel header="¿Cómo puedo gestionar mis ventas?" key="3">
                                    <p>Al momento de que se realice una nueva venta sobre alguno de sus productos recibirá una notificación en la aplicación o por correo. Para poder gestionarla se de ir a “Mis ventas”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de “Opciones de vendedor” (esquina superior derecha). </p>
                                    <p>Una vez seleccionada dicha opción, se mostrarán todas las ventas mostrando las más recientes primero, mostrando así las opciones provistas por ShopNow en cada una. Para gestionar una venta, es decir, cambiar su estado, se deberá clickear sobre “Acciones” sobre una venta Esperando confirmación, teniendo así la opción de Aceptar o Rechazar, en el primer caso se deberá especificar la fecha y hora de retiro y en el segundo el motivo por el cual se rechaza.</p>
                                    <p>También se puede completar la venta, es decir, cuando el comprador tenga en sus manos el producto, clickeando sobre “Completar venta”</p>
                                </Panel>
                                <Panel header="¿Cómo gestiono los reclamos recibidos?" key="4">
                                    <p>Al recibir un nuevo reclamo recibirá una notificación en la aplicación o por correo. Para poder gestionarla se de ir a “Mis reclamos recibidos”, el cual se encuentra en el menú desplegable al pasar el mouse por encima de “Opciones de vendedor” (esquina superior derecha).</p>
                                    <p>Una vez seleccionada dicha opción, se mostrarán todos los reclamos no resueltos ordenados por fecha, mostrando así las opciones provistas por ShopNow en cada uno. Pudiendo devolver el dinero o iniciar el chat con el comprador para solucionar el reclamo. </p>
                                    <p><b>IMPORTANTE:</b> El reclamo se cierra si el comprador lo marca como completado o el vendedor decide Devolver el dinero.</p>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                    <Row justify="center" style={{ width: "100%", marginTop: "5%" }}>
                        <Button type="success" onClick={() => navigate("/")}><b>Ir hacia los productos</b><FontAwesomeIcon icon={faCircleRight} style={{ display: "inline-block", marginLeft: "5px" }} /></Button>
                    </Row>

                </Row>
            </div>
        </>
    )
}

export default FAQPage