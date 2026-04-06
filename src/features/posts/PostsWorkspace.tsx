import { useCallback, useState } from 'react'
import { PostCreateForm } from './PostCreateForm'
import { PostDetailPanel } from './PostDetailPanel'
import { PostListRow } from './PostListRow'
import { PostsModal } from './PostsModal'
import { usePostsQuery } from './hooks/usePostsQuery'
import type { Post } from './types'

export function PostsWorkspace() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const postsQuery = usePostsQuery()

  const posts = postsQuery.data ?? []

  const handleSelectPost = useCallback((postId: number) => {
    setSelectedPostId(postId)
    setIsCreateModalOpen(false)
    setIsDetailModalOpen(true)
  }, [])

  const handleCreatedPost = useCallback((post: Post) => {
    setSelectedPostId(post.id)
    setIsCreateModalOpen(false)
  }, [])

  const handleDeletedPost = useCallback(() => {
    setSelectedPostId(null)
    setIsDetailModalOpen(false)
  }, [])

  const handleCreateButtonClick = useCallback(() => {
    setIsDetailModalOpen(false)
    setIsCreateModalOpen(true)
  }, [])

  return (
    <section
      className="mx-auto grid h-full min-h-0 w-full max-w-[1180px] grid-rows-[auto_minmax(0,1fr)] gap-4 [--posts-detail-error:#a03623] [--posts-detail-error-border:rgba(160,54,35,0.25)] [--posts-detail-error-soft:rgba(160,54,35,0.12)] [--posts-detail-error-surface-start:rgba(255,244,241,0.95)] [--posts-detail-error-surface-end:rgba(255,250,248,0.95)] [--posts-create-success-border:rgba(15,118,110,0.22)] [--posts-create-success-surface-start:rgba(240,251,249,0.96)] [--posts-create-success-surface-end:rgba(248,253,252,0.96)] [--posts-modal-backdrop:rgba(32,25,19,0.52)] [--posts-modal-surface:rgba(255,253,249,0.96)] [--posts-modal-surface-strong:#fffdf9] [--posts-modal-shadow:0_36px_96px_rgba(29,17,10,0.24)] [--posts-modal-width:min(48rem,calc(100vw-2rem))] [--posts-modal-width-wide:min(56rem,calc(100vw-2rem))]"
      aria-labelledby="posts-workspace-title"
    >
      <header className="flex items-start justify-between gap-4 rounded-[32px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] shadow-[0_32px_90px_rgba(44,26,12,0.12)] backdrop-blur-[18px] px-6 py-5 max-[960px]:flex-col">
        <div className="grid min-w-0 gap-1">
          <h1 className="m-0 text-[clamp(2rem,3vw,3.25rem)] leading-[0.95] tracking-[-0.05em] max-[640px]:text-[clamp(1.7rem,9vw,2.4rem)]" id="posts-workspace-title">
            BLUE OC TECH TEST
          </h1>
        </div>

        <div className="grid shrink-0 justify-items-end gap-3 max-[960px]:justify-items-start">
          <button
            className="rounded-full border border-[color:var(--shell-accent)] bg-[var(--shell-accent)] px-[1.1rem] py-[0.8rem] text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] active:translate-y-0 max-[640px]:w-full"
            type="button"
            onClick={handleCreateButtonClick}
          >
            Create post
          </button>
        </div>
      </header>

      <article
        className="min-h-0 flex flex-col gap-4 rounded-[32px] border border-[color:var(--shell-border)] bg-[linear-gradient(180deg,var(--shell-surface-strong)_0%,var(--shell-surface)_100%)] shadow-[0_32px_90px_rgba(44,26,12,0.12)] backdrop-blur-[18px] p-5 max-[640px]:rounded-[24px] max-[640px]:p-4"
        aria-labelledby="posts-list-region-title"
      >
        <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
          <div className="grid min-w-0 gap-[0.45rem]">
            <h2 className="m-0 text-[1.15rem] tracking-[-0.03em]" id="posts-list-region-title">
              Post list
            </h2>
            <p className="text-[color:var(--shell-muted)] m-0 max-w-xl">
              Select a row to open detail in a modal.
            </p>
          </div>
        </div>

        {postsQuery.status === 'pending' ? (
          <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface)] mt-4 p-4 text-[color:var(--shell-muted)]" role="status">
            Loading posts…
          </div>
        ) : postsQuery.status === 'error' ? (
          <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface)] mt-4 p-4 text-[color:var(--shell-muted)] border-[color:var(--posts-detail-error-border)] text-[color:var(--posts-detail-error)]" role="alert">
            {postsQuery.error instanceof Error ? postsQuery.error.message : 'Unable to load posts.'}
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface)] mt-4 p-4 text-[color:var(--shell-muted)]" role="status">
            No posts available.
          </div>
        ) : (
          <ul className="m-0 grid min-h-0 flex-1 list-none gap-[0.65rem] overflow-auto p-0 max-[960px]:max-h-[24rem]" aria-label="Posts">
            {posts.map((post) => (
              <PostListRow
                key={post.id}
                postId={post.id}
                title={post.title}
                isSelected={post.id === selectedPostId}
                onSelect={handleSelectPost}
              />
            ))}
          </ul>
        )}
      </article>

      <PostsModal
        open={isDetailModalOpen}
        title={selectedPostId === null ? 'Post detail' : `Post #${selectedPostId}`}
        onOpenChange={setIsDetailModalOpen}
        className="max-[640px]:w-[calc(100vw-1rem)] max-[640px]:max-w-[calc(100vw-1rem)] w-[min(48rem,calc(100vw-2rem))] max-w-[min(48rem,calc(100vw-2rem))]"
      >
        <PostDetailPanel
          selectedPostId={selectedPostId}
          onDeleted={handleDeletedPost}
        />
      </PostsModal>

      <PostsModal
        open={isCreateModalOpen}
        title="Create post"
        onOpenChange={setIsCreateModalOpen}
        className="max-[640px]:w-[calc(100vw-1rem)] max-[640px]:max-w-[calc(100vw-1rem)] w-[min(56rem,calc(100vw-2rem))] max-w-[min(56rem,calc(100vw-2rem))]"
      >
        <PostCreateForm onCreated={handleCreatedPost} />
      </PostsModal>
    </section>
  )
}
