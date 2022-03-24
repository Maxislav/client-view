export function autobind() {
  return (target: any, key: string, descriptor: any) => {
    let fn = descriptor.value;
    let definingProperty = false;
    return {
      configurable: true,
      get() {
        const boundFn = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          get() {
            return boundFn;
          },
          set(value: any) {
            fn = value;
            delete this[key];
          }
        });
        definingProperty = false;
        return boundFn;
      },
      set(value: any) {
        fn = value;
      }
    };
  };

}
