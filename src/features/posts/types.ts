export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export type CreatePostInput = Pick<Post, 'userId' | 'title' | 'body'>

export type UpdatePostInput = Pick<Post, 'userId' | 'title' | 'body'>
