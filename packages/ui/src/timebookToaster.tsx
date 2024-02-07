import toast, { Toaster } from 'react-hot-toast'

export const TimebookToaster = () => {
  return (
    <Toaster
      toastOptions={{
        duration: 4000,
        error: {
          ariaProps: { role: 'alert', 'aria-live': 'assertive' },
        },
        position: 'bottom-center',
      }}
    />
  )
}
export const toastError = (message: string) => {
  toast.error(message, { ariaProps: { role: 'alert', 'aria-live': 'assertive' } })
}

export const toastSuccess = (message: string) => {
  toast.success(message)
}
