import { Table, Column, Model, AutoIncrement, PrimaryKey, Unique, DataType,
  CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
class Contact extends Model<Contact> {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  message: string;

  @Column(DataType.TEXT)
  name: string;

}

export { Contact };
