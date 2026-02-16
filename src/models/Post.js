const db = require("@/config/database");

const Post = {
  async createTable() {
    // - **FOREIGN KEY (user_id)**: Cột `user_id` là khóa ngoại
    // - **REFERENCES users(id)**: Tham chiếu đến cột `id` trong bảng `users`
    // - **ON DELETE CASCADE**: Khi xóa user → tự động xóa tất cả bài viết của user đó
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

    const whereClause = userId ? "WHERE user_id = ?" : "";
    const params = userId ? [userId] : [];

    const sql = `SELECT * FROM posts ${whereClause} ORDER BY created_at DESC LIMIT ${maxLimit} OFFSET ${offset}`;
    const countSql = `SELECT COUNT(*) as total FROM posts ${whereClause}`;

    const [rows] = await db.execute(sql, params);
    const [countResult] = await db.execute(countSql, params);

    const total = countResult[0].total;

    const from = total > 0 ? offset + 1 : null;
    const to = total > 0 ? Math.min(offset + maxLimit, total) : null;

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
