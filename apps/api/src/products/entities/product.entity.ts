import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text' )
  title: string;

  @Column({ nullable: true } )
  description: string

  @Column('int', {default: 0})
  stocks: number

  @Column("simple-array")
  size: string[]

  @Column('text' )
  gender: string;

  @Column('int' )
  price: number;

}