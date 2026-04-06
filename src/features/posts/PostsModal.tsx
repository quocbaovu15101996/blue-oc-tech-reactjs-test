import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from 'react'

type PostsModalProps = {
  open: boolean
  title: string
  description?: string
  onOpenChange: (open: boolean) => void
  className?: string
  children: ReactNode
}

export function PostsModal({
  open,
  title,
  description,
  onOpenChange,
  className,
  children,
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

        ;(firstFocusable ?? dialog).focus()
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
      className={`posts-modal ${className ?? ''}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleClose}
      onCancel={handleCancel}
      tabIndex={-1}
    >
      <div className="posts-modal__surface">
        <header className="posts-modal__header">
          <div className="posts-modal__heading">
            <p className="posts-modal__eyebrow">Modal shell</p>
            <h2 className="posts-modal__title" id={titleId}>
              {title}
            </h2>
          </div>
          <form method="dialog">
            <button className="posts-modal__close" type="submit">
              Close
            </button>
          </form>
        </header>

        {description ? (
          <p className="posts-modal__description" id={descriptionId}>
            {description}
          </p>
        ) : null}

        <div className="posts-modal__body">{children}</div>
      </div>
    </dialog>
  )
}
