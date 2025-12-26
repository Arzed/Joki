interface TabelProps {
  headers: string[]
  children: React.ReactNode
}

export default function Tabel({ headers, children }: TabelProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b">
            {headers.map((header, index) => (
              <th key={index} className="p-3">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  )
}
