declare module 'cloudflare:sockets' {
  interface Socket {
    readable: ReadableStream<Uint8Array>
    writable: WritableStream<Uint8Array>
    startTls(): Socket
    close(): Promise<void>
  }

  interface SocketOptions {
    secureTransport?: 'off' | 'on' | 'starttls'
    allowHalfOpen?: boolean
  }

  function connect(
    address: { hostname: string; port: number },
    options?: SocketOptions,
  ): Socket

  export { connect }
}
