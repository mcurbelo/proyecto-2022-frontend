import { createUseStyles } from "react-jss";
import SignInForm from "../components/SignInForm";


const useStyles = createUseStyles({
  wrapper: {
    margin: 0
  }
})


type SignInPageProps = {}

const SignInPage: React.FC<SignInPageProps> = (props) => {
  const styles = useStyles();
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: -70 }}>
      <SignInForm />
    </div>
  )
}

export default SignInPage;