import { Column, Model, Table } from 'sequelize-typescript';

@Table
export default class Car extends Model<Car> {
  @Column
  type: string;

  @Column
  fasecolda: string;

  @Column
  brand: string;

  @Column
  model: string;

  @Column
  details: string;
}
