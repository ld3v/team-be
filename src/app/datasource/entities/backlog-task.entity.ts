import { Entity, Column, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, BacklogItem, Member } from '.';
import { ETaskStatus } from 'src/app/enums';

@Entity({ name: 'backlog_task' })
export class BacklogTask extends AbstractEntity<BacklogTask> {
  @Column()
  // Ex, "Handle logic to submit data from form to backend"
  name: string;

  @Column({
    default: 0,
  })
  timeEstimated: number;

  @Column()
  dueDate: Date;

  @Column({
    name: 'status',
    default: ETaskStatus.UNDONE,
  })
  status: ETaskStatus;

  @Column()
  content: string;

  // Relations
  @ManyToOne(() => Member, (mem) => mem.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  pic: Member;

  @ManyToOne(() => BacklogItem, (bli) => bli.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  backlogItem: BacklogItem;

  @OneToMany(() => TaskLog, (log) => log.task)
  logs: TaskLog[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('TSK', this.id);
  }
}

@Entity({ name: 'task_log' })
export class TaskLog extends AbstractEntity<TaskLog> {
  @Column()
  message: string;

  @Column()
  timeSpent: number;

  @Column()
  date: Date;

  // Relations
  @ManyToOne(() => BacklogTask, (blk) => blk.logs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  task: BacklogTask;

  @ManyToOne(() => Member, (mem) => mem.logs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  member: Member;

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('TSK_LOG', this.id);
  }
}
