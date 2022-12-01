import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slash_account')
export class SlashAccount {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('varchar', { nullable: false, name: 'user_id' })
  userId: string;

  @Column('varchar', { nullable: false, name: 'user_name' })
  userName: string;

  @Column('text', { nullable: true, name: 'github_token' })
  githubToken: string;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string | null;
}
