import { Alert, Button, Form, Input, Spin } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { CardService } from "shopit-shared";

type AddCardState = {
  success: boolean;
  loading: boolean;
  hasLoaded: boolean;
  mensaje?: string;
}

interface AddCardProp {
  onCardAdd?: () => void
}

const useStyles = createUseStyles({
  "@global": {
    ".ant-spin-dot-item": {
      background: "#000000"
    }
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginBottom: 15
  }
})
const AddCardForm = ({ onCardAdd = undefined }: AddCardProp) => {
  const styles = useStyles();
  const [state, setState] = useState({ success: false, loading: false, mensaje: "" } as AddCardState)
  return (
    <div className={styles.wrapper}>
      <h1>Agregar tarjeta</h1>
      <Form
        className={styles.form}
        disabled={state.loading}
        layout="vertical"
        onFinish={(values) => {
          // TODO Esto capaz debería pasarse a la librería compartida cuando se inicia sesión/carga la web
          let token = localStorage.getItem("token");
          let uuid = localStorage.getItem("uuid");
          setState({ ...state, loading: true })
          CardService.agregarTarjeta({
            cardNumber: values.cardNumber,
            cardCvv: values.cardCvv,
            cardExpiration: values.cardExpiration,
            uuid: uuid!,
            token: token!
          }).then((response) => {
            setState({ success: true, loading: false, hasLoaded: true })
            if (onCardAdd !== undefined)
              onCardAdd()
          }).catch((error) => {
            setState({ success: false, loading: false, hasLoaded: true, mensaje: (error.response.status == "409") ? error.response.data.message : "Ha ocurrido un error al agregar la tarjeta" })
          })
        }}
      >
        <Form.Item name="cardNumber" label="Número de tarjeta:"
          rules={[{
            required: true,
            pattern: new RegExp("(^[0-9]{16})$"),
            message: "Se requiren 16 caracteres"
          }]}
        >
          <Input maxLength={16} type="txt_cardNumber" placeholder="4111 1111 1111 1111" />
        </Form.Item>

        <Form.Item
          name="cardCvv"
          label="CCV:"
          rules={[{
            required: true,
            pattern: new RegExp("(^[0-9]{3,4})"),
            message: "Se requieren 3 caracteres"
          }]}
        >
          <Input placeholder="123" maxLength={4} />
        </Form.Item>

        <Form.Item name="cardExpiration"
          label="Fecha de expiración:"
          rules={[{
            required: true,
            pattern: new RegExp("(^[0-9]{2}\/[0-9]{2})"),
            message: "Obligatorio, con formato MM/AA"
          }]}
        >
          <Input placeholder="10/23" maxLength={5} />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ justifySelf: "center", width: "100%" }}>
          {state.loading && <Spin />}
          {!state.loading && "Agregar tarjeta"}
        </Button>
      </Form>

      {state.hasLoaded && !state.loading && state.success &&
        <Alert type="success" message="Su tarjeta ha sido agregada correctamente" />
      }
      {state.hasLoaded && !state.loading && !state.success &&
        <Alert type="error" message={state.mensaje} />
      }
    </div>
  )
}

export default AddCardForm;