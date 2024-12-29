import type { User } from "@prisma/client";

export class UserDTO {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  fromEntity() {
    return {
      user_id: this.user.user_id,
      name: this.user.name,
      phone_number: this.user.phone_number,
      email: this.user.email,
      role: this.user.role,
      isOnline: this.user.isOnline,
    };
  }
}
