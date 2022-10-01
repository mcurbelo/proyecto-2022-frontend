import { getMessaging, getToken, onMessage } from "firebase/messaging"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBpBoAHC1LdQijNpCLt9UfNGKHkjbKs3Bs",
    authDomain: "shopnowproyecto2022.firebaseapp.com",
    projectId: "shopnowproyecto2022",
    storageBucket: "shopnowproyecto2022.appspot.com",
    messagingSenderId: "319527562925",
    appId: "1:319527562925:web:2f6681c9cc98e1eb95a024",
    measurementId: "G-2S8M3F9J9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export const fetchToken = (setTokenFound) => {
    return getToken(messaging, {
        vapidKey: 'BPLkjIaHk6CD-4BM2cndPmdOeAxr6aI8SqusXqNNOsxihM4_tME4sOS5myxCS6YZFQHwWIhz0VV_X3rqYpM-0AQ'
    }).then((currentToken) => {
        if (currentToken) {
            console.log('Token actual del cliente: ', currentToken);
            setTokenFound(true);
            // Tracka el token
            // Muestra en la UI que esta permitido recibir notificaciones.
        } else {
            console.log('El token no esta habilitado. Se necesita permiso para generar uno.');
            setTokenFound(false);
            // Muestra en la UI que el permiso es requerido
        }
    }).catch((err) => {
        console.log('Error al crear el token. ', err);
        // Agarra el error cuando se esta creando el token del cliente.
    });
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });