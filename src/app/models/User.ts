import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate,  } from "typeorm";
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

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    console.log("Encriptando ")
    this.password = bcrypt.hashSync(this.password, 10)
  };

  constructor() {
    if (this.id) {
      this.id = uuid()
    }
  }
}

export { User };