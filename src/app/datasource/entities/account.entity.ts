import { Entity, Column, ManyToMany, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity } from './abstract.entity';
import { Exclude } from 'class-transformer';
import { Program } from './program.entity';
import { ProjectMember } from './project-member.entity';

@Entity({ name: 'account' })
export class Account extends AbstractEntity<Account> {
  @Column()
  displayName: string;

  @Column({
    name: 'username',
    nullable: false,
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  // Relations
  @ManyToMany(() => Program, (prg) => prg.members)
  memberOfPrograms: Program[];

  @ManyToMany(() => Program, (prg) => prg.participants)
  participantOfPrograms: Program[];

  @OneToMany(() => ProjectMember, (mem) => mem.account)
  projectsMembers: ProjectMember[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('ACC', this.id);
  }
}
