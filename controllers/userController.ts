import {userModel, type User} from "../models/userModel";

function getUserByEmailIdAndPassword(email: string, password: string): User | null {
  try {
    const user = userModel.findOne(email);
    return isUserValid(user, password) ? user : null;
  } catch {
    return null;
  }
}

function getUserById(id: number): User | null {
  try {
    return userModel.findById(id);
  } catch {
    return null;
  }
}

function isUserValid(user: User, password: String):Boolean {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById,
};
