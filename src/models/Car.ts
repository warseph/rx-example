import { Column, Model, Table } from 'sequelize-typescript';

@Table
export default class Car extends Model<Car> {
  @Column({ primaryKey: true })
  id: string;

  @Column
  type: string;

  @Column
  brand: string;

  @Column
  model: string;

  @Column
  details: string;
}
