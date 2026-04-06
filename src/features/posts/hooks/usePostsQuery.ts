import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/postsApi'
import { postKeys } from '../api/postKeys'

export function usePostsQuery() {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: getPosts,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
