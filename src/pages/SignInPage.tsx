import SignInForm from "../components/SignInForm";

type SignInPageProps = {}

const SignInPage: React.FC<SignInPageProps> = (props) => {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignInForm />
    </div>
  )
}

export default SignInPage;