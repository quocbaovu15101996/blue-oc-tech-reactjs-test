import { useEffect, useRef, useState } from 'react'
import { useDeletePostMutation } from './hooks/useDeletePostMutation'
import { usePostQuery } from './hooks/usePostQuery'
import { usePostCommentsQuery } from './hooks/usePostCommentsQuery'
import { useUpdatePostMutation } from './hooks/useUpdatePostMutation'
import { PostDetailFeedback } from './components/PostDetailFeedback'
import { PostDetailHeader } from './components/PostDetailHeader'
import { PostEditForm } from './components/PostEditForm'
import { PostView } from './components/PostView'
import { PostDeleteConfirmation } from './components/PostDeleteConfirmation'
import { PostComments } from './components/PostComments'
import { PostsModal } from './PostsModal'

type PostDetailPanelProps = {
  selectedPostId: number | null
  onDeleted: (postId: number) => void
}

export function PostDetailPanel({ selectedPostId, onDeleted }: PostDetailPanelProps) {
  const postQuery = usePostQuery(selectedPostId)
  const commentsQuery = usePostCommentsQuery(selectedPostId)
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const deleteConfirmButtonRef = useRef<HTMLButtonElement>(null)

  const post = postQuery.data
  const isBusy = updatePostMutation.isPending || deletePostMutation.isPending

  useEffect(() => {
    if (isDeleteConfirmationVisible) {
      deleteConfirmButtonRef.current?.focus()
    }
  }, [isDeleteConfirmationVisible])

  if (selectedPostId === null || postQuery.isError || (postQuery.isPending && post === undefined) || !post) {
    return <PostDetailFeedback selectedPostId={selectedPostId} postQuery={postQuery} />
  }

  const handleStartEditing = () => {
    setIsEditing(true)
    setIsDeleteConfirmationVisible(false)
    setDeleteError('')
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    setIsDeleteConfirmationVisible(false)
    setDeleteError('')
  }

  const handleEditSubmit = async (title: string, body: string) => {
    await updatePostMutation.mutateAsync({
      postId: post.id,
      payload: {
        userId: post.userId,
        title,
        body,
      },
    })
    setIsEditing(false)
  }

  const handleShowDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(true)
    setDeleteError('')
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false)
    setDeleteError('')
  }

  const handleConfirmDelete = async () => {
    setDeleteError('')

    try {
      await deletePostMutation.mutateAsync(post.id)
      setIsDeleteConfirmationVisible(false)
      onDeleted(post.id)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete post.')
    }
  }

  return (
    <div
      className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface-strong)] px-6 py-4 max-[640px]:p-[0.9rem] md:w-[640px] flex-1 min-h-0 flex flex-col overflow-hidden h-full"
      aria-busy={postQuery.isFetching}
      aria-live="polite"
    >
      <div className="flex-none">
        <PostDetailHeader postId={post.id} userId={post.userId} isFetching={postQuery.isFetching} />
      </div>

      {isEditing ? (
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-1">
          <PostEditForm
            isBusy={isBusy}
            initialTitle={post.title}
            initialBody={post.body}
            onCancel={handleCancelEditing}
            onSubmit={handleEditSubmit}
          />
        </div>
      ) : (
        <>
          <div className="flex-none">
            <PostView
              title={post.title}
              body={post.body}
              isBusy={isBusy}
              onEdit={handleStartEditing}
              onDelete={handleShowDeleteConfirmation}
            />

            {isDeleteConfirmationVisible && (
              <PostsModal
                open={isDeleteConfirmationVisible}
                title="Delete post?"
                description="This removes the post from the list and closes the detail modal."
                compact
                isShowCloseButton={false}
                onOpenChange={(open) => {
                  if (open) {
                    setIsDeleteConfirmationVisible(true)
                    return
                  }
                  handleCancelDelete()
                }}
                className="max-[640px]:w-[calc(100vw-1rem)] max-[640px]:max-w-[calc(100vw-1rem)] w-[min(34rem,calc(100vw-2rem))] max-w-[min(34rem,calc(100vw-2rem))]"
              >
                <PostDeleteConfirmation
                  isBusy={isBusy}
                  isDeleting={deletePostMutation.isPending}
                  deleteError={deleteError}
                  confirmButtonRef={deleteConfirmButtonRef}
                  onCancel={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              </PostsModal>
            )}
          </div>

          <PostComments selectedPostId={post.id} commentsQuery={commentsQuery} />
        </>
      )}
    </div>
  )
}
