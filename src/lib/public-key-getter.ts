import fetch from 'node-fetch'

let key = null

export async function publicKeyGetter(endpoint: string) {
    if (key) return key
    const result = await fetch(endpoint, { method: 'GET' })
    const body = await result.json()
    key = body.key
    return key
}