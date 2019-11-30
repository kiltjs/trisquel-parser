
import assert from 'assert'

import { parseTags, parseComments } from './parse-html'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseTags: throws', function () {

  it('html source should be a String', function () {

    assert.throws(function () {
      parseTags()
    }, /html source should be a String/)

    assert.throws(function () {
      parseTags()
    }, TypeError)

  })

})

describe('parseTags({ raw_tags })', function () {

  function _runTestCases (html, result, raw_tags = 'script, style, code') {

    it(`${ html } [${ raw_tags }]`, function () {

      assert.deepStrictEqual(
        parseTags(html, { raw_tags: raw_tags.split(/ *, */) }),
        { ast: result, opened_tags: [] },
      )

    })

  }

  [

    [ '<div>', [ '<div>' ] ],
    [ '<div data-value="foo">', [ '<div data-value="foo">' ] ],
    
    [ '<style>foo</style>', [ { $: 'style', _: 'foo' } ] ],

    [ '<div><style>foobar</style></div>', ['<div>', { $: 'style', _: 'foobar' }, '</div>'] ],
    [ '<div><style><div>foobar</div></style></div>', ['<div>', { $: 'style', _: '<div>foobar</div>' }, '</div>'] ],

    [ '<div><style data-foo="bar"><div>foobar</div></style></div>', [
      '<div>', { $: 'style', attrs: { 'data-foo': 'bar' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

    [ '<div><style data-foo=" foo < foobar > bar "><div>foobar</div></style></div>', [
      '<div>', { $: 'style', attrs: { 'data-foo': 'foo < foobar > bar' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

    [ `<div><style data-foo="{
      foo: foobar > foo,
      bar: foobar < bar,
    }"><div>foobar</div></style></div>`, [
      '<div>', { $: 'style', attrs: { 'data-foo': '{foo: foobar > foo,bar: foobar < bar,}' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

describe('parseComments', function () {

  function _runTestCases (html, result) {
    
    it(`${ html }`, function () {

      assert.deepStrictEqual(
        parseComments(html),
        result,
      )

    })

  }

  [

    ['<!-- foo -->', [{ comment: ' foo ' }] ],
    ['<!-- <!-- -->', [{ comment: ' <!-- ' }] ],

    ['<!-- foo --> foobar <!-- bar -->', [{ comment: ' foo ' }, ' foobar ', { comment: ' bar ' }] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

describe('parseTags({ !raw_tags })', function () {

  function _runTestCases (html, result, opened_tags = []) {

    it(`${ html }`, function () {

      assert.deepStrictEqual(
        parseTags(html),
        { ast: result, opened_tags },
      )

    })

  }

  [

    [ '<div>', [ { $: 'div', _: [] } ], [{ $: 'div', _: [] }] ],
    [ '<div data-value="foo">', [ { $: 'div', attrs: { 'data-value': 'foo' }, _: []  } ], [ { $: 'div', attrs: { 'data-value': 'foo' }, _: [] } ] ],

    [ '<div data-value="foo" />', [ { $: 'div', attrs: { 'data-value': 'foo' }, self_closed: true  } ] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

/** */
})
/** */
