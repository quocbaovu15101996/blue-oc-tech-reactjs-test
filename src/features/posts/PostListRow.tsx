import { memo } from 'react'

type PostListRowProps = {
  postId: number
  title: string
  isSelected: boolean
  onSelect: (postId: number) => void
}

function PostListRowComponent({ postId, title, isSelected, onSelect }: PostListRowProps) {
  return (
    <li className="m-0">
      <button
        type="button"
        className="grid w-full gap-[0.35rem] rounded-[18px] border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] p-[0.95rem_1rem] text-left text-inherit transition duration-150 ease-out hover:-translate-y-px hover:border-[color:var(--shell-accent)] hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] data-[selected=true]:border-[color:var(--shell-accent)] data-[selected=true]:bg-[var(--shell-accent-soft)] data-[selected=true]:shadow-[inset_0_0_0_1px_var(--shell-accent-soft)] max-[640px]:p-[0.9rem]"
        aria-pressed={isSelected}
        data-selected={isSelected}
        onClick={() => onSelect(postId)}
      >
        <span className="text-[color:var(--shell-muted)] text-[0.75rem] font-bold uppercase tracking-[0.12em]">#{postId}</span>
        <span className="text-[color:var(--shell-text)] text-[0.98rem] leading-[1.35]">{title}</span>
      </button>
    </li>
  )
}

export const PostListRow = memo(PostListRowComponent)
