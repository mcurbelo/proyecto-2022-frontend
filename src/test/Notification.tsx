import { useState } from 'react';
import { notification } from 'antd';
import { fetchToken, onMessageListener } from '../firebase.js';

function App() {
    const [isTokenFound, setTokenFound] = useState(false);
    fetchToken(setTokenFound);


    onMessageListener().then(payload => {
        console.log(payload);
        notification.open({
            message: payload.notification.title,
            description: payload.notification.body,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }).catch(err => console.log('failed: ', err));


    return (
        <div className="App">
            <header className="App-header">
                {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
                {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
            </header>
        </div>
    )
}

export default App;