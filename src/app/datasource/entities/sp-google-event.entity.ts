import { Entity, Column, BeforeInsert } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity } from '.';

@Entity({ name: 'sp_google_event' })
export class SPGoogleEvent extends AbstractEntity<SPGoogleEvent> {
  @Column()
  googleEventId: string;

  @Column()
  googleEventRecurringId: string;
  @Column()
  googleEventName: string;

  @Column({
    default: '',
  })
  googleEventDescription: string;

  @Column()
  googleEventStartedAt: Date;

  @Column()
  googleEventFinishedAt: Date;

  @Column({
    default: '',
  })
  googleEventMeetingKey: string;

  @Column({
    default: '[]',
  })
  members: string;

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('SP_GEvent', this.id);
  }
}
