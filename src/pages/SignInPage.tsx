import { Card } from "antd";
import { createUseStyles } from "react-jss";
import SignInForm from "../components/SignInForm";
import imagen from '../images/inicioSesion.jpg'
type SignInPageProps = {}

const myStyle = {
  backgroundImage:
    "url('" + imagen + "')",
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const useStyles = createUseStyles({
  cardContainer : {
    width:"30%"
  },

  '@media screen and (max-width: 912px)': {
    cardContainer: {
        width: "70%"
    },
},

'@media screen and (max-width: 768px)': {
  cardContainer: {
      width: "50%"
  },
},

'@media screen and (max-width: 500px)': {
  cardContainer: {
      width: "85%"
  },
}

});

const SignInPage: React.FC<SignInPageProps> = (props) => {
  const styles = useStyles();
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...myStyle }}>
      <Card className={styles.cardContainer}>
        <SignInForm />
      </Card>
    </div>
  )
}

export default SignInPage;