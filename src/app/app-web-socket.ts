import { hash } from './hash';
import { EAction, IData } from './types';
import {
    catchError,
    delay,
    interval,
    lastValueFrom,
    Observable,
    of,
    ReplaySubject,
    Subject,
    takeUntil,
    timeout
} from 'rxjs';
import { autobind } from './decorator/autobind';
import { LocalStorageService } from './local-storage.service';

let i = 0;

export class AppWebSocket extends WebSocket {

    public readonly created$: ReplaySubject<boolean> = new ReplaySubject(1);
    public readonly onDestroy$ = new Subject();

    private readonly pathMap: { [path: string]: Array<(d: IData<any>) => void> } = {};
    private readonly id: number = i++;
    private readonly localStorageService: LocalStorageService = new LocalStorageService();

    constructor(url: string) {
        super(url);
        this.addEventListener('close', this.wsClose)
        this.addEventListener('message', this.message)
        this.addEventListener('open', this.wsInit)
        this.addEventListener('error', this.wsError)
    }

    async wsRegistration() {
        this.get$('get-local-id', { myLocalStorageId: this.localStorageService.getLocalStorageId() })
            .subscribe({
                next: (d) => {
                    console.log(d)
                },
                error: (err) => {
                    console.error(err)
                }
            })
    }

    @autobind()
    wsError() {
        console.log('connection err', this.id)
        this.wsDestroy()
    }

    @autobind()
    async wsInit() {
        console.log('connected', this.id)
        this.created$.next(true)
        this.created$.complete()
        await lastValueFrom(of(void 0).pipe(delay(50), takeUntil(this.onDestroy$)))
        this.send$<string>({
            action: EAction.CONNECTED, data: {
                hash: hash(2),
                message: '',
                path: ''
            }
        })
        this.ping();

        this.wsRegistration()
    }

    private ping() {
        interval(5000)
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
    wsClose(e?: any) {
        console.log('closed', this.id, e);
        this.wsDestroy()
    }

    @autobind()
    wsDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }

    @autobind()
    message(m: MessageEvent) {
        let ssData: IData<any>
        try {
            ssData = JSON.parse(m.data)
        } catch (e) {
            console.error(e)
        }
        if (ssData.action === EAction.MESSAGE) {
            console.log(ssData)
            const path = ssData.data.path
            if (this.pathMap[path]) {
                this.pathMap[path].forEach(cb => {
                    cb(ssData)
                })
            }
        }
    }


    send$<T>(data: IData<T>): this {
        super.send(JSON.stringify(data))
        return this
    }

    private addEventPath(path: string, cb: (d: IData<any>) => void) {
        if (!this.pathMap[path]) {
            this.pathMap[path] = []
        }
        this.pathMap[path].push(cb)
    }


    private get$(path: string, message: any): Observable<any> {
        const h = hash(10)


        return new Observable((subscriber) => {
            const cb = (d: IData<any>) => {
                const resPath = d.data.path
                const resHash = d.data.hash
                if (resPath === path && resHash === h) {
                    subscriber.next(d.data.message);
                    const i = this.pathMap[path].indexOf(cb)
                    this.pathMap[path].splice(i, 1)
                    subscriber.complete()
                }
            }
            of(void 0).pipe(delay(10000))
                .subscribe(d => {
                    const i = this.pathMap[path].indexOf(cb)
                    this.pathMap[path].splice(i, 1);
                    subscriber.error(`Error by path: ${path} - By timeout`)
                })
            this.addEventPath(path, cb)
            this.send$({
                action: EAction.MESSAGE,
                data: {
                    path,
                    message,
                    hash: h,
                }
            })
        })

    }
}
