import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import { Card, Button, Typography, Image, Divider, Col, Row } from 'antd';
import { DtProductoSlim } from 'shopit-shared/dist/user/VendedorService';
import { useNavigate } from "react-router-dom";
import { createUseStyles } from 'react-jss';

interface Props {
  producto: DtProductoSlim
}
const { Meta } = Card;

const { Text, Paragraph, Title } = Typography;


export const ItemPublication = ({ producto }: Props) => {
  const navigate = useNavigate();
  return (
    <Card
      key={producto.idProducto}
      hoverable
      style={{ display: 'flex', flexDirection: 'column', minWidth: "260px" }}
      bodyStyle={{ padding: "5%", flexGrow: 1 }}
      cover={
        <Row justify='center' style={{ padding: "20px" }}>
          <Image height={240} width={240} alt={producto.nombre} src={producto.imagen} />
        </Row>
      }
      actions={[<Button type="primary" id={producto.idProducto} style={{ width: '90%' }} onClick={() => navigate("/productos/" + producto.idProducto)} icon={<InfoCircleFilled />} >
        Ver detalles
      </Button>]}>
      <div>
        <Meta title={(<Paragraph ellipsis={true ? { rows: 3 } : false}>{producto.nombre}</Paragraph>)} style={{ whiteSpace: "pre-line" }} />
        <div className="additional" style={{ marginTop: "10%", display: "flex", flexDirection: "column" }}>
          <Title level={4}>{"$" + producto.precio}</Title>
          <Text>Permite envío {(producto.permiteEnvio) ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}</Text>
        </div>
      </div>
    </Card>
  )
};
