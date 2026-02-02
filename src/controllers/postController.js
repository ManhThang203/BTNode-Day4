const postService = require("@/services/postService");

const postController = {
  async getPosts(req, res) {
    try {
      const { page = 1, limit = 20, user_id } = req.query;
      const result = await postService.getPosts(page, limit, user_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createPost(req, res) {
    try {
      const { user_id, title, content } = req.body;
      if (!user_id || !title) {
        return res
          .status(400)
          .json({ error: "user_id and title are required" });
      }
      const result = await postService.createPost(user_id, title, content);
      res
        .status(201)
        .json({ id: result.insertId, message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const result = await postService.updatePost(id, title, content);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const result = await postService.deletePost(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;
