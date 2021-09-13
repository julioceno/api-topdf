import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn  } from "typeorm";
import { v4 as uuid } from "uuid";

import bcrypt from "bcryptjs";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  password_reset_token: string;

  @Column()
  password_reset_expires: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn() 
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  };
  
  @BeforeInsert()
  hashId() {
    this.id = uuid()
  };
}

export { User };