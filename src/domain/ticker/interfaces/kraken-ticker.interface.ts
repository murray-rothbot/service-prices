export type IKrakenTicker = {
  error: []
  result: {
    string: {
      a: [number, number]
      b: [number, number]
      c: [number, number]
      v: [number, number]
      p: [number, number]
      t: [number, number]
      l: [number, number]
      h: [number, number]
      o: number
    }
  }
}
