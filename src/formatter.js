import Errors from 'restify-errors'
import _ from 'lodash'

function createError(status = '500', title = 'Internal Server Error', detail) {
  if (_.isEmpty(detail)) {
    return { status, title }
  }
  return { status, title, detail }
}

function handleError(res, body) {
  if (body instanceof Errors.ForbiddenError) {
    res.status(403)
    return {
      errors: [createError('403', 'Forbidden', body.message)]
    }
  }

  if (body instanceof Errors.NotFoundError) {
    res.status(404)
    return {
      errors: [createError('404', 'Resource Not Found', body.message)]
    }
  }

  if (body.jse_cause && body.jse_cause instanceof SyntaxError) {
    res.status(400)
    return {
      errors: [createError('400', 'Bad Request', body.message)]
    }
  }

  res.status(500)
  return {
    errors: [createError('500', 'Internal Server Error', body.message)]
  }
}

export default function handleJsonApi(req, res, body, cb) {
  res.setHeader('content-type', 'application/vnd.api+json')
  if (body instanceof Error) {
    console.log('ERROR', body)
    const errorResponse = handleError(res, body)
    return cb(null, JSON.stringify(errorResponse))
  }
  const data = (body) ? JSON.stringify(body) : 'null'
  return cb(null, data)
}

export function sendUnsupportedType(req, res) {
  res.send(415)
}
