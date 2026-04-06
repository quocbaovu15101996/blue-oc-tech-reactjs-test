import { memo } from 'react'

type PostListRowProps = {
  postId: number
  title: string
  isSelected: boolean
  onSelect: (postId: number) => void
}

function PostListRowComponent({ postId, title, isSelected, onSelect }: PostListRowProps) {
  return (
    <li className="posts-list__item">
      <button
        type="button"
        className="posts-list__button"
        aria-pressed={isSelected}
        data-selected={isSelected}
        onClick={() => onSelect(postId)}
      >
        <span className="posts-list__id">#{postId}</span>
        <span className="posts-list__title">{title}</span>
      </button>
    </li>
  )
}

export const PostListRow = memo(PostListRowComponent)
