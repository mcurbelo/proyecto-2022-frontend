
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import "./main.css"
import 'antd/dist/antd.css';
import { Auth } from "shopit-shared";
import App from './App'



require('dotenv').config();

Auth.endpoint = process.env.REACT_APP_SERVER_URL ?? "";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

  root.render(
    <>
     <App/>
    </>
  );
  reportWebVitals();
