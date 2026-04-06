import './PostsWorkspace.css'
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
    <section className="posts-workspace" aria-labelledby="posts-workspace-title">
      <header className="posts-workspace__header">
        <div className="posts-workspace__heading-block">
          <h1 className="posts-workspace__title" id="posts-workspace-title">
            BLUE OC TECH TEST
          </h1>
          <p className="posts-workspace__lead">
            The main screen stays list-first while detail and create both open in lightweight
            modal shells.
          </p>
        </div>

        <div className="posts-workspace__header-actions">
          <p className="posts-workspace__status">No routing · composition only</p>
          <button className="posts-workspace__create-button" type="button" onClick={handleCreateButtonClick}>
            Create post
          </button>
        </div>
      </header>

      <article className="posts-workspace__list-card" aria-labelledby="posts-list-region-title">
        <div className="posts-workspace__region-header">
          <div className="posts-workspace__region-heading">
            <p className="posts-workspace__label">Region 01</p>
            <h2 className="posts-workspace__region-title" id="posts-list-region-title">
              Post list
            </h2>
            <p className="posts-workspace__region-body">
              Select a row to open detail in a modal shell. The list remains the only visible
              workspace region.
            </p>
          </div>
          <p className="posts-workspace__selection" aria-live="polite">
            {selectedPostId === null ? 'No post selected' : `Selected: #${selectedPostId}`}
          </p>
        </div>

        {postsQuery.status === 'pending' ? (
          <div className="posts-workspace__state" role="status">
            Loading posts…
          </div>
        ) : postsQuery.status === 'error' ? (
          <div className="posts-workspace__state posts-workspace__state--error" role="alert">
            {postsQuery.error instanceof Error ? postsQuery.error.message : 'Unable to load posts.'}
          </div>
        ) : posts.length === 0 ? (
          <div className="posts-workspace__state" role="status">
            No posts available.
          </div>
        ) : (
          <ul className="posts-list" aria-label="Posts">
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
        description={
          selectedPostId === null
            ? 'The selected post detail loads here.'
            : 'The detail view keeps comments available and lets you edit or delete the selected post without leaving the modal.'
        }
        onOpenChange={setIsDetailModalOpen}
        className="posts-modal--detail"
      >
        <PostDetailPanel
          key={`${selectedPostId ?? 'none'}-${isDetailModalOpen ? 'open' : 'closed'}`}
          selectedPostId={selectedPostId}
          onDeleted={handleDeletedPost}
        />
      </PostsModal>

      <PostsModal
        open={isCreateModalOpen}
        title="Create post"
        description="Compose a new post without leaving the list-focused workspace."
        onOpenChange={setIsCreateModalOpen}
        className="posts-modal--create"
      >
        <PostCreateForm onCreated={handleCreatedPost} />
      </PostsModal>
    </section>
  )
}
