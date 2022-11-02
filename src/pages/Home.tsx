import AddCardForm from "../components/AddCard";
import CardList from "../components/CardList";
import MainHeader from "../components/MainHeader";
import Perfil from "../components/Perfil";
import Publicactions from "../components/Publications"

type HomePageProps = {
  showHeader: boolean;
  showProfile: boolean;
};

const HomePage: React.FC<HomePageProps> = (props) => {
  const { showHeader, showProfile } = props;
  return (
    <>
      {/* {showHeader && } */}
      {showProfile ? <Perfil></Perfil> : <Publicactions/>}
    </>
  )
}

export default HomePage;