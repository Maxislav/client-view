export const evenMap: {
  [name: string]: Array<(data: any, err: Error) => void>
} = {};

window.mojSocket = {
  state: 0,
  on: (eName: string, cb) => {
    if (!evenMap[eName]) {
      evenMap[eName] = [];
    }
    evenMap[eName].push(cb);
    return this;
  },
  off: (eName, cb = null) => {
    if (!evenMap[eName]) {
      return this;
    }
    if (cb) {
      const index = evenMap[eName].findIndex(_cb => _cb === cb);
      if (-1 < index) {
        evenMap[eName].slice(index, 1);
      }
    } else {
      evenMap[eName].length = 0
    }
    return this;
  }
};

export const socket = window.mojSocket;
