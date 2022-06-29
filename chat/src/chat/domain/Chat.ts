import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm" ;

@Index("chat_pkey", ["id"], { unique: true })
@Entity("chat", { schema: "public" })
export class Chat {
  @PrimaryGeneratedColumn({ type: "integer", name: "id"  })
  id: number;

  @Column("integer", { name: "id_sender", nullable: true })
  idSender: number | null;

  @Column("integer", { name: "id_game", nullable: true })
  idGame: number | null;

  @Column("character varying", {
    name: "message_sended",
    nullable: true,
    length: 1000,
  })
  messageSended: string | null;

  @Column("timestamp without time zone", { name: "date", nullable: true })
  date: Date | null;
}
