// Minimal polyfills for Node.js globals in browser environment

// Only add global if it doesn't exist
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// Ensure process is available
if (typeof process === 'undefined') {
  (window as any).process = {
    env: {},
    nextTick: (callback: Function) => setTimeout(callback, 0),
    version: '',
    platform: 'browser',
  };
}

// Ensure Buffer is available (if needed)
if (typeof Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: () => false,
    from: (data: any) => new Uint8Array(data),
  };
}

export {}; 