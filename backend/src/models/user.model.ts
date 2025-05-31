import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const db = new PrismaClient();

export async function CreateUser(email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      UserEmail: email,
      UserPassword: hash,
      Username: email,
      UserProfilePic: 'Men1',
    },
  });
  return user.UserId;
}

export async function fetchUser(userid: number) {
  const profile = await db.user.findUnique({
    where: {
      UserId: userid,
    },
  });

  return profile;
}

export async function updateProfile(
  userid: number,
  data: {
    NewName?: string;
    NewEmail?: string;
    NewPicture?: string;
  }
) {

  const updateData: any = {};

  if (data.NewName) {
    updateData.UserName = data.NewName;
  }
  if (data.NewEmail) {
    updateData.User_Email = data.NewEmail;
  }
  if (data.NewPicture) {
    updateData.User_picture = data.NewPicture;
  }

  await db.user.update({
    where: {
      UserId: userid,
    },
    data: updateData,
  });
}

export async function deleteUser(userid: number) {

  const deletedUser = await db.user.delete({
    where: { UserId: userid },
  });

  return deletedUser;
}
