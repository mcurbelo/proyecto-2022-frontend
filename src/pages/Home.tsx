import MainHeader from "../components/MainHeader";

type HomePageProps = {
  showHeader: boolean;
};

const HomePage: React.FC<HomePageProps> = (props) => {
  const { showHeader } = props;
  return (
    <>
      {showHeader && <MainHeader />}
    </>
  )
}

export default HomePage;