class LocalStorageService {
    appName = 'app-user-view'

    constructor() {
    }

    getLocalStorageId(): string {
        return localStorage.get(this.appName)
    }

    setLocalStorageId(value: string) {
        localStorage.setItem(this.appName, value)
    }
}
