import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost } from '../api/postsApi'
import { postKeys } from '../api/postKeys'
import type { Post, UpdatePostInput } from '../types'

interface UpdatePostVariables {
  postId: number
  payload: UpdatePostInput
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, payload }: UpdatePostVariables) => updatePost(postId, payload),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData<Post[]>(postKeys.list(), (currentPosts) => {
        if (!currentPosts) {
          return currentPosts
        }

        return currentPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      })

      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost)
    },
  })
}
