import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'provider_id',
  })
  providerId: string;

  @Column('timestamp with time zone')
  date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'id' })
  provider: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}

export default Appointment;
