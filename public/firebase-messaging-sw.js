// Scripts para Firebase y Firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Inicializa la app de Firebasa en el service worker con la firebaseconfig, que esta en firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBpBoAHC1LdQijNpCLt9UfNGKHkjbKs3Bs",
  authDomain: "shopnowproyecto2022.firebaseapp.com",
  projectId: "shopnowproyecto2022",
  storageBucket: "shopnowproyecto2022.appspot.com",
  messagingSenderId: "319527562925",
  appId: "1:319527562925:web:2f6681c9cc98e1eb95a024",
  measurementId: "G-2S8M3F9J9J"
};
firebase.initializeApp(firebaseConfig);

// Recupera mensajes de Firebase 
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);

});

