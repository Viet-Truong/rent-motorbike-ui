/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.module.scss';

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

export {};
declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}
