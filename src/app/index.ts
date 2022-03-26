import { hash } from './hash';
import { evenMap, socket } from "./socket";
import { TYPE_EVENTS } from './enum';
import { AppWebSocket } from './app-web-socket';
import { EAction } from './types';
import { delay, interval, lastValueFrom, switchMap, takeUntil, takeWhile, tap, timeout } from 'rxjs';

let myWs: AppWebSocket;
socket.state = 0;


const wsConnect = async () => {
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
};

function wsError(e: Event) {
    console.error('error event->', e);
    this.removeEventListener('error', wsError);
    setTimeout(() => {
        wsConnect()
    }, 20000)
}

wsConnect();
