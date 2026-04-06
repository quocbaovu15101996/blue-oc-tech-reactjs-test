import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from 'react'

type PostsModalProps = {
  open: boolean
  title: string
  description?: string
  onOpenChange: (open: boolean) => void
  className?: string
  compact?: boolean
  children: ReactNode
  isShowCloseButton?: boolean
}

export function PostsModal({
  open,
  title,
  description,
  onOpenChange,
  className,
  compact = false,
  children,
  isShowCloseButton = true
}: PostsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()

      requestAnimationFrame(() => {
        const firstFocusable = dialog.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

          ; (firstFocusable ?? dialog).focus()
      })
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleClose = () => {
    onOpenChange(false)
    lastFocusedElementRef.current?.focus()
  }

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement, Event>) => {
    event.preventDefault()
    onOpenChange(false)
  }

  return (
    <dialog
      ref={dialogRef}
      className={(`m-auto fixed inset-0 ${compact ? 'w-fit h-fit max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)]' : 'w-max h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)]'} border-0 bg-transparent p-0 overflow-hidden text-inherit backdrop:bg-[#201913]/60 backdrop:backdrop-blur-sm ${className ?? ''}`).trim()}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleClose}
      onCancel={handleCancel}
      tabIndex={-1}
    >
      <div className={`flex ${compact ? 'h-auto' : 'h-full'} flex-col overflow-hidden rounded-[32px] border border-[color:var(--shell-border)] bg-[linear-gradient(180deg,var(--shell-surface-strong)_0%,var(--shell-surface)_100%)] shadow-[0_36px_96px_rgba(29,17,10,0.24)] max-[640px]:rounded-[24px]`}>
        <header className="flex items-start justify-between gap-4 px-6 pb-3 pt-[1.2rem] max-[640px]:px-4 max-[640px]:pt-4">
          <div className="grid min-w-0 gap-1">
            <h2 className="text-[color:var(--shell-text)] m-0 text-[1.35rem] leading-[1.1] tracking-[-0.03em] max-[640px]:text-[1.2rem]" id={titleId}>
              {title}
            </h2>
          </div>
          {isShowCloseButton && <form method="dialog">
            <button className="rounded-full border border-[color:var(--shell-border)] bg-[var(--shell-surface-strong)] px-[0.9rem] py-[0.65rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[color:var(--shell-text)] transition duration-150 ease-out hover:-translate-y-px hover:border-[color:var(--shell-accent)] hover:shadow-[0_32px_90px_rgba(44,26,12,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-accent)]" type="submit">
              Close
            </button>
          </form>}
        </header>

        {description ? (
          <p className="text-[color:var(--shell-muted)] m-0 px-6 pb-4 max-[640px]:px-4" id={descriptionId}>
            {description}
          </p>
        ) : null}

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-0">{children}</div>
      </div>
    </dialog>
  )
}
