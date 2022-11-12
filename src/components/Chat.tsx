import React, { FC, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatFeed, Message, ChatBubble } from "react-chat-ui";
import { Input, Button, Form, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { CompradorService } from "shopit-shared";
import "react-chat-widget/lib/styles.css";

import firebase, {initializeApp, getApps, getApp} from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, orderBy, limit, query, setDoc, Timestamp, addDoc, deleteDoc} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '../main.css';

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


  


const firebaseApp = createFirebaseApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// const analytics = firebase.analytics();


interface Props {}
const Chat: FC<Props> = () => {
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
    const element: HTMLInputElement = (document.getElementById("inputChat") as HTMLInputElement);
    let userUuid = localStorage.getItem("uuid");
    let data = {
      uuid: userUuid,
      mensaje: element.value,
      fecha: Timestamp.fromDate(new Date())
    };
    element.value = "";
    debugger;
    await addDoc(collection(db, "/mensajes/"+idchat+"/chat"), data); 
    executeScroll();
    
  };


  const loadNewMessage = (evt: any) => {
    setNewMessage(evt.target.value);
  };
  

  const firestoreMessages = query(collection(db, "/mensajes/"+ idchat +"/chat"), orderBy('fecha', "asc"));
    //const docSnap = await getDocs(firestoreMessages);
  let userUuid = localStorage.getItem("uuid");

  const [mensajesfirestore] = useCollectionData(firestoreMessages);
  let messages: Message[] = [];
  let loading: boolean = true;
  if(mensajesfirestore != undefined){
    messages = mensajesfirestore.map(m => {return new Message({
      id: userUuid === m.uuid ? 0 : 1,
      message: m.mensaje,
      senderName: "",
    }) })
    loading = false;
  }
  return (
    <div style={{ width: "30%", margin:"auto" }}>
      <div className="loading">
        <Spin spinning={loading}></Spin>

        <ChatFeed
        messages={messages} // Boolean: list of message objects
        hasInputField={false} // Boolean: use our input, or use your own
        showSenderName={true} // show the name of the user who sent the message
        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        // JSON: Custom bubble styles
        bubbleStyles={{
          text: {
            fontSize: 15,
          },
          chatbubble: {
            borderRadius: 20,
            padding: 5,
          },
        }}
      />
      <div className="sender" style={{display:"flex", justifyContent:"center"}}>
          <Input style={{width:"100%"}} id="inputChat" onPressEnter ={sendMessage} ></Input>
          <Button onClick={sendMessage}>
                  {" "}
                  <SendOutlined />
              </Button>
          {/* <Form layout="inline" onSubmitCapture={sendMessage}>
              <Form.Item>
              <Input style={{width:"100%"}}
                  value={newMessage}
                  id="inputChat"
                  onChange={loadNewMessage}
                  placeholder="Nuevo mensaje..."
              />
              </Form.Item>
              <Form.Item>
              <Button onClick={sendMessage}>
                  {" "}
                  <SendOutlined />
              </Button>
              </Form.Item>
          </Form> */}
        </div>
      </div>
    </div>
  );
};

export default Chat;


