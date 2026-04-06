import { useQuery } from '@tanstack/react-query'
import { queryClient } from '../../../lib/queryClient'
import type { Post } from '../types'
import { getPost } from '../api/postsApi'
import { postKeys } from '../api/postKeys'

export function usePostQuery(postId: number | null) {
  const detailQueryKey = postKeys.detail(postId ?? 0)

  return useQuery({
    queryKey: detailQueryKey,
    queryFn: () => getPost(postId ?? 0),
    enabled: postId !== null,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: () => {
      if (postId === null) {
        return undefined
      }

      const cachedPosts = queryClient.getQueryData<Post[]>(postKeys.list())

      return cachedPosts?.find((post) => post.id === postId)
    },
  })
}
