import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../src/infrastructure/utils/prisma";

async function main() {
  try {
      const hashed_password = await Bun.password.hash("@password12", "bcrypt");
    await prisma.user.create({
        data : {
            email : "admin@ex.com",
            name: "admin",
            password: hashed_password,
            phone_number: "99237404852",
            is_verified: true,
            role: "Admin",
        }
    })
    console.log("successfully seeding data employee type");

    
  } catch (error) {
   if(prisma instanceof PrismaClientKnownRequestError){
    console.log(error)
   }
  } finally {
    prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to seed database:");
  console.error(error);
  process.exit(1);
});
