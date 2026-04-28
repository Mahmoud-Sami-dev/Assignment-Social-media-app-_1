// methods class
// dependency injection >> service >> object
// signup & reset password >> hash
// login >> Compare
import * as bcrypt from "bcrypt";
/**
 * 
 * @param password plaintext password 
 * @returns hashed value
 */
export async function hash(password: string) {
  //use hash not hashSync because hashSync it works on main thread
  return bcrypt.hash(password, 10);
}
/**
 * 
 * @param password which come from FE[end user]
 * @param hashedPassword which come from DB
 * @returns Promise of boolean 
 */
export async function compare(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
