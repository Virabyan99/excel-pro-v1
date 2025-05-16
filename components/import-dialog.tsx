// components/import-dialog.tsx
'use client'

import Papa from 'papaparse'
import { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useSheetStore } from '@/lib/store/createStore'
import { RowSchema } from '@/lib/schema/sheet'

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
}

export default function ImportDialog({ open, onOpenChange }: Props) {
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [errors, setErrors] = useState<string[] | null>(null)
  const addMultipleRows = useSheetStore((s) => s.addMultipleRows) // Use new action
  const pushUndo = useSheetStore((s) => s.pushUndo)

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    const file = files[0]
    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as unknown[]
        const parsedRows: unknown[][] = []
        const errorList: string[] = []
        ;(data as unknown[][]).forEach((row, idx) => {
          const parse = RowSchema.safeParse(row)
          if (parse.success) parsedRows.push(parse.data)
          else
            errorList.push(`Row ${idx + 1}: ${parse.error.issues[0].message}`)
        })

        if (errorList.length) {
          setErrors(errorList)
          return
        }

        pushUndo() // Save snapshot before import
        addMultipleRows(parsedRows) // Add all rows in one update
        onOpenChange(false) // Close dialog on success
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Import CSV</DialogTitle>
        <DialogDescription>
          Upload a CSV file to import data into the sheet.
        </DialogDescription>
        <div
          className="border-dashed border-2 p-6 text-center rounded cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          onClick={() => fileInput.current?.click()}
        >
          Drag & drop CSV here, or click to choose file
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {errors && (
          <div className="mt-4 text-destructive text-sm space-y-1">
            {errors.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}