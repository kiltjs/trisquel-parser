
import assert from 'assert'

import { parseRawTags } from './parse-html'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseRawTags: throws', function () {

  it('html source should be a String', function () {

    assert.throws(function () {
      parseRawTags()
    }, /html source should be a String/)

    assert.throws(function () {
      parseRawTags()
    }, TypeError)

  })

})

describe('parseRawTags({ raw_tags })', function () {

  function _runTestCases (html, raw_tags, result) {

    it(`${ html } [${ raw_tags }]`, function () {

      assert.deepStrictEqual(
        parseRawTags(html, { raw_tags: raw_tags.split(/ *, */) }),
        { ast: result, tag_opened: null },
      )

    })

  }

  [

    [ '<div>', 'script, style, code', [ '<div>' ] ],
    [ '<div data-value="foo">', 'script, style, code', [ '<div data-value="foo">' ] ],

    [ '<div><style>foobar</style></div>', 'script, style, code', ['<div>', { $: 'style', _: 'foobar' }, '</div>'] ],
    [ '<div><style><div>foobar</div></style></div>', 'script, style, code', ['<div>', { $: 'style', _: '<div>foobar</div>' }, '</div>'] ],

    [ '<div><style data-foo="bar"><div>foobar</div></style></div>', 'script, style, code', [
      '<div>', { $: 'style', attrs: { 'data-foo': 'bar' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

    [ '<div><style data-foo=" foo < foobar > bar "><div>foobar</div></style></div>', 'script, style, code', [
      '<div>', { $: 'style', attrs: { 'data-foo': 'foo < foobar > bar' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

    [ `<div><style data-foo="{
      foo: foobar > foo,
      bar: foobar < bar,
    }"><div>foobar</div></style></div>`, 'script, style, code', [
      '<div>', { $: 'style', attrs: { 'data-foo': '{foo: foobar > foo,bar: foobar < bar,}' }, _: '<div>foobar</div>' }, '</div>'
    ] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})


// describe('parseTags({ !raw_tags })', function () {

//   function _runTestCases (html, result) {

//     it(`${ html }`, function () {

//       assert.deepStrictEqual(
//         parseTags(html),
//         { ast: result, tag_opened: null },
//       )

//     })

//   }

//   [

//     [ '<div>', [ { $: 'div' } ] ],
//     [ '<div data-value="foo">', [ { $: 'div', attrs: { 'data-value': 'foo' } } ] ],

//     [ '<div><style>foobar</style></div>', ['<div>', { $: 'style', _: 'foobar' }, '</div>'] ],
//     [ '<div><style><div>foobar</div></style></div>', ['<div>', { $: 'style', _: '<div>foobar</div>' }, '</div>'] ],

//     [ '<div><style data-foo="bar"><div>foobar</div></style></div>', [
//       '<div>', { $: 'style', attrs: { 'data-foo': 'bar' }, _: '<div>foobar</div>' }, '</div>'
//     ] ],

//     [ '<div><style data-foo=" foo < foobar > bar "><div>foobar</div></style></div>', [
//       '<div>', { $: 'style', attrs: { 'data-foo': 'foo < foobar > bar' }, _: '<div>foobar</div>' }, '</div>'
//     ] ],

//     [ `<div><style data-foo="{
//       foo: foobar > foo,
//       bar: foobar < bar,
//     }"><div>foobar</div></style></div>`, [
//       '<div>', { $: 'style', attrs: { 'data-foo': '{foo: foobar > foo,bar: foobar < bar,}' }, _: '<div>foobar</div>' }, '</div>'
//     ] ],

//   ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

// })

/** */
})
/** */
