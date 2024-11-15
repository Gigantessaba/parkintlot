import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ParkingSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  isOccupied: boolean;

  @Column('jsonb')
  location: {
    lat: number;
    lng: number;
  };

  @Column('jsonb')
  dimensions: {
    length: number;
    width: number;
  };

  @Column('jsonb')
  amenities: {
    electric: boolean;
    water: boolean;
    security: boolean;
  };

  @Column()
  sensorId: string;

  @Column()
  lastUpdated: Date;
}