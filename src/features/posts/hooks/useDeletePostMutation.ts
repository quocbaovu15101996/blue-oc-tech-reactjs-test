import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../api/postsApi'
import { postKeys } from '../api/postKeys'
import type { Post } from '../types'

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Post[]>(postKeys.list(), (currentPosts) => {
        if (!currentPosts) {
          return currentPosts
        }

        return currentPosts.filter((post) => post.id !== postId)
      })

      queryClient.removeQueries({ queryKey: postKeys.detail(postId) })
    },
  })
}
