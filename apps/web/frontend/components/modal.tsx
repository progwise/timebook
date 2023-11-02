import { ReactNode } from 'react'

interface ModalProps {
  open?: boolean
  onClose?: () => void
  title: string
  actions: JSX.Element
  variant?: 'oneColumn' | 'twoColumns'
  children?: ReactNode
}

export const Modal = ({
  open = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  title,
  actions,
  children,
}: ModalProps): JSX.Element => {
  return (
    <dialog open={open} onClose={onClose} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        {children && <p className="py-4">{children}</p>}
        <div className="flex flex-col flex-wrap gap-4 self-end sm:flex-row sm:justify-end">{actions}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
