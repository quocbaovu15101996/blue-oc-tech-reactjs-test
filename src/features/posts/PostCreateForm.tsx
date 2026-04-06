import { useState, type ChangeEvent, type FormEventHandler } from 'react'
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
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
    <form className="border border-[color:var(--shell-border)] rounded-[18px] mt-4 grid gap-[0.95rem] bg-[linear-gradient(180deg,var(--shell-surface-strong)_0%,var(--shell-surface)_100%)] p-4 max-[640px]:p-[0.9rem] overflow-auto h-full" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4 max-[960px]:flex-col max-[960px]:items-start">
        <div>
          <p className="text-[color:var(--shell-muted)] m-0 mb-[0.35rem] text-[0.7rem] uppercase tracking-[0.12em]">Create post</p>
          <h3 className="text-[color:var(--shell-text)] m-0 text-[1.08rem] tracking-[-0.02em]">Write a new entry</h3>
        </div>
        <p className="text-[color:var(--shell-muted)] m-0 text-right text-[0.82rem] max-[960px]:text-left">Demo submits always use userId 1.</p>
      </div>

      <div className="grid gap-[0.9rem]">
        <label className="grid gap-[0.45rem]">
          <span className="text-[color:var(--shell-muted)] text-[0.78rem] font-bold uppercase tracking-[0.08em]">Title</span>
          <input
            className={`w-full rounded-[18px] border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.95rem] py-[0.85rem] font-[inherit] text-[color:var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition duration-150 ease-out placeholder:text-[color:var(--shell-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)]${titleError ? ' border-[color:var(--posts-detail-error-border)] bg-[var(--posts-detail-error-surface-end)]' : ''}`}
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
            <span className="text-[0.82rem] font-semibold text-[color:var(--posts-detail-error)]" id="post-create-title-error">
              {titleError}
            </span>
          ) : null}
        </label>

        <label className="grid gap-[0.45rem]">
          <span className="text-[color:var(--shell-muted)] text-[0.78rem] font-bold uppercase tracking-[0.08em]">Body</span>
          <textarea
            className={`w-full rounded-[18px] border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.95rem] py-[0.85rem] font-[inherit] text-[color:var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition duration-150 ease-out placeholder:text-[color:var(--shell-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] min-h-[11rem] resize-y${bodyError ? ' border-[color:var(--posts-detail-error-border)] bg-[var(--posts-detail-error-surface-end)]' : ''}`}
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
            <span className="text-[0.82rem] font-semibold text-[color:var(--posts-detail-error)]" id="post-create-body-error">
              {bodyError}
            </span>
          ) : null}
        </label>
      </div>

      {feedbackTone !== 'idle' ? (
        <p
          className={`m-0 rounded-[18px] border border-transparent px-4 py-[0.95rem] text-[0.85rem] font-semibold ${feedbackTone === 'pending' ? 'border-[color:rgba(15,118,110,0.18)] bg-[var(--shell-accent-soft)] text-[color:var(--shell-accent)]' : feedbackTone === 'error' ? 'border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] text-[color:var(--posts-detail-error)]' : 'border-[color:var(--posts-create-success-border)] bg-[linear-gradient(180deg,var(--posts-create-success-surface-start)_0%,var(--posts-create-success-surface-end)_100%)] text-[color:var(--shell-accent)]'}`}
          role={feedbackTone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedbackMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 max-[960px]:flex-col max-[960px]:items-start">
        <p className="text-[color:var(--shell-muted)] m-0 text-[0.82rem]">The new post is inserted into the list immediately after save.</p>
        <button className="rounded-full border border-[color:var(--shell-accent)] bg-[var(--shell-accent)] px-[1.1rem] py-[0.8rem] text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] active:translate-y-0 max-[640px]:w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create post'}
        </button>
      </div>
    </form>
  )
}
