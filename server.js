const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const ACC_FILE = './accounts.json';

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send("Thiếu thông tin!");

  const hashed = crypto.createHash('sha256').update(password).digest('hex');

  let db = {};
  if (fs.existsSync(ACC_FILE)) {
    db = JSON.parse(fs.readFileSync(ACC_FILE));
  }

  if (db[username]) return res.send("Tài khoản đã tồn tại!");

  db[username] = hashed;
  fs.writeFileSync(ACC_FILE, JSON.stringify(db, null, 2));
  res.send("Đăng ký thành công! Giờ vào Minecraft gõ: /login mật_khẩu");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
