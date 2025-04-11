const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = './register.json';
let users = fs.existsSync(FILE_PATH) ? JSON.parse(fs.readFileSync(FILE_PATH)) : {};

app.post('/register', (req, res) => {
  const { username, password, confirm } = req.body;

  if (!username || !password || !confirm)
    return res.status(400).send('Vui lòng điền đầy đủ thông tin!');
  if (password !== confirm)
    return res.status(400).send('Mật khẩu không trùng khớp!');
  if (users[username])
    return res.status(409).send('Tài khoản đã tồn tại!');

  users[username] = { password };
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
  res.send('Đăng ký thành công!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API đang chạy tại http://localhost:${PORT}`));
