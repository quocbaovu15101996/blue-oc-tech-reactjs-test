import { useState, useRef, useEffect, type ChangeEvent, type FormEventHandler } from 'react'

type PostEditFormProps = {
  isBusy: boolean
  initialTitle: string
  initialBody: string
  onCancel: () => void
  onSubmit: (title: string, body: string) => Promise<void>
}

type EditTone = 'idle' | 'pending' | 'error'

export function PostEditForm({
  isBusy,
  initialTitle,
  initialBody,
  onCancel,
  onSubmit,
}: PostEditFormProps) {
  const [draftTitle, setDraftTitle] = useState(initialTitle)
  const [draftBody, setDraftBody] = useState(initialBody)
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')
  const [editTone, setEditTone] = useState<EditTone>('idle')
  const [editMessage, setEditMessage] = useState('')

  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  const handleDraftTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(event.target.value)
    if (titleError) setTitleError('')
  }

  const handleDraftBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraftBody(event.target.value)
    if (bodyError) setBodyError('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
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
      await onSubmit(trimmedTitle, trimmedBody)
      setEditTone('idle')
      setEditMessage('')
    } catch (error) {
      setEditTone('error')
      setEditMessage(error instanceof Error ? error.message : 'Unable to update post.')
    }
  }

  return (
    <form className="grid gap-[0.9rem] w-full md:w-[600px]" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-[color:var(--shell-muted)]">Editing post</p>
      </div>

      {editTone !== 'idle' ? (
        <p
          className={`m-0 rounded-[18px] border border-transparent px-4 py-[0.95rem] text-[0.85rem] font-semibold ${editTone === 'pending'
            ? 'border-[color:rgba(15,118,110,0.18)] bg-[var(--shell-accent-soft)] text-[color:var(--shell-accent)]'
            : 'border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] text-[color:var(--posts-detail-error)]'
            }`}
          role={editTone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {editMessage}
        </p>
      ) : null}

      <div className="grid gap-[0.9rem]">
        <label className="grid gap-[0.45rem]">
          <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-muted)]">Title</span>
          <input
            className={`w-full rounded-[18px] border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.95rem] py-[0.85rem] font-[inherit] text-[color:var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition duration-150 ease-out placeholder:text-[color:var(--shell-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)]${titleError ? ' border-[color:var(--posts-detail-error-border)] bg-[var(--posts-detail-error-surface-end)]' : ''
              }`}
            type="text"
            name="title"
            value={draftTitle}
            onChange={handleDraftTitleChange}
            placeholder="Post title"
            aria-invalid={titleError ? 'true' : 'false'}
            aria-describedby={titleError ? 'post-edit-title-error' : undefined}
            disabled={isBusy}
            ref={titleInputRef}
          />
          {titleError ? (
            <span className="text-[0.82rem] font-semibold text-[color:var(--posts-detail-error)]" id="post-edit-title-error">
              {titleError}
            </span>
          ) : null}
        </label>

        <label className="grid gap-[0.45rem]">
          <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-muted)]">Body</span>
          <textarea
            className={`w-full rounded-[18px] border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.95rem] py-[0.85rem] font-[inherit] text-[color:var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition duration-150 ease-out placeholder:text-[color:var(--shell-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] min-h-[11rem] resize-y${bodyError ? ' border-[color:var(--posts-detail-error-border)] bg-[var(--posts-detail-error-surface-end)]' : ''
              }`}
            name="body"
            value={draftBody}
            onChange={handleDraftBodyChange}
            placeholder="Post body"
            aria-invalid={bodyError ? 'true' : 'false'}
            aria-describedby={bodyError ? 'post-edit-body-error' : undefined}
            disabled={isBusy}
            rows={8}
          />
          {bodyError ? (
            <span className="text-[0.82rem] font-semibold text-[color:var(--posts-detail-error)]" id="post-edit-body-error">
              {bodyError}
            </span>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface)] px-[0.95rem] py-[0.72rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] disabled:cursor-wait disabled:opacity-70"
          type="button"
          onClick={onCancel}
          disabled={isBusy}
        >
          Cancel
        </button>
        <button
          className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.95rem] py-[0.72rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] disabled:cursor-wait disabled:opacity-70 border-[color:var(--shell-accent)] bg-[var(--shell-accent)]"
          type="submit"
          disabled={isBusy}
        >
          {editTone === 'pending' ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
