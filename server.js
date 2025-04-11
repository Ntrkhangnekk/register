const token = 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; // <== Thay bằng token bạn vừa tạo
const repo = ntrkhangnek/register; // <== Thay bằng tên thật repo bạn tạo
const filename = "register.json";

async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.getElementById("message");

  if (!username || !password) {
    messageBox.innerText = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const data = await res.json();
    const content = atob(data.content);
    const json = JSON.parse(content);

    if (json[username]) {
      messageBox.innerText = "Tài khoản đã tồn tại!";
      return;
    }

    json[username] = { password }; // Có thể dùng bcrypt để hash mật khẩu

    const update = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Thêm user ${username}`,
        content: btoa(JSON.stringify(json, null, 2)),
        sha: data.sha
      })
    });

    if (update.ok) {
      messageBox.innerText = "Đăng ký thành công!";
    } else {
      messageBox.innerText = "Lỗi khi ghi file!";
    }

  } catch (err) {
    console.error(err);
    messageBox.innerText = "Đã xảy ra lỗi kết nối!";
  }
}
