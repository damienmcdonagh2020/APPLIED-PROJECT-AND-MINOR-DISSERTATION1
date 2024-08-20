// src/declarations.d.ts or any .ts file in your types directory

declare global {
    interface Window {
      updateIntervalData: (selectedInterval: string) => void;
    }
  }
  
  export {};
  