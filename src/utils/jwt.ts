import jwt from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: object | string | Buffer
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) =>
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  )
}
