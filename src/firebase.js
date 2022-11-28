import { getMessaging, getToken, onMessage } from "firebase/messaging"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { CompradorService } from "shopit-shared";
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
const db = getFirestore(app);

export const fetchToken = (setTokenFound) => {
    return getToken(messaging, {
        vapidKey: 'BPLkjIaHk6CD-4BM2cndPmdOeAxr6aI8SqusXqNNOsxihM4_tME4sOS5myxCS6YZFQHwWIhz0VV_X3rqYpM-0AQ'
    }).then((currentToken) => {
        if (currentToken) {
            setTokenFound(true);
            // Trackeaa el token
            // Muestra en la UI que esta permitido recibir notificaciones.
        } else {
            setTokenFound(false);
            // Muestra en la UI que el permiso es requerido
        }
        localStorage.setItem("tokenNotificacion", (currentToken) ? currentToken : "");
    }).catch((err) => {
        // Agarra el error cuando se esta creando el token del cliente.
    });
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export const iniciarChat = (idCompra, token) => {
    CompradorService.obtenerChat(idCompra, token).then(res => {
        if (res === "") {
            crearChat(idCompra).then(idChat => {
                return ("/chat/" + idChat)
            })
        } else {
            return ("/chat/" + res)
        }
    })
}

export const crearChat = async (idcompra, token) => {
    console.log(token)
    let collectionRef = collection(db, "mensajes");
    return addDoc(collectionRef, {}).then(referece => {
        let id = referece.id;
        CompradorService.iniciarChat(idcompra, id, token);
        return id;
    }).catch(e => { })
};
