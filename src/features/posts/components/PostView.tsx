type PostViewProps = {
  title: string
  body: string
  isBusy: boolean
  onEdit: () => void
  onDelete: () => void
}

export function PostView({ title, body, isBusy, onEdit, onDelete }: PostViewProps) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-[color:var(--shell-muted)]">Post content</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface)] px-[0.95rem] py-[0.72rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] disabled:cursor-wait disabled:opacity-70"
            type="button"
            onClick={onEdit}
            disabled={isBusy}
          >
            Edit
          </button>
          <button
            className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface)] px-[0.95rem] py-[0.72rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] disabled:cursor-wait disabled:opacity-70 border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] text-[color:var(--posts-detail-error)]"
            type="button"
            onClick={onDelete}
            disabled={isBusy}
          >
            Delete
          </button>
        </div>
      </div>

      <h3 className="text-[color:var(--shell-text)] m-0 text-[1.08rem] leading-[1.35] tracking-[-0.02em]">{title}</h3>
      <p className="text-[color:var(--shell-muted)] m-0 whitespace-pre-wrap">{body}</p>
    </>
  )
}
