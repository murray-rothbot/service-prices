import { Column, Model, Table, DataType } from 'sequelize-typescript'

@Table
export class AlertPrice extends Model {
  @Column(DataType.TEXT({ length: 'medium' }))
  webhookUrl: string

  @Column
  currency: string

  @Column(DataType.FLOAT())
  currentPrice: number

  @Column(DataType.FLOAT())
  price: number

  @Column
  above: boolean

  @Column
  active: boolean
}
