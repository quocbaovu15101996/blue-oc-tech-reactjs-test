type PostDetailHeaderProps = {
  postId: number
  userId: number
  isFetching: boolean
}

export function PostDetailHeader({ postId, userId, isFetching }: PostDetailHeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 max-[960px]:flex-col">
        <p className="text-[color:var(--shell-muted)]">Selected post</p>
        <p className="text-[color:var(--shell-accent)] whitespace-nowrap text-[0.76rem] font-bold uppercase tracking-[0.08em]">
          {isFetching ? 'Refreshing detail…' : 'Loaded'}
        </p>
      </div>

      <div className="flex flex-wrap gap-[0.45rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-muted)]">
        <span className="border border-[color:var(--shell-border)] rounded-full bg-[var(--shell-surface)] px-[0.62rem] py-[0.42rem]">
          #{postId}
        </span>
        <span className="border border-[color:var(--shell-border)] rounded-full bg-[var(--shell-surface)] px-[0.62rem] py-[0.42rem]">
          User {userId}
        </span>
      </div>
    </>
  )
}
