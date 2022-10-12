import MainHeader from "../components/MainHeader";
import Principal from "../components/Principal/Principal";
import { Layout } from 'antd';

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
    </Layout>
    </>
  )
}

export default HomePage;