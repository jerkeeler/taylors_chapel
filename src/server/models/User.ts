import { Table, Column, Model, AutoIncrement, PrimaryKey, Unique, DataType,
  CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
class User extends Model<User> {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Unique
  @Column(DataType.STRING)
  token: string;

  @Column(DataType.STRING)
  displayName: string;

  @Unique
  @Column(DataType.STRING)
  googleID: string;

  @Column(DataType.BOOLEAN)
  isAdmin: boolean;

}

export { User };
