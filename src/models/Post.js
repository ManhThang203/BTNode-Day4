const db = require("@/config/database");

const Post = {
  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await db.execute(sql);
  },

  async create(userId, title, content) {
    const sql = "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [userId, title, content]);
    return result;
  },

  async findById(id) {
    const sql = "SELECT * FROM posts WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  async findByUserId(userId) {
    const sql =
      "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC";
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  },

  async findAll() {
    const sql = "SELECT * FROM posts ORDER BY created_at DESC";
    const [rows] = await db.execute(sql);
    return rows;
  },

  async findAllWithPagination(page = 1, limit = 20, userId = null) {
    const offset = (page - 1) * Math.min(limit, 500);
    const maxLimit = Math.min(limit, 500);

    let sql, countSql;
    let params = [];
    let countParams = [];

    if (userId) {
      sql =
        "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
      countSql = "SELECT COUNT(*) as total FROM posts WHERE user_id = ?";
      params = [userId, maxLimit, offset];
      countParams = [userId];
    } else {
      sql = "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?";
      countSql = "SELECT COUNT(*) as total FROM posts";
      params = [maxLimit, offset];
      countParams = [];
    }

    const [rows] = await db.execute(sql, params);
    const [countResult] = await db.execute(countSql, countParams);
    const total = countResult[0].total;

    const from = total > 0 ? offset + 1 : 0;
    const to = Math.min(offset + maxLimit, total);

    return {
      data: rows,
      pagination: {
        total,
        per_page: maxLimit,
        from,
        to,
        current_page: page,
        last_page: Math.ceil(total / maxLimit),
      },
    };
  },

  async update(id, title, content) {
    const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
    const [result] = await db.execute(sql, [title, content, id]);
    return result;
  },

  async delete(id) {
    const sql = "DELETE FROM posts WHERE id = ?";
    const [result] = await db.execute(sql, [id]);
    return result;
  },
};

module.exports = Post;
