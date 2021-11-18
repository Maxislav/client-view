interface MojSocket {
    state: 0 | 1 | 2,
    on: (eName: string, cb: (data: any, e: Error) => void) => MojSocket;
    off: (eName: string, cb?: (data: any, e: Error) => void) => MojSocket;
}

interface Window {
    mojSocket: MojSocket;
    widget: {
        init: (selector: Element) => void
    }
}
