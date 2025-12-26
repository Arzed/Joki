interface KartuProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export default function Kartu({ children, className = '', title }: KartuProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  )
}
