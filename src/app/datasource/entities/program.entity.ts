import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  JoinTable,
} from 'typeorm';
import { Project } from 'src/app/datasource/entities/project.entity';
import generateId from 'common/gen-id';
import { Account } from './account.entity';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'program' })
export class Program extends AbstractEntity<Program> {
  @Column()
  name: string;

  @Column({
    name: 'description',
    default: '',
  })
  description: string;

  @Column({
    name: 'review',
    default: '',
  })
  review: string;

  // Relations
  @OneToMany(() => Project, (prj) => prj.program)
  projects: Project[];

  @ManyToMany(() => Account, (acc) => acc.memberOfPrograms)
  @JoinTable()
  members: Account[];

  @ManyToMany(() => Account, (acc) => acc.participantOfPrograms)
  @JoinTable()
  participants: Account[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('PRG', this.id);
  }
}
