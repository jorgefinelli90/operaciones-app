'use client'

import { useState } from 'react'
import { Upload, X, Download } from 'lucide-react'

interface CSVData {
  headers: string[]
  rows: Record<string, string>[]
}

interface CSVUploaderProps {
  onDataLoaded?: (data: CSVData) => void
  requiredHeaders?: string[]
}

export function CSVUploader({ onDataLoaded, requiredHeaders }: CSVUploaderProps) {
  const [csvData, setCSVData] = useState<CSVData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseCSV = (content: string): CSVData => {
    const lines = content.trim().split('\n')
    if (lines.length === 0) throw new Error('El archivo CSV está vacío')

    // Parsear headers
    const headerLine = lines[0]
    const headers = headerLine.split(',').map((h) => h.trim().replace(/^"(.*)"$/, '$1'))

    // Parsear filas
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      // Separar por comas, respetando comillas
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        const nextChar = line[j + 1]

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"'
            j++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"(.*)"$/, '$1'))
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim().replace(/^"(.*)"$/, '$1'))

      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }

    return { headers, rows }
  }

  const handleFile = (file: File) => {
    setError(null)

    if (!file.name.endsWith('.csv')) {
      setError('Por favor sube un archivo CSV válido')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = parseCSV(content)

        // Validar headers requeridos
        if (requiredHeaders) {
          const missingHeaders = requiredHeaders.filter((h) => !data.headers.includes(h))
          if (missingHeaders.length > 0) {
            setError(`Faltan columnas requeridas: ${missingHeaders.join(', ')}`)
            return
          }
        }

        setCSVData(data)
        onDataLoaded?.(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
      }
    }

    reader.onerror = () => {
      setError('Error al leer el archivo')
    }

    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const downloadExample = () => {
    const exampleHeaders = requiredHeaders || ['ID', 'Purchase Date', 'Bill-to Name', 'Grand Total (Base)', 'Status']
    const csv = exampleHeaders.join(',') + '\n' + 'B-000001,2024-01-15,Cliente Ejemplo,1000.00,Processing'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ejemplo-pedidos.csv'
    a.click()
  }

  if (!csvData) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <div
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Carga un archivo CSV</p>
              <p className="text-sm text-muted-foreground">O arrastra aquí tu archivo</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
              id="csv-input"
            />
            <label
              htmlFor="csv-input"
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
            >
              Seleccionar archivo
            </label>
            <button
              onClick={downloadExample}
              className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4" />
              Descargar ejemplo
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-medium text-foreground">Archivo cargado</p>
          <p className="text-sm text-muted-foreground">{csvData.rows.length} filas, {csvData.headers.length} columnas</p>
        </div>
        <button
          onClick={() => setCSVData(null)}
          className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Headers Preview */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {csvData.headers.map((header) => (
                <th key={header} className="px-4 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.rows.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-secondary/20">
                {csvData.headers.map((header) => (
                  <td key={`${idx}-${header}`} className="px-4 py-2 text-foreground text-xs whitespace-nowrap truncate max-w-xs">
                    {row[header] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {csvData.rows.length > 5 && (
        <p className="text-xs text-muted-foreground">
          Mostrando 5 de {csvData.rows.length} filas
        </p>
      )}
    </div>
  )
}
