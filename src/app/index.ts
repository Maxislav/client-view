import { hash } from './hash';
import { evenMap, socket } from "./socket";
import { TYPE_EVENTS } from './enum';
let myWs: WebSocket;
socket.state = 0;
const wsConnect = () => {
  let intervalId: number;
  if(myWs){
    return;
  }
  myWs = new WebSocket('ws://localhost:3001');
  const removeEvents = () => {
    myWs.removeEventListener('error', wsError);
    myWs.removeEventListener('message', wsMessage);
    intervalId && clearInterval(intervalId);
    myWs = null;
  };
  const reconnect = () => {
    setTimeout(() => {
      console.info('trying to connect');
      wsConnect();
    }, 1000)

  };
  const wsMessage = (d: MessageEvent<any>) => {
    let message: {
      action: TYPE_EVENTS,
      data: {
        name: string,
        data: any,
      }
    };
    try {
      message =  JSON.parse(d.data)
    }catch (e) {
      console.error(e)
    }
    if(message.action === TYPE_EVENTS.MESSAGE){
      evenMap[message.data.name]?.forEach(cb => {
        cb(message.data.data, null)
      });
    }
    // console.log(message)
  };

  const wsClose = () => {
    socket.state = 2;
    console.info('ws closed');
    removeEvents();
    reconnect()
  };
  myWs.onopen = function () {
    console.log('ws connected');
    socket.state = 1;
    myWs.send(JSON.stringify({ action: 'CONNECTED', data: 'connected' }));
    intervalId = window.setInterval(() => {
      try {
        if (myWs.readyState === 1) {
          myWs.send(JSON.stringify({ action: 'PING', data: hash(2) }));
        } else {
          removeEvents();
          reconnect()
        }
      } catch (e) {
        console.error('catch error->', e);
        removeEvents();
        reconnect();
      }
    }, 20000);
  };
  myWs.addEventListener('message', wsMessage);
  myWs.addEventListener('error', wsError);
  myWs.addEventListener('close', wsClose);
};

function wsError(e: Event) {
  console.error('error event->', e);
  this.removeEventListener('error', wsError);
  setTimeout(() => {
    wsConnect()
  }, 20000)
}

wsConnect();
