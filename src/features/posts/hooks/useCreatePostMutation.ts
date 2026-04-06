import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/postsApi'
import { postKeys } from '../api/postKeys'
import type { Post } from '../types'

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (createdPost) => {
      queryClient.setQueryData<Post[]>(postKeys.list(), (currentPosts) => {
        const posts = currentPosts ?? []

        return [createdPost, ...posts.filter((post) => post.id !== createdPost.id)]
      })

      queryClient.setQueryData(postKeys.detail(createdPost.id), createdPost)
    },
  })
}
