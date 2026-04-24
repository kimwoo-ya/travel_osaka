import pako from 'pako'
import type { ConfirmedItinerary } from '../data/confirmed-types'

// ─── base64url ───

function toBase64url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (base64.length % 4)) % 4
  const padded = base64 + '='.repeat(pad)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// ─── Compress / Decompress ───

export function compressItinerary(data: ConfirmedItinerary): string {
  const json = JSON.stringify(data)
  const compressed = pako.deflateRaw(new TextEncoder().encode(json))
  return toBase64url(compressed)
}

export function decompressItinerary(encoded: string): ConfirmedItinerary | null {
  try {
    const compressed = fromBase64url(encoded)
    const json = new TextDecoder().decode(pako.inflateRaw(compressed))
    return JSON.parse(json) as ConfirmedItinerary
  } catch (e) {
    console.warn('[compress] decompression failed:', e)
    return null
  }
}
