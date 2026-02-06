import bcrypt from "bcrypt";

const hash = "$2b$10$0Hxt1Wq5e/6sYsS8QOlEj.Rw.uOKGP83zJiIWsFpQWuZMt9SbIigq";

console.log(await bcrypt.compare("Divyansh@123", hash));
