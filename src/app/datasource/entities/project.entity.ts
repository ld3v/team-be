import { Entity, Column, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import { Program } from 'src/app/datasource/entities/program.entity';
import { AbstractEntity } from './abstract.entity';
import { Iteration } from './iteration.entity';
import { Member } from './member.entity';
import { BacklogItem } from './backlog-item.entity';
import { Workload } from './workload.entity';

@Entity({ name: 'project' })
export class Project extends AbstractEntity<Project> {
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
  @ManyToOne(() => Program, (program) => program.projects, {
    onDelete: 'CASCADE',
  })
  program: Program;

  @OneToMany(() => Iteration, (itr) => itr.project)
  iterations: Iteration[];

  @OneToMany(() => BacklogItem, (bli) => bli.project)
  backlog: BacklogItem[];

  @OneToMany(() => Member, (mem) => mem.project)
  members: Member[];

  @OneToMany(() => Workload, (wla) => wla.project)
  workloads: Workload[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('PRJ', this.id);
  }
}
