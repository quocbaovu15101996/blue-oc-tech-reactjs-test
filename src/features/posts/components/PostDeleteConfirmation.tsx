import { type RefObject } from 'react'

type PostDeleteConfirmationProps = {
  isBusy: boolean
  isDeleting: boolean
  deleteError: string
  confirmButtonRef: RefObject<HTMLButtonElement | null>
  onCancel: () => void
  onConfirm: () => void
}

export function PostDeleteConfirmation({
  isBusy,
  isDeleting,
  deleteError,
  confirmButtonRef,
  onCancel,
  onConfirm,
}: PostDeleteConfirmationProps) {
  return (
    <div className="grid gap-4 px-6 pb-6 pt-1 max-[640px]:px-4 max-[640px]:pb-4" role="alertdialog" aria-live="assertive">
      <div className="grid gap-3 rounded-[24px] border border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] p-4 shadow-[0_18px_50px_rgba(160,54,35,0.08)]">
        <div className="grid gap-1">
          <h4 className="m-0 text-[1.05rem] leading-[1.25] tracking-[-0.03em] text-[color:var(--shell-text)]">
            Delete this post?
          </h4>
          <p className="text-[color:var(--shell-muted)] m-0 leading-[1.5]">This action removes the post immediately.</p>
        </div>
      </div>
      {deleteError ? (
        <p className="m-0 rounded-[18px] border border-[color:var(--posts-detail-error-border)] bg-[color:rgba(160,54,35,0.08)] px-4 py-3 font-semibold text-[color:var(--posts-detail-error)]">
          {deleteError}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-end gap-2 max-[640px]:justify-stretch">
        <button
          className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[1rem] py-[0.78rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_22px_40px_rgba(44,26,12,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)] disabled:cursor-wait disabled:opacity-70 max-[640px]:flex-1"
          type="button"
          onClick={onCancel}
          disabled={isBusy}
        >
          Cancel
        </button>
        <button
          className="rounded-full border border-[color:var(--posts-detail-error-border)] bg-[linear-gradient(180deg,var(--posts-detail-error-surface-start)_0%,var(--posts-detail-error-surface-end)_100%)] px-[1rem] py-[0.78rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[color:var(--posts-detail-error)] transition duration-150 ease-out hover:-translate-y-px hover:shadow-[0_22px_40px_rgba(160,54,35,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--posts-detail-error)] disabled:cursor-wait disabled:opacity-70 max-[640px]:flex-1"
          type="button"
          onClick={onConfirm}
          disabled={isBusy}
          ref={confirmButtonRef}
        >
          {isDeleting ? 'Deleting…' : 'Delete post'}
        </button>
      </div>
    </div>
  )
}
