import MainHeader from "../components/MainHeader";
import SignUpForm from "../components/SignUpForm"


const SignUpPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainHeader />
      <div style={{ width: "50%", alignSelf: "center", marginTop:"8%"}}>
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUpPage;