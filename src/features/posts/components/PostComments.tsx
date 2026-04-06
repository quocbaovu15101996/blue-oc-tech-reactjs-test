import { memo } from 'react'
import { usePostCommentsQuery } from '../hooks/usePostCommentsQuery'

type PostCommentsProps = {
  selectedPostId: number
  commentsQuery: ReturnType<typeof usePostCommentsQuery>
}

export const PostComments = memo(function PostComments({ selectedPostId, commentsQuery }: PostCommentsProps) {
  if (commentsQuery.isError) {
    return (
      <section
        className="border border-[color:var(--shell-border)] grid gap-3 border-t pt-1 text-[color:var(--posts-detail-error)]"
        aria-labelledby="post-comments-title"
        role="alert"
      >
        <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
          <p className="text-[color:var(--shell-muted)]">Comments</p>
          <p className="text-[color:var(--shell-accent)] whitespace-nowrap text-[0.76rem] font-bold uppercase tracking-[0.08em]">
            Load failed
          </p>
        </div>
        <h4 className="text-[color:var(--shell-text)] m-0 text-[1rem] leading-[1.35] tracking-[-0.02em]" id="post-comments-title">
          Could not load comments for post #{selectedPostId}
        </h4>
        <p className="text-[color:var(--shell-muted)] m-0">
          {commentsQuery.error instanceof Error ? commentsQuery.error.message : 'Unable to load comments.'}
        </p>
      </section>
    )
  }

  if (commentsQuery.isPending && commentsQuery.data === undefined) {
    return (
      <section
        className="border border-[color:var(--shell-border)] grid gap-3 border-t pt-1"
        aria-labelledby="post-comments-title"
        aria-live="polite"
        role="status"
      >
        <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
          <p className="text-[color:var(--shell-muted)]">Comments</p>
          <p className="text-[color:var(--shell-accent)] whitespace-nowrap text-[0.76rem] font-bold uppercase tracking-[0.08em]">
            Loading…
          </p>
        </div>
        <h4 className="text-[color:var(--shell-text)] m-0 text-[1rem] leading-[1.35] tracking-[-0.02em]" id="post-comments-title">
          Fetching comments
        </h4>
        <p className="text-[color:var(--shell-muted)] m-0">Waiting for the comment list to resolve.</p>
      </section>
    )
  }

  const comments = commentsQuery.data ?? []

  if (comments.length === 0) {
    return (
      <section
        className="border border-[color:var(--shell-border)] grid gap-3 border-t pt-1"
        aria-labelledby="post-comments-title"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
          <p className="text-[color:var(--shell-muted)]">Comments</p>
          <p className="text-[color:var(--shell-accent)] whitespace-nowrap text-[0.76rem] font-bold uppercase tracking-[0.08em]">
            Empty
          </p>
        </div>
        <h4 className="text-[color:var(--shell-text)] m-0 text-[1rem] leading-[1.35] tracking-[-0.02em]" id="post-comments-title">
          No comments yet
        </h4>
        <p className="text-[color:var(--shell-muted)] m-0">This post does not have any comments to show.</p>
      </section>
    )
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
        <p className="text-[color:var(--shell-accent)] whitespace-nowrap text-[0.76rem] font-bold uppercase mt-5">
          {commentsQuery.isFetching ? 'Refreshing…' : `${comments.length} comments`}
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto mt-6 pr-1 custom-scrollbar">

        <section
          className="border border-[color:var(--shell-border)] grid gap-3 border-t pt-1"
          aria-labelledby="post-comments-title"
          aria-busy={commentsQuery.isFetching}
          aria-live="polite"
        >
          <ul className="m-0 grid list-none gap-[0.65rem] p-0">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="border border-[color:var(--shell-border)] rounded-[18px] grid gap-[0.55rem] bg-[var(--shell-surface)] p-[0.9rem]"
              >
                <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
                  <div>
                    <p className="text-[color:var(--shell-text)] m-0 text-[0.93rem] font-bold">{comment.name}</p>
                    <p className="text-[color:var(--shell-muted)] m-0 mt-[0.2rem] text-[0.76rem] font-bold uppercase tracking-[0.08em]">
                      {comment.email}
                    </p>
                  </div>
                  <p className="text-[color:var(--shell-muted)] m-0 mt-[0.2rem] text-[0.76rem] font-bold uppercase tracking-[0.08em]">
                    #{comment.id}
                  </p>
                </div>
                <p className="text-[color:var(--shell-muted)] m-0 whitespace-pre-wrap">{comment.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
})
