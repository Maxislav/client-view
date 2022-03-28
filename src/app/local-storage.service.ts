export class LocalStorageService {
    appName = 'app-user-view'

    constructor() {
    }

    getLocalStorageId(): string {
        return localStorage.getItem(this.appName)
    }

    setLocalStorageId(value: string) {
        localStorage.setItem(this.appName, value)
    }
}
