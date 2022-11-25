import { Button, Image, Radio, Typography } from "antd";
import { createUseStyles } from "react-jss";

type CreditCardProps = {
  id: string;
  last4: string;
  expiration: string;
  imageUrl: string;
  checked: boolean;
  onCardSelected: (id: string) => void
}

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderColor: "#000000",
    borderWidth: 0.5,
    borderStyle: "solid",
    marginBottom: 16,
    padding: 8,
    alignItems: "center",
    "&:hover": {
      borderColor: "#1890ff",
      cursor: "pointer"
    }
  },
  cardData: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 12,
  }
})
const CreditCard: React.FC<CreditCardProps> = (props) => {
  const { id, last4, expiration, imageUrl, checked, onCardSelected } = props;
  const styles = useStyles()
  return (
    <div className={styles.wrapper} onClick={() => onCardSelected(id)}>
      <Radio checked={checked} onClick={() => onCardSelected(id)} />
      <Image src={imageUrl} preview={false} />
      <div className={styles.cardData}>
        <Typography>
          <b>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; {last4}</b>
        </Typography>
        <Typography>Vencimiento: <b>{expiration}</b></Typography>
      </div>
    </div>
  )
}

export default CreditCard;