import { Entity, Column, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, BacklogTask, Iteration, Project } from '.';
import { EBacklogStatus } from 'src/app/enums/backlog-status.enum';

@Entity({ name: 'backlog_item' })
export class BacklogItem extends AbstractEntity<BacklogItem> {
  @Column()
  name: string;

  @Column({
    name: 'description',
    default: '',
  })
  description: string;

  @Column({
    name: 'status',
    default: EBacklogStatus.UNDONE,
  })
  status: EBacklogStatus;

  // Relations
  @ManyToOne(() => Project, (prj) => prj.backlog, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  @ManyToOne(() => Iteration, (itr) => itr.backlog, {
    nullable: true,
  })
  iteration: Iteration;

  @OneToMany(() => BacklogTask, (blt) => blt.backlogItem)
  tasks: BacklogTask[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('BLI', this.id);
  }
}
