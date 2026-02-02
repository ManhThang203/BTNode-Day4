const postService = require("@/services/postService");

const postController = {
  async getPosts(req, res, next) {
    try {
      const { page = 1, limit = 20, user_id } = req.query;
      const result = await postService.getPosts(page, limit, user_id);
      res.success(result);
    } catch (error) {
      next(error);
    }
  },

  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      if (!post) {
        return res.error(404, "Post not found");
      }
      res.success(post);
    } catch (error) {
      next(error);
    }
  },

  async createPost(req, res, next) {
    try {
      const { user_id, title, content } = req.body;
      if (!user_id || !title) {
        return res.error(400, "user_id and title are required");
      }
      const result = await postService.createPost(user_id, title, content);
      res
        .status(201)
        .success({ id: result.insertId, message: "Post created successfully" });
    } catch (error) {
      next(error);
    }
  },

  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const result = await postService.updatePost(id, title, content);
      if (result.affectedRows === 0) {
        return res.error(404, "Post not found");
      }
      res.success({ message: "Post updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const result = await postService.deletePost(id);
      if (result.affectedRows === 0) {
        return res.error(404, "Post not found");
      }
      res.success({ message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = postController;
