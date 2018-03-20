import { Table, Column, Model, AutoIncrement, PrimaryKey, Unique, DataType,
  CreatedAt, UpdatedAt} from 'sequelize-typescript';

@Table
class Photo extends Model<Photo> {

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
  ext: string;

  @Column(DataType.BOOLEAN)
  favorite: boolean;

  getFullUrl(): string {
    return `/static/photos/photo-${this.token}${this.ext}`;
  }

  getThumbUrl(): string {
    return `/static/photos/photo-${this.token}-thumb${this.ext}`;
  }
}

export { Photo };
