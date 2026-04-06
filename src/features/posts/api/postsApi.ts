import type { Comment, CreatePostInput, Post, UpdatePostInput } from '../types'

const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts'

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Posts API request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(POSTS_API_URL)

  return parseJsonResponse<Post[]>(response)
}

export async function getPost(postId: number): Promise<Post> {
  const response = await fetch(`${POSTS_API_URL}/${postId}`)

  return parseJsonResponse<Post>(response)
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`${POSTS_API_URL}/${postId}/comments`)

  return parseJsonResponse<Comment[]>(response)
}

export async function createPost(payload: CreatePostInput): Promise<Post> {
  const response = await fetch(POSTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  })

  return parseJsonResponse<Post>(response)
}

export async function updatePost(postId: number, payload: UpdatePostInput): Promise<Post> {
  const response = await fetch(`${POSTS_API_URL}/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  })

  return parseJsonResponse<Post>(response)
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetch(`${POSTS_API_URL}/${postId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Posts API request failed with status ${response.status}`)
  }
}
