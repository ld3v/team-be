import { Entity, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import {
  AbstractEntity,
  Project,
  BacklogTask,
  Account,
  Workload,
  TaskLog,
} from '.';

@Entity({ name: 'member' })
export class Member extends AbstractEntity<Member> {
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

  @OneToMany(() => Workload, (wla) => wla.member)
  workloads: Workload[];

  @OneToMany(() => BacklogTask, (blt) => blt.pic)
  tasks: BacklogTask[];

  @OneToMany(() => TaskLog, (log) => log.member)
  logs: TaskLog[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('MEM', this.id);
  }
}
