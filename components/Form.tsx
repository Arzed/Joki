interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export default function Form({ children, ...props }: FormProps) {
  return (
    <form className="space-y-4" {...props}>
      {children}
    </form>
  )
}
