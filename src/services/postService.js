const Post = require("@/models/Post");

const postService = {
  async getPosts(page = 1, limit = 20, userId = null) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    let limitNum = parseInt(limit) || 20;
    limitNum = limitNum < 1 ? 20 : limitNum;
    const userIdNum = userId ? parseInt(userId) : null;

    return await Post.findAllWithPagination(pageNum, limitNum, userIdNum);
  },

  async getPostById(id) {
    return await Post.findById(id);
  },

  async createPost(userId, title, content) {
    return await Post.create(userId, title, content);
  },

  async updatePost(id, title, content) {
    return await Post.update(id, title, content);
  },

  async deletePost(id) {
    return await Post.delete(id);
  },
};

module.exports = postService;
