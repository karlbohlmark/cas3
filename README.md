
# cas3

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

S3-backed content addressable storage.
Store files by their sha256 sum.
Automatically compresses it in S3 if it's compressible.

## var cas = new CAS(options)

```js
var CAS = require('cas3')
var cas = new CAS(options)
```

Options are:

- `bucket` - s3 bucket name
- `key` - s3 key
- `secret` - s3 secret key
- `cdn` - optional CDN host, defaulting to the s3 bucket, such as `https://lakjsflkajfd.cloudfront.net`

### cas.key(buffer | string, extension).then( key => )

Get an S3 key from a string or a buffer and an extension.

```js
var key = await cas.key('some string', 'txt')
```

### var url = cas.url(key, cdn?)

Get a URL for the key, depending on whether you'd like to use the S3 bucket directly or a CDN.

[gitter-image]: https://badges.gitter.im/mgmtio/cas3.png
[gitter-url]: https://gitter.im/mgmtio/cas3
[npm-image]: https://img.shields.io/npm/v/cas3.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cas3
[github-tag]: http://img.shields.io/github/tag/mgmtio/cas3.svg?style=flat-square
[github-url]: https://github.com/mgmtio/cas3/tags
[travis-image]: https://img.shields.io/travis/mgmtio/cas3.svg?style=flat-square
[travis-url]: https://travis-ci.org/mgmtio/cas3
[coveralls-image]: https://img.shields.io/coveralls/mgmtio/cas3.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/mgmtio/cas3
[david-image]: http://img.shields.io/david/mgmtio/cas3.svg?style=flat-square
[david-url]: https://david-dm.org/mgmtio/cas3
[license-image]: http://img.shields.io/npm/l/cas3.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/cas3.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/cas3
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
