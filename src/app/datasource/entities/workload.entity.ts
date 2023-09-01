import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, Project, Member } from '.';

@Entity({ name: 'workload' })
export class Workload extends AbstractEntity<Workload> {
  @Column()
  name: string; // Ex, "2023-W01"

  @Column({
    name: 'load',
    default: 0,
  })
  load: number;

  // Relations
  @ManyToOne(() => Member, (mem) => mem.workloads, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  member: Member;

  @ManyToOne(() => Project, (prj) => prj.workloads, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('WLA', this.id);
  }
}
