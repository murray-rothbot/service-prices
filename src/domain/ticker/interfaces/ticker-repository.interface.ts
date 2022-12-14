import { TickerRequestDto, TickerResponseDto } from '../dto'

export interface ITickerRepository {
  source: string
  baseUrl: string
  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto>
}
