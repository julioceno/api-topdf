import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  BeforeInsert, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  JoinColumn
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "../models/User";

@Entity("pdfs")
class Pdf {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @ManyToOne( () => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  name: string;

  @Column()
  pdf_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn() 
  updated_at: Date;
  
  @BeforeInsert()
  hashId() {
    this.id = uuid()
  };
}

export { Pdf };