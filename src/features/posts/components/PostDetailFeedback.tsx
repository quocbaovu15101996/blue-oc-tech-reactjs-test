import { usePostQuery } from '../hooks/usePostQuery'

type PostDetailFeedbackProps = {
  selectedPostId: number | null
  postQuery: ReturnType<typeof usePostQuery>
}

export function PostDetailFeedback({ selectedPostId, postQuery }: PostDetailFeedbackProps) {
  if (selectedPostId === null) {
    return (
      <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface-strong)] px-6 py-4 max-[640px]:p-[0.9rem] flex flex-col h-full min-h-0 overflow-hidden" aria-live="polite">
        <p className="text-[color:var(--shell-muted)]">No selection</p>
        <h3 className="text-[color:var(--shell-text)] m-0 text-[1.08rem] leading-[1.35] tracking-[-0.02em]">Pick a post to load its detail</h3>
        <p className="text-[color:var(--shell-muted)] m-0">
          The list stays local-state driven while this panel fetches the selected record.
        </p>
      </div>
    )
  }

  if (postQuery.isError) {
    return (
      <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface-strong)] px-6 py-4 max-[640px]:p-[0.9rem] border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] flex flex-col h-full min-h-0 overflow-hidden" role="alert">
        <p className="text-[color:var(--shell-muted)]">Load failed</p>
        <h3 className="text-[color:var(--shell-text)] m-0 text-[1.08rem] leading-[1.35] tracking-[-0.02em]">Could not load post #{selectedPostId}</h3>
        <p className="text-[color:var(--shell-muted)] m-0">
          {postQuery.error instanceof Error ? postQuery.error.message : 'Unable to load post detail.'}
        </p>
      </div>
    )
  }

  if (postQuery.isPending && postQuery.data === undefined) {
    return (
      <div className="border border-[color:var(--shell-border)] rounded-[18px] bg-[var(--shell-surface-strong)] px-6 py-4 max-[640px]:p-[0.9rem] flex flex-col h-full min-h-0 overflow-hidden" role="status" aria-live="polite">
        <p className="text-[color:var(--shell-muted)]">Loading detail</p>
        <h3 className="text-[color:var(--shell-text)] m-0 text-[1.08rem] leading-[1.35] tracking-[-0.02em]">Fetching post #{selectedPostId}</h3>
        <p className="text-[color:var(--shell-muted)] m-0">Waiting for the selected record to resolve.</p>
      </div>
    )
  }

  return null
}
