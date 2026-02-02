const db = require("@/config/database");

const User = {
  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.execute(sql);
  },

  async create(name, email) {
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    const [result] = await db.execute(sql, [name, email]);
    return result;
  },

  async findById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  async findAll() {
    const sql = "SELECT * FROM users";
    const [rows] = await db.execute(sql);
    return rows;
  },
};

module.exports = User;
