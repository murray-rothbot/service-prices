type FRR = number
type BID = number
type BID_PERIOD = number
type BID_SIZE = number
type ASK = number
type ASK_PERIOD = number
type ASK_SIZE = number
type DAILY_CHANGE = number
type DAILY_CHANGE_RELATIVE = number
type LAST_PRICE = number
type VOLUME = number
type HIGH = number
type LOW = number
type FRR_AMOUNT_AVAILABLE = number

export type IBitfinexTicker = [
  FRR,
  BID,
  BID_PERIOD,
  BID_SIZE,
  ASK,
  ASK_PERIOD,
  ASK_SIZE,
  DAILY_CHANGE,
  DAILY_CHANGE_RELATIVE,
  LAST_PRICE,
  VOLUME,
  HIGH,
  LOW,
  FRR_AMOUNT_AVAILABLE,
]
