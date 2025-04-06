<?php
// Kết nối CSDL
$conn = new mysqli("localhost", "user", "password", "authme");
if ($conn->connect_error) die("Lỗi kết nối DB");

// Lấy dữ liệu từ form
$username = $_POST['username'];
$password = $_POST['password'];
$ip = $_SERVER['REMOTE_ADDR'];

// Kiểm tra IP đã tạo bao nhiêu tài khoản
$stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE regip = ?");
$stmt->bind_param("s", $ip);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count >= 2) {
    echo "Bạn đã đăng ký quá giới hạn 2 tài khoản từ cùng một IP.";
    exit;
}

// Hash mật khẩu kiểu AuthMe (bcrypt)
$hash = password_hash($password, PASSWORD_BCRYPT);

// Thêm tài khoản vào CSDL AuthMe
$stmt = $conn->prepare("INSERT INTO users (username, password, regdate, regip) VALUES (?, ?, UNIX_TIMESTAMP(), ?)");
$stmt->bind_param("sss", $username, $hash, $ip);
if ($stmt->execute()) {
    echo "Đăng ký thành công! Hãy vào game và dùng lệnh /login để đăng nhập.";
} else {
    echo "Lỗi: Có thể tên đã tồn tại.";
}
$stmt->close();
$conn->close();
?>
