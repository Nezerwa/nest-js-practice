import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  price: number;
}
