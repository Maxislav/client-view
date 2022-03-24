import { hash } from './hash';
import { evenMap, socket } from "./socket";
import { TYPE_EVENTS } from './enum';
import { AppWebSocket } from './app-web-socket';
import { EAction } from './types';
import { interval, lastValueFrom, switchMap, takeUntil, takeWhile, tap } from 'rxjs';

let myWs: AppWebSocket;
socket.state = 0;


const wsConnect = () => {
    let intervalId: number;
    if (myWs) {
        return;
    }
    myWs = new AppWebSocket('ws://localhost:3001');
    lastValueFrom(myWs.created$)
        .then(() => {
            socket.state = 1;
        })
    lastValueFrom(myWs.onDestroy$)
        .then(() => {
            socket.state = 2;
            myWs = null;
            setTimeout(() => {
                wsConnect()
            }, 2000)
        })
    /*myWs.created$
        .pipe(
            tap(() => {
                socket.state = 1
            }),
            switchMap(() => {
               return interval(2000)
            }),
            takeUntil(myWs.onDestroy$)
        )
        .subscribe(() => {

        })*/

    /*.subscribe((d) => {
        if(d){

        }else {
            socket.state = 2;
            myWs = null;
            setTimeout(() => {
                wsConnect();
            }, 5000)
        }

    })*/

    /*/!* myWs.get$('hash', 'ololo')
         .subscribe(d => {
             console.log(d)
         })*!/
     const removeEvents = () => {
         myWs.removeEventListener('error', wsError);
         // myWs.removeEventListener('message', wsMessage);
         intervalId && clearInterval(intervalId);
         myWs = null;
     };
     const reconnect = () => {
         setTimeout(() => {
             console.info('trying to connect');
             wsConnect();
         }, 1000)
     };*/
    const wsMessage = (d: MessageEvent<any>) => {
        /*let message: {
          action: EAction,
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
        if(message.action === EAction.MESSAGE){
          evenMap[message.data.name]?.forEach(cb => {
            cb(message.data.data, null)
          });
        }*/
    };

    /*const wsClose = () => {
        socket.state = 2;
        console.info('ws closed');
        removeEvents();
        reconnect()
    };*/
    /*myWs.onopen = function () {
        console.log('ws connected');
        socket.state = 1;
        myWs.send$<string>({ action: EAction.CONNECTED, data: {
                hash: hash(2),
                message: '',
                path: ''
            } });


        intervalId = window.setInterval(() => {
            try {
                if (myWs.readyState === 1) {
                    myWs.send$<string>({
                        action: EAction.PING,
                        data: {
                            hash: hash(10),
                            message: '',
                            path: ''
                        }
                    });
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
    };*/
    // myWs.addEventListener('message', wsMessage);
    // myWs.addEventListener('error', wsError);
    // myWs.addEventListener('close', wsClose);
};

function wsError(e: Event) {
    console.error('error event->', e);
    this.removeEventListener('error', wsError);
    setTimeout(() => {
        wsConnect()
    }, 20000)
}

wsConnect();
