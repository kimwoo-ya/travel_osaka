import { useRef, useState } from 'react'
import { parseAndValidate } from '../lib/validate'
import { useTripContext } from '../contexts/TripContext'

interface FileUploadProps {
  className?: string
}

export default function FileUpload({ className = '' }: FileUploadProps) {
  const { setConfirmedData } = useTripContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFile(file: File) {
    if (!file.name.endsWith('.json')) {
      setError('JSON 파일만 지원합니다.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const { data, error: parseError } = parseAndValidate(reader.result as string)
      if (data) {
        setError(null)
        setConfirmedData(data)
      } else {
        setError(parseError ?? '알 수 없는 오류')
      }
    }
    reader.onerror = () => setError('파일 읽기에 실패했습니다.')
    reader.readAsText(file)
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        aria-label="일정 JSON 업로드"
        className="flex items-center justify-center w-11 h-11 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai bg-card text-text-light border border-border hover:bg-card-hover hover:text-ai"
      >
        <span aria-hidden="true">📂</span>
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 max-w-xs z-50 whitespace-normal">
          {error}
        </div>
      )}
    </div>
  )
}
