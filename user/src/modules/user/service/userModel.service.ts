import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("pk_user", ["idUser"], { unique: true })
@Entity("user", { schema: "public" })
export class UserModelService {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id_user" })
  idUser: string;

  @Column("text", { name: "user_name", nullable: true })
  userName: string | null;

  @Column("text", { name: "profile_url", nullable: true })
  profileUrl: string | null;

  @Column("text", { name: "theme", nullable: true })
  theme: string | null;

  @Column("boolean", { name: "ads", nullable: true })
  ads: boolean | null;

  @Column("text", { name: "email", nullable: true })
  email: string | null;

  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @Column("text", { name: "level", nullable: true, array: true })
  level: string[] | null;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}