import { DtFiltros } from "shopit-shared/dist/user/ProductoService";
import MainHeader from "../components/MainHeader";
import Perfil from "../components/Perfil";
import Publicactions from "../components/Publications"

type HomePageProps = {
  showHeader: boolean;
  showProfile: boolean;
};

const HomePage: React.FC<HomePageProps> = (props) => {
  const { showHeader, showProfile } = props;
  let filtros: DtFiltros = {
    recibirInfoEventoActivo: undefined,
    nombre: undefined,
    categorias: undefined,
    idEventoPromocional: undefined
  }
  return (
    <>
      {showHeader && <MainHeader />}
      {showProfile ? <Perfil></Perfil> : <Publicactions/>}
    </>
  )
}

export default HomePage;