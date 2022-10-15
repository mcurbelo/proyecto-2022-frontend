import MainHeader from "../components/MainHeader";
import Principal from "../components/Principal/Principal";
import { Layout } from 'antd';
import Perfil from "../components/Perfil/Perfil";
import Footer from "../components/Footer/Footer";

type HomePageProps = {
  showHeader: boolean;
  showProfile: boolean;
};


const HomePage: React.FC<HomePageProps> = (props) => {
  const showHeader = props.showHeader;
  const showProfile = props.showProfile;
  return (
    <>
    <Layout>
      {showHeader && <MainHeader />}
      {showProfile ? <Perfil></Perfil> : <Principal></Principal>}
      <Footer></Footer>
    </Layout>
    </>
  )
}

export default HomePage;