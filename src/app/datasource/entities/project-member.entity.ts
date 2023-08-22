import { Entity, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import {
  AbstractEntity,
  Project,
  MemberWorkload,
  BacklogTask,
  Account,
} from '.';

@Entity({ name: 'project_member' })
export class ProjectMember extends AbstractEntity<ProjectMember> {
  // Relations
  @ManyToOne(() => Project, (itr) => itr.members, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  @ManyToOne(() => Account, (acc) => acc.projectsMembers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  account: Account;

  @OneToMany(() => MemberWorkload, (wla) => wla.member)
  workloads: MemberWorkload;

  @OneToMany(() => BacklogTask, (blt) => blt.member)
  tasks: BacklogTask[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('PRJ-MEM', this.id);
  }
}
