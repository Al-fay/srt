import { xchacha20poly1305 } from "@noble/ciphers/chacha.js"
import { managedNonce, hexToBytes, bytesToHex } from "@noble/ciphers/utils.js"

const SECRET = import.meta.env.VITE_CRYPTO_KEY

const key = hexToBytes(SECRET)

const cipher = managedNonce(xchacha20poly1305)(key)

export function encrypt<T>(data: T) {
  const text = JSON.stringify(data)

  const encrypted = cipher.encrypt(new TextEncoder().encode(text))

  return bytesToHex(encrypted)
}

export function decrypt<T = unknown>(text: string): T {
  const encrypted = hexToBytes(text)

  const decrypted = cipher.decrypt(encrypted)

  const json = new TextDecoder().decode(decrypted)

  return JSON.parse(json) as T
}
