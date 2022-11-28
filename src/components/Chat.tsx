import { FC, useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ChatFeed, Message } from "react-chat-ui";
import { Input, Button, Spin, Row } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "react-chat-widget/lib/styles.css";

import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, orderBy, query, Timestamp, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '../main.css';
import { CompradorService } from "shopit-shared";
import { createUseStyles } from "react-jss";

const firebaseConfig = {
  apiKey: "AIzaSyBpBoAHC1LdQijNpCLt9UfNGKHkjbKs3Bs",
  authDomain: "shopnowproyecto2022.firebaseapp.com",
  projectId: "shopnowproyecto2022",
  storageBucket: "shopnowproyecto2022.appspot.com",
  messagingSenderId: "319527562925",
  appId: "1:319527562925:web:2f6681c9cc98e1eb95a024",
  measurementId: "G-2S8M3F9J9J"
};

const createFirebaseApp = (config = {}) => {
  try {
    return getApp();
  } catch (e) {
    return initializeApp(config);
  }
};

const useStyles = createUseStyles({
  "@global": {
    "#chat-panel": {
      minHeight: "80px",
      maxHeight: "400px"
    }
  },

})




const firebaseApp = createFirebaseApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// const analytics = firebase.analytics();


interface Props { }
const Chat: FC<Props> = () => {
  const styles = useStyles();
  const { state } = useLocation();
  const { receptor } = state;
  const messagesEndRef = useRef(null);
  let { idchat } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const myRef = useRef<null | HTMLDivElement>(null);
  //const [idchat, setIdChat] = useState("");
  const [mensajes, setMensajes] = useState([] as Message[]);


  const executeScroll = () => {
    myRef.current?.scrollIntoView();
  }

  useEffect(() => {
    // CompradorService.obtenerChat(idcompra as string).then((idchat) => {
    //   setIdChat(idchat as string)
    // }).catch();
  }, []);

  const sendMessage = async (evt: any) => {
    let userUuid = localStorage.getItem("uuid");
    let data = {
      uuid: userUuid,
      mensaje: newMessage,
      fecha: Timestamp.fromDate(new Date())
    };
    setNewMessage("");
    await addDoc(collection(db, "/mensajes/" + idchat + "/chat"), data);
    executeScroll();
    CompradorService.notificarRespuesta(idchat!, userUuid!, localStorage.getItem("token")!)
  };


  const loadNewMessage = (evt: any) => {
    setNewMessage(evt.target.value);
  };


  const firestoreMessages = query(collection(db, "/mensajes/" + idchat + "/chat"), orderBy('fecha', "asc"));
  //const docSnap = await getDocs(firestoreMessages);
  let userUuid = localStorage.getItem("uuid");

  const [mensajesfirestore] = useCollectionData(firestoreMessages);
  let messages: Message[] = [];
  let loading: boolean = true;
  if (mensajesfirestore != undefined) {
    messages = mensajesfirestore.map(m => {
      return new Message({
        id: userUuid === m.uuid ? 0 : 1,
        message: m.mensaje,
        senderName: receptor,
      })
    })
    loading = false;
  }

  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Chat con {receptor}</h1>
      <div style={{ width: "30%", margin: "auto" }}>
        <div className="loading">
          <Row justify="center">
            <Spin spinning={loading} ></Spin>
          </Row>
          <ChatFeed
            messages={messages} // Boolean: list of message objects
            hasInputField={false} // Boolean: use our input, or use your own
            showSenderName={true} // show the name of the user who sent the message
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            // JSON: Custom bubble styles
            bubbleStyles={{
              text: {
                fontSize: 15,
                fontColor:"black"
              },
              userBubble: {
               
              },
              chatbubble: {
                borderRadius: 30,
                padding: 7,
                
              },
            }}
          />
          <div className="sender" style={{ display: "flex", justifyContent: "center" }}>
            <Input style={{ width: "100%" }} id="inputChat" onPressEnter={(e) => (newMessage.trim() === "") ? sendMessage : e.preventDefault()} onChange={e => setNewMessage(e.target.value)} value={newMessage} ></Input>
            <Button onClick={sendMessage} disabled={newMessage.trim() === ""}>
              {" "}
              <SendOutlined />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;


