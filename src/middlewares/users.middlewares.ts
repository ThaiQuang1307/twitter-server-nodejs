import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

config()

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_VALIDATION.REQUIRE },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_VALIDATION.FORMAT },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD.REQUIRE },
        isString: true,
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD.FORMAT
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD.FORMAT
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: USERS_MESSAGES.NAME_VALIDATION.REQUIRE },
        isString: true,
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USERS_MESSAGES.NAME_VALIDATION.LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_VALIDATION.REQUIRE },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_VALIDATION.FORMAT },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistsEmail = await usersService.checkEmailExist(value)
            if (isExistsEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_VALIDATION.EXIST)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD.REQUIRE },
        isString: true,
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD.FORMAT
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD.FORMAT
        }
      },
      confirm_password: {
        notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD.REQUIRE },
        isString: true,
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD.FORMAT
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD.FORMAT
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD.CONFIRM)
            }
            return true
          }
        }
      },
      date_of_birth: {
        notEmpty: { errorMessage: USERS_MESSAGES.DATE_OF_BIRTH.REQUIRE },
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USERS_MESSAGES.DATE_OF_BIRTH.IS_ISO8601
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: { errorMessage: USERS_MESSAGES.ACCESS_TOKEN.REQUIRE },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN.REQUIRE,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN.IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN.REQUIRE },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, check_refresh_token_DB] = await Promise.all([
                verifyToken({ token: value }),
                databaseService.refreshToken.findOne({ token: value })
              ])

              if (check_refresh_token_DB === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN.NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN.IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)
