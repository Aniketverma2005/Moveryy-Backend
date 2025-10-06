import bcrypt from 'bcrypt';

(async () => {
  const password = 'JoeRoot@123';
  const hash = await bcrypt.hash(password, 10);
  console.log("New hash:", hash);
})();
