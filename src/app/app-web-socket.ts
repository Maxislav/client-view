import { hash } from './hash';
import { EAction, IData } from './types';
import { interval, Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { autobind } from './decorator/autobind';

export class AppWebSocket extends WebSocket {
    dd: any = {};
    created$: ReplaySubject<boolean> = new ReplaySubject(1)
    onDestroy$ = new Subject()

    constructor(url: string) {
        super(url);
        this.addEventListener('message', this.message)
        this.addEventListener('open', this.wsInit)
        this.addEventListener('close', this.wsDestroy)
        this.addEventListener('error', this.wsError)
    }

    wsError() {
        this.wsDestroy()
    }

    @autobind()
    wsInit() {
        console.log('connected')
        this.created$.next(true)
        this.created$.complete()
        this.send$<string>({
            action: EAction.CONNECTED, data: {
                hash: hash(2),
                message: '',
                path: ''
            }
        })
        interval(2000)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.send$<string>({
                    action: EAction.PING,
                    data: {
                        hash: hash(10),
                        message: '',
                        path: ''
                    }
                })
            })
    }

    @autobind()
    wsDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()

    }

    @autobind()
    message(m: MessageEvent) {
        let message: IData<any>
        try {
            message = JSON.parse(m.data)
        } catch (e) {
            console.error(e)
        }
        if (message.action === EAction.MESSAGE) {
            console.log(message)
        }
    }


    send$<T>(data: IData<T>): this {
        super.send(JSON.stringify(data))
        return this
    }

    private addEventPath(path: string, cb: () => void) {
        if (!this.dd[path]) {
            this.dd[path] = (d: any) => {

            }
        }
        // this.dd[path].push(cb)
    }


    get$(path: string, data: any): Observable<any> {

        return new Observable((subscriber) => {
            const cb = () => {

            }
            this.addEventPath(path, cb)
            this.send$({
                action: EAction.MESSAGE,
                data: {
                    path,
                    message: data,
                    hash: hash(10),
                }
            })
        })

    }
}
