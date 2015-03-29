'use strict'

const request = require('requisition')
const assert = require('assert')

const cas = require('..')({
  key: process.env.CAS3_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.CAS3_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.CAS3_BUCKET,
})

const buf = new Buffer(Math.random().toString(36))
let KEY

it('should 404 if the object does not exist', function () {
  return request.get(cas.url('kljasldkfjasdf')).then(function (response) {
    assert(response.status === 403 || response.status === 404)
  })
})

it('should cache a buffer', function () {
  return cas.key(buf, '.txt').then(function (key) {
    KEY = key
    return request.get(cas.url(key)).then(function (response) {
      assert.equal(response.status, 200)
      assert(response.is('text'))
      response.dump()
    })
  })
})

it('should still work if the buffer has already been created', function () {
  return cas.key(buf, '.txt').then(function (key) {
    assert.equal(key, KEY)
    return request.get(cas.url(key)).then(function (response) {
      assert.equal(response.status, 200)
      assert(response.is('text'))
      response.dump()
    })
  })
})

it('should not work if a different type is used', function () {
  return cas.key(buf, 'html').then(function (key) {
    assert(key !== KEY)
    return request.get(cas.url(key)).then(function (response) {
      assert.equal(response.status, 200)
      assert(response.is('html'))
      response.dump()
    })
  })
})

it('should gzip compressible files', function () {
  let buffer = new Buffer(2048)
  buffer.fill(Math.random().toString())
  return cas.key(buffer, 'txt').then(function (key) {
    return request.get(cas.url(key, true)).then(function (response) {
      assert.equal(response.status, 200)
      assert(response.is('text'))
      assert(response.headers['content-encoding'] === 'gzip')
      response.dump()
    })
  })
})
