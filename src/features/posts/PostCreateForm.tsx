import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useCreatePostMutation } from './hooks/useCreatePostMutation'
import type { Post } from './types'

type PostCreateFormProps = {
  onCreated: (post: Post) => void
}

type FeedbackTone = 'idle' | 'pending' | 'error' | 'success'

export function PostCreateForm({ onCreated }: PostCreateFormProps) {
  const createPostMutation = useCreatePostMutation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const isSubmitting = createPostMutation.isPending || feedbackTone === 'pending'

  const resetFieldErrors = () => {
    setTitleError('')
    setBodyError('')
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)

    if (titleError) {
      setTitleError('')
    }

    if (feedbackTone !== 'pending' && feedbackTone !== 'idle') {
      setFeedbackTone('idle')
      setFeedbackMessage('')
    }
  }

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value)

    if (bodyError) {
      setBodyError('')
    }

    if (feedbackTone !== 'pending' && feedbackTone !== 'idle') {
      setFeedbackTone('idle')
      setFeedbackMessage('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setTitleError(trimmedTitle ? '' : 'Title is required.')
      setBodyError(trimmedBody ? '' : 'Body is required.')
      setFeedbackTone('error')
      setFeedbackMessage('Please complete both fields before creating a post.')
      return
    }

    resetFieldErrors()
    setFeedbackTone('pending')
    setFeedbackMessage('Creating post…')

    try {
      const createdPost = await createPostMutation.mutateAsync({
        userId: 1,
        title: trimmedTitle,
        body: trimmedBody,
      })

      onCreated(createdPost)
      setTitle('')
      setBody('')
      setFeedbackTone('success')
      setFeedbackMessage(`Created post #${createdPost.id}.`)
    } catch (error) {
      setFeedbackTone('error')
      setFeedbackMessage(error instanceof Error ? error.message : 'Unable to create post.')
    }
  }

  return (
    <form className="posts-create-form" onSubmit={handleSubmit}>
      <div className="posts-create-form__header">
        <div>
          <p className="posts-create-form__eyebrow">Create post</p>
          <h3 className="posts-create-form__title">Write a new entry</h3>
        </div>
        <p className="posts-create-form__note">Demo submits always use userId 1.</p>
      </div>

      <div className="posts-create-form__fields">
        <label className={`posts-create-form__field ${titleError ? 'posts-create-form__field--error' : ''}`}>
          <span className="posts-create-form__label">Title</span>
          <input
            className="posts-create-form__input"
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="New post title"
            aria-invalid={titleError ? 'true' : 'false'}
            aria-describedby={titleError ? 'post-create-title-error' : undefined}
            disabled={isSubmitting}
          />
          {titleError ? (
            <span className="posts-create-form__field-error" id="post-create-title-error">
              {titleError}
            </span>
          ) : null}
        </label>

        <label className={`posts-create-form__field ${bodyError ? 'posts-create-form__field--error' : ''}`}>
          <span className="posts-create-form__label">Body</span>
          <textarea
            className="posts-create-form__textarea"
            name="body"
            value={body}
            onChange={handleBodyChange}
            placeholder="New post body"
            aria-invalid={bodyError ? 'true' : 'false'}
            aria-describedby={bodyError ? 'post-create-body-error' : undefined}
            disabled={isSubmitting}
            rows={8}
          />
          {bodyError ? (
            <span className="posts-create-form__field-error" id="post-create-body-error">
              {bodyError}
            </span>
          ) : null}
        </label>
      </div>

      {feedbackTone !== 'idle' ? (
        <p
          className={`posts-create-form__feedback posts-create-form__feedback--${feedbackTone}`}
          role={feedbackTone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedbackMessage}
        </p>
      ) : null}

      <div className="posts-create-form__actions">
        <p className="posts-create-form__hint">The new post is inserted into the list immediately after save.</p>
        <button className="posts-create-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create post'}
        </button>
      </div>
    </form>
  )
}
