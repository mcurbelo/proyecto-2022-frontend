import MainHeader from "../components/MainHeader";
import Principal from "../components/Principal/Principal";
import { Layout } from 'antd';
import Perfil from "../components/Perfil/Perfil";
import Footer from "../components/Footer/Footer";

type HomePageProps = {
  showHeader: boolean;
};


const HomePage: React.FC<HomePageProps> = (props) => {
  const { showHeader } = props;
  return (
    <>
    <Layout>
      {showHeader && <MainHeader />}
      <Principal></Principal>
      <Footer></Footer>
    </Layout>
    </>
  )
}

export default HomePage;