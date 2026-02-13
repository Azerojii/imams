import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Commune {
  id: string
  name: string
  nameAscii: string
  daira: string
}

interface Wilaya {
  code: string
  name: string
  nameAscii: string
  communes: Commune[]
}

let cachedData: Wilaya[] | null = null

function parseCSV(): Wilaya[] {
  if (cachedData) return cachedData

  const csvPath = path.join(process.cwd(), 'algeria_cities.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf8')
  const lines = csvContent.split('\n').filter(l => l.trim())

  // Skip header
  const dataLines = lines.slice(1)

  const wilayaMap = new Map<string, Wilaya>()

  for (const line of dataLines) {
    const parts = line.split(',')
    if (parts.length < 8) continue

    const [id, communeName, communeNameAscii, dairaName, , wilayaCode, wilayaName, wilayaNameAscii] = parts

    if (!wilayaMap.has(wilayaCode)) {
      wilayaMap.set(wilayaCode, {
        code: wilayaCode,
        name: wilayaName.trim(),
        nameAscii: wilayaNameAscii.trim(),
        communes: [],
      })
    }

    wilayaMap.get(wilayaCode)!.communes.push({
      id: id.trim(),
      name: communeName.trim(),
      nameAscii: communeNameAscii.trim(),
      daira: dairaName.trim(),
    })
  }

  // Sort wilayas by code, communes by name
  cachedData = Array.from(wilayaMap.values())
    .sort((a, b) => parseInt(a.code) - parseInt(b.code))
    .map(w => ({
      ...w,
      communes: w.communes.sort((a, b) => a.name.localeCompare(b.name, 'ar')),
    }))

  return cachedData
}

export async function GET() {
  const wilayas = parseCSV()
  return NextResponse.json({ wilayas })
}
