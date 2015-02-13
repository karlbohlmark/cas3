
var compressible = require('compressible')
var debug = require('debug')('cas')
var mime = require('mime-types')
var assert = require('assert')
var crypto = require('crypto')
var zlib = require('mz/zlib')
var knox = require('knox')

module.exports = CAS

function CAS(options) {
  if (!(this instanceof CAS)) return new CAS(options)

  assert(options.key, 'AWS key required.')
  assert(options.secret, 'AWS secret required.')
  assert(options.bucket, 'AWS bucket required.')

  this.client = knox.createClient(options)
  this.s3host = 'https://' + options.bucket + '.s3.amazonaws.com'
  this.cdn = options.cdn || this.s3host
}

CAS.prototype.url = function (key, cdn) {
  if (cdn) return this.cdn + '/' + key
  return this.s3host + '/' + key
}

CAS.prototype.key = function (buf, ext) {
  var type = mime.lookup(ext)
  if (!type) return Promise.reject(new Error('Unknown extension: ' + ext))

  var hash = crypto.createHash('sha256')
    .update(buf)
    .digest('hex')

  var key = hash + '.' + ext
  var client = this.client

  // check if it exists
  return new Promise(function (resolve, reject) {
    client.head(key).on('response', function (res) {
      if (res.statusCode === 200) {
        res.resume()
        resolve(key)
        return
      }

      // TODO: handle this
      res.setEncoding('utf8')
      res.on('data', function (str) {
        debug(str)
      })

      reject(new Error('DNE'))
    }).on('error', reject).end()
  }).catch(function (err) {
    if (err.message !== 'DNE') throw err
    return Promise.resolve(compressible(type) ? zlib.gzip(buf) : null)
    .then(function (buf2) {
      var headers = {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': mime.contentType(type),
        'x-amz-acl': 'public-read',
      }

      var compress = Buffer.isBuffer(buf2) && buf2.length < buf.length
      if (compress) {
        buf = buf2
        headers['Content-Encoding'] = 'gzip'
      }

      headers['Content-Length'] = buf.length

      return new Promise(function (resolve, reject) {
        client.putBuffer(buf, key, headers, function (err, res) {
          if (err) return reject(err)
          res.resume()
          resolve(key)
        })
      })
    })
  })
}
