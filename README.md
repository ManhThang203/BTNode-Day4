# BTNode-Day4

Node.js project with dotenv configuration and offset-based pagination for posts.

## Features

- **Dotenv Configuration**: Environment variables are loaded from `.env` file
- **Database**: MySQL connection using mysql2 with connection pooling
- **Pagination**: Offset-based pagination with configurable page and limit
- **User-Post Relationship**: Users can have multiple posts (one-to-many relationship)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=btnode_day4
DB_USER=root
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
```

## API Endpoints

### Get Posts with Pagination

```
GET /api/posts
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 500)
- `user_id` (optional): Filter posts by user ID

**Example:**

```
GET /api/posts?page=1&limit=20&user_id=2
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "title": "Post Title",
      "content": "Post content...",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "per_page": 20,
    "from": 1,
    "to": 20,
    "current_page": 1,
    "last_page": 5
  }
}
```

### Get Single Post

```
GET /api/posts/:id
```

### Create Post

```
POST /api/posts
```

**Request Body:**

```json
{
  "user_id": 2,
  "title": "Post Title",
  "content": "Post content..."
}
```

### Update Post

```
PUT /api/posts/:id
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Delete Post

```
DELETE /api/posts/:id
```

## Project Structure

```
BTNode-Day4/
├── .env
├── .gitignore
├── package.json
├── server.js
├── README.md
└── src/
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── postController.js
    ├── models/
    │   ├── User.js
    │   └── Post.js
    ├── routes/
    │   └── postRoutes.js
    └── services/
        └── postService.js
```

## License

ISC
