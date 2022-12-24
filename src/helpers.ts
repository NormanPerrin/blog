import crypto from 'crypto';

export function space(n: number) {
  let acum = ''
  for (let i = 0; i < n; i++) {
    acum += ' '
  }
  return acum
}

export function randomHash() {
  return crypto.randomBytes(16).toString('hex')
}
