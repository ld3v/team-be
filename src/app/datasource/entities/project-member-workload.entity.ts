import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, Project, ProjectMember } from '.';

@Entity({ name: 'member_workload' })
export class MemberWorkload extends AbstractEntity<MemberWorkload> {
  @Column()
  name: string; // Ex, "2023-W01"

  @Column({
    name: 'load',
    default: 0,
  })
  load: number;

  // Relations
  @ManyToOne(() => ProjectMember, (mem) => mem.workloads, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  member: ProjectMember;

  @ManyToOne(() => Project, (prj) => prj.membersWorkloads, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('PRJ-MEM-WLA', this.id);
  }
}
