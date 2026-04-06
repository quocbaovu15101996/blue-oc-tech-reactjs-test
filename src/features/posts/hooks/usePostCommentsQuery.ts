import { useQuery } from '@tanstack/react-query'
import { getPostComments } from '../api/postsApi'
import { postKeys } from '../api/postKeys'

export function usePostCommentsQuery(postId: number | null) {
  return useQuery({
    queryKey: postKeys.comments(postId ?? 0),
    queryFn: () => getPostComments(postId ?? 0),
    enabled: postId !== null,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
