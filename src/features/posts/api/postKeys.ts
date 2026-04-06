export const postKeys = {
  all: ['posts'] as const,
  list: () => [...postKeys.all] as const,
  detail: (postId: number) => [...postKeys.all, postId] as const,
  comments: (postId: number) => [...postKeys.detail(postId), 'comments'] as const,
}
