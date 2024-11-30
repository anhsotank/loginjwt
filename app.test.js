const request = require("supertest");
const app = require("./routes/auth");

describe("Login API", () => {
  // Kiểm tra trường hợp đăng nhập thành công
  it("truong hop đang nhap thanh cong", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(200); // Kiểm tra mã trạng thái HTTP
    expect(response.body).toHaveProperty("token"); // Kiểm tra xem có token trong phản hồi
  });

  // Kiểm tra trường hợp đăng nhập thất bại
  it(" truong hop đang nhap that bai", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(response.status).toBe(401); // Kiểm tra mã trạng thái HTTP
    expect(response.body).toHaveProperty("message", "Unauthorized"); // Kiểm tra thông báo lỗi
  });
});
