import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, BacklogItem, ProjectMember } from '.';
import { ETaskStatus } from 'src/app/enums';

@Entity({ name: 'backlog_task' })
export class BacklogTask extends AbstractEntity<BacklogTask> {
  @Column()
  // Ex, "Handle logic to submit data from form to backend"
  name: string;

  @Column({
    name: 'hours',
    default: 0,
  })
  // Ex, time spent to handle this task.
  hours: number;

  @Column({
    name: 'status',
    default: ETaskStatus.UNDONE,
  })
  status: ETaskStatus;

  @Column()
  content: string;

  // Relations
  @ManyToOne(() => ProjectMember, (mem) => mem.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  member: ProjectMember;

  @ManyToOne(() => BacklogItem, (bli) => bli.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  backlogItem: BacklogItem;

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('TSK', this.id);
  }
}
