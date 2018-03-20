import { Table, Column, Model, PrimaryKey, Unique, DataType } from 'sequelize-typescript';

@Table
class Session extends Model<Session> {

  @PrimaryKey
  @Unique
  @Column(DataType.STRING)
  sid: string;

  @Column(DataType.DATE)
  expires: Date

  @Column(DataType.TEXT)
  data: string

}

export { Session };
