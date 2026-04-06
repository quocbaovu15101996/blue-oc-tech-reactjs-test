import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useDeletePostMutation } from './hooks/useDeletePostMutation'
import { usePostQuery } from './hooks/usePostQuery'
import { usePostCommentsQuery } from './hooks/usePostCommentsQuery'
import { useUpdatePostMutation } from './hooks/useUpdatePostMutation'

type PostDetailPanelProps = {
  selectedPostId: number | null
  onDeleted: (postId: number) => void
}

type EditTone = 'idle' | 'pending' | 'error'

export function PostDetailPanel({ selectedPostId, onDeleted }: PostDetailPanelProps) {
  const postQuery = usePostQuery(selectedPostId)
  const commentsQuery = usePostCommentsQuery(selectedPostId)
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')
  const [editTone, setEditTone] = useState<EditTone>('idle')
  const [editMessage, setEditMessage] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const deleteConfirmButtonRef = useRef<HTMLButtonElement>(null)

  const post = postQuery.data

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus()
    }
  }, [isEditing])

  useEffect(() => {
    if (isDeleteConfirmationVisible) {
      deleteConfirmButtonRef.current?.focus()
    }
  }, [isDeleteConfirmationVisible])

  if (selectedPostId === null) {
    return (
      <div className="posts-detail-panel posts-detail-panel--empty" aria-live="polite">
        <p className="posts-detail-panel__eyebrow">No selection</p>
        <h3 className="posts-detail-panel__title">Pick a post to load its detail</h3>
        <p className="posts-detail-panel__message">
          The list stays local-state driven while this panel fetches the selected record.
        </p>
      </div>
    )
  }

  if (postQuery.isError) {
    return (
      <div className="posts-detail-panel posts-detail-panel--error" role="alert">
        <p className="posts-detail-panel__eyebrow">Load failed</p>
        <h3 className="posts-detail-panel__title">Could not load post #{selectedPostId}</h3>
        <p className="posts-detail-panel__message">
          {postQuery.error instanceof Error ? postQuery.error.message : 'Unable to load post detail.'}
        </p>
      </div>
    )
  }

  if (postQuery.isPending && postQuery.data === undefined) {
    return (
      <div className="posts-detail-panel posts-detail-panel--loading" role="status" aria-live="polite">
        <p className="posts-detail-panel__eyebrow">Loading detail</p>
        <h3 className="posts-detail-panel__title">Fetching post #{selectedPostId}</h3>
        <p className="posts-detail-panel__message">Waiting for the selected record to resolve.</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="posts-detail-panel posts-detail-panel--loading" role="status" aria-live="polite">
        <p className="posts-detail-panel__eyebrow">Loading detail</p>
        <h3 className="posts-detail-panel__title">Fetching post #{selectedPostId}</h3>
        <p className="posts-detail-panel__message">Waiting for the selected record to resolve.</p>
      </div>
    )
  }

  const isBusy = updatePostMutation.isPending || deletePostMutation.isPending

  const handleStartEditing = () => {
    setIsEditing(true)
    setIsDeleteConfirmationVisible(false)
    setDraftTitle(post.title)
    setDraftBody(post.body)
    setTitleError('')
    setBodyError('')
    setEditTone('idle')
    setEditMessage('')
    setDeleteError('')
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    setIsDeleteConfirmationVisible(false)
    setTitleError('')
    setBodyError('')
    setEditTone('idle')
    setEditMessage('')
    setDeleteError('')
  }

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = draftTitle.trim()
    const trimmedBody = draftBody.trim()

    if (!trimmedTitle || !trimmedBody) {
      setTitleError(trimmedTitle ? '' : 'Title is required.')
      setBodyError(trimmedBody ? '' : 'Body is required.')
      setEditTone('error')
      setEditMessage('Please complete both fields before saving the post.')
      return
    }

    setTitleError('')
    setBodyError('')
    setEditTone('pending')
    setEditMessage('Saving changes…')

    try {
      await updatePostMutation.mutateAsync({
        postId: post.id,
        payload: {
          userId: post.userId,
          title: trimmedTitle,
          body: trimmedBody,
        },
      })

      setIsEditing(false)
      setEditTone('idle')
      setEditMessage('')
    } catch (error) {
      setEditTone('error')
      setEditMessage(error instanceof Error ? error.message : 'Unable to update post.')
    }
  }

  const handleShowDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(true)
    setDeleteError('')
    setEditTone('idle')
    setEditMessage('')
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false)
    setDeleteError('')
  }

  const handleConfirmDelete = async () => {
    setDeleteError('')

    try {
      await deletePostMutation.mutateAsync(post.id)
      onDeleted(post.id)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete post.')
    }
  }

  const commentsSection = (() => {
    if (commentsQuery.isError) {
      return (
        <section className="posts-detail-comments posts-detail-comments--error" aria-labelledby="post-comments-title" role="alert">
          <div className="posts-detail-comments__header">
            <p className="posts-detail-comments__eyebrow">Comments</p>
            <p className="posts-detail-comments__status">Load failed</p>
          </div>
          <h4 className="posts-detail-comments__title" id="post-comments-title">
            Could not load comments for post #{selectedPostId}
          </h4>
          <p className="posts-detail-comments__message">
            {commentsQuery.error instanceof Error
              ? commentsQuery.error.message
              : 'Unable to load comments.'}
          </p>
        </section>
      )
    }

    if (commentsQuery.isPending && commentsQuery.data === undefined) {
      return (
        <section className="posts-detail-comments posts-detail-comments--loading" aria-labelledby="post-comments-title" aria-live="polite" role="status">
          <div className="posts-detail-comments__header">
            <p className="posts-detail-comments__eyebrow">Comments</p>
            <p className="posts-detail-comments__status">Loading…</p>
          </div>
          <h4 className="posts-detail-comments__title" id="post-comments-title">
            Fetching comments
          </h4>
          <p className="posts-detail-comments__message">Waiting for the comment list to resolve.</p>
        </section>
      )
    }

    const comments = commentsQuery.data ?? []

    if (comments.length === 0) {
      return (
        <section className="posts-detail-comments posts-detail-comments--empty" aria-labelledby="post-comments-title" aria-live="polite">
          <div className="posts-detail-comments__header">
            <p className="posts-detail-comments__eyebrow">Comments</p>
            <p className="posts-detail-comments__status">Empty</p>
          </div>
          <h4 className="posts-detail-comments__title" id="post-comments-title">
            No comments yet
          </h4>
          <p className="posts-detail-comments__message">This post does not have any comments to show.</p>
        </section>
      )
    }

    return (
      <section className="posts-detail-comments posts-detail-comments--ready" aria-labelledby="post-comments-title" aria-busy={commentsQuery.isFetching} aria-live="polite">
        <div className="posts-detail-comments__header">
          <p className="posts-detail-comments__eyebrow">Comments</p>
          <p className="posts-detail-comments__status">
            {commentsQuery.isFetching ? 'Refreshing…' : `${comments.length} comments`}
          </p>
        </div>
        <h4 className="posts-detail-comments__title" id="post-comments-title">
          Conversation
        </h4>
        <ul className="posts-detail-comments__list">
          {comments.map((comment) => (
            <li key={comment.id} className="posts-detail-comments__item">
              <div className="posts-detail-comments__item-header">
                <div>
                  <p className="posts-detail-comments__author">{comment.name}</p>
                  <p className="posts-detail-comments__email">{comment.email}</p>
                </div>
                <p className="posts-detail-comments__id">#{comment.id}</p>
              </div>
              <p className="posts-detail-comments__message posts-detail-comments__message--body">{comment.body}</p>
            </li>
          ))}
        </ul>
      </section>
    )
  })()

  return (
    <div className="posts-detail-panel posts-detail-panel--ready" aria-busy={postQuery.isFetching} aria-live="polite">
      <div className="posts-detail-panel__header-row">
        <p className="posts-detail-panel__eyebrow">Selected post</p>
        <p className="posts-detail-panel__status">
          {postQuery.isFetching ? 'Refreshing detail…' : 'Loaded'}
        </p>
      </div>

      <div className="posts-detail-panel__meta">
        <span>#{post.id}</span>
        <span>User {post.userId}</span>
      </div>

      {isEditing ? (
        <form className="posts-detail-edit-form" onSubmit={handleEditSubmit}>
          <div className="posts-detail-panel__toolbar">
            <p className="posts-detail-panel__eyebrow">Editing post</p>
            <div className="posts-detail-panel__actions">
              <button
                className="posts-detail-panel__action posts-detail-panel__action--ghost"
                type="button"
                onClick={handleCancelEditing}
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                className="posts-detail-panel__action posts-detail-panel__action--primary"
                type="submit"
                disabled={isBusy}
              >
                {editTone === 'pending' ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>

          {editTone !== 'idle' ? (
            <p
              className={`posts-create-form__feedback posts-create-form__feedback--${editTone}`}
              role={editTone === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {editMessage}
            </p>
          ) : null}

          <div className="posts-create-form__fields">
            <label className={`posts-create-form__field ${titleError ? 'posts-create-form__field--error' : ''}`}>
              <span className="posts-create-form__label">Title</span>
              <input
                className="posts-create-form__input"
                type="text"
                name="title"
                value={draftTitle}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setDraftTitle(event.target.value)

                  if (titleError) {
                    setTitleError('')
                  }
                }}
                placeholder="Post title"
                aria-invalid={titleError ? 'true' : 'false'}
                aria-describedby={titleError ? 'post-edit-title-error' : undefined}
                disabled={isBusy}
                ref={titleInputRef}
              />
              {titleError ? (
                <span className="posts-create-form__field-error" id="post-edit-title-error">
                  {titleError}
                </span>
              ) : null}
            </label>

            <label className={`posts-create-form__field ${bodyError ? 'posts-create-form__field--error' : ''}`}>
              <span className="posts-create-form__label">Body</span>
              <textarea
                className="posts-create-form__textarea"
                name="body"
                value={draftBody}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setDraftBody(event.target.value)

                  if (bodyError) {
                    setBodyError('')
                  }
                }}
                placeholder="Post body"
                aria-invalid={bodyError ? 'true' : 'false'}
                aria-describedby={bodyError ? 'post-edit-body-error' : undefined}
                disabled={isBusy}
                rows={8}
              />
              {bodyError ? (
                <span className="posts-create-form__field-error" id="post-edit-body-error">
                  {bodyError}
                </span>
              ) : null}
            </label>
          </div>
        </form>
      ) : (
        <>
          <div className="posts-detail-panel__toolbar">
            <p className="posts-detail-panel__eyebrow">Post content</p>
            <div className="posts-detail-panel__actions">
              <button
                className="posts-detail-panel__action posts-detail-panel__action--ghost"
                type="button"
                onClick={handleStartEditing}
                disabled={isBusy}
              >
                Edit
              </button>
              <button
                className="posts-detail-panel__action posts-detail-panel__action--danger"
                type="button"
                onClick={handleShowDeleteConfirmation}
                disabled={isBusy}
              >
                Delete
              </button>
            </div>
          </div>

          <h3 className="posts-detail-panel__title">{post.title}</h3>
          <p className="posts-detail-panel__message posts-detail-panel__message--body">{post.body}</p>

          {isDeleteConfirmationVisible ? (
            <div className="posts-detail-delete-confirm" role="alert" aria-live="assertive">
              <h4 className="posts-detail-delete-confirm__title">Delete this post?</h4>
              <p className="posts-detail-delete-confirm__message">
                This removes the post from the list and closes the detail modal.
              </p>
              {deleteError ? <p className="posts-detail-delete-confirm__error">{deleteError}</p> : null}
              <div className="posts-detail-delete-confirm__actions">
                <button
                  className="posts-detail-panel__action posts-detail-panel__action--ghost"
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={isBusy}
                >
                  Cancel
                </button>
                <button
                  className="posts-detail-panel__action posts-detail-panel__action--danger"
                type="button"
                onClick={handleConfirmDelete}
                disabled={isBusy}
                ref={deleteConfirmButtonRef}
              >
                {deletePostMutation.isPending ? 'Deleting…' : 'Delete post'}
              </button>
              </div>
            </div>
          ) : null}

          {commentsSection}
        </>
      )}
    </div>
  )
}
