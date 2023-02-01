import toast, { Toaster } from 'react-hot-toast'

export const TimebookToaster = () => {
  return (
    <Toaster
      toastOptions={{
        duration: 7000,
        error: {
          ariaProps: { role: 'alert', 'aria-live': 'assertive' },
        },
      }}
    />
  )
}
export const toastError = (messeage: string) => {
  toast.error(messeage, { ariaProps: { role: 'alert', 'aria-live': 'assertive' } })
}
