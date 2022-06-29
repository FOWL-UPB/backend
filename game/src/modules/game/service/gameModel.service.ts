import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_game", ["idGame"], { unique: true })
@Entity("game", { schema: "public" })
export class GameModelService {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id_game" })
  idGame: string;

  @Column("text", { name: "players", nullable: true, array: true })
  players: string[] | null;

  @Column("boolean", { name: "is_multiplayer", nullable: true })
  isMultiplayer: boolean | null;

  @Column("text", { name: "board", nullable: true })
  board: string | null;

  @Column("text", { name: "status", nullable: true })
  status: string | null;

  @Column("text", { name: "winner_id", nullable: true })
  winnerId: string | null;

  @Column("timestamp without time zone", { name: "date_game", nullable: true })
  dateGame: Date | null;
}
