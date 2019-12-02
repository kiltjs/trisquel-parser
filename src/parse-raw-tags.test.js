
import assert from 'assert'

import { parseRawTags } from './parse-raw-tags'

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

describe('parseRawTags', function () {

  function _runTestCases (html, result, raw_tags = 'script, style, code') {

    it(`${ html } [${ raw_tags }]`, function () {

      assert.deepStrictEqual(
        parseRawTags(html, raw_tags.split(/ *, */) ),
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

    [`<pre><code class="language-html">
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
<html>
</code></pre>`, ['<pre>', {
      $: 'code', attrs: { class: 'language-html' }, _: `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
<html>
` }, '</pre>' ] ],

    ['<code><script></code>', [{ $: 'code', _: '<script>' }] ],

    ['<code><script><style></style></code>', [{ $: 'code', _: '<script><style></style>' }] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

describe('parseComments', function () {

  function _runTestCases (html, result, options = {}) {
    
    it(`${ html }${ options ? (' | ' + JSON.stringify(options) + ')') : '' }`, function () {

      assert.deepStrictEqual(
        parseRawTags(html, ['code'], options),
        { ast: result, opened_tags: [] },
      )

    })

  }

  [

    ['<!-- foo -->', [{ type: 'comment', _: ' foo ' }] ],
    ['<!-- <!-- -->', [{ type: 'comment', _: ' <!-- ' }] ],

    ['<!-- foo --> foobar <!-- bar -->', [{ type: 'comment', _: ' foo ' }, ' foobar ', { type: 'comment', _: ' bar ' }] ],

    ['<!-- foo <code>foobar</code> bar -->', [{ type: 'comment', _: ' foo <code>foobar</code> bar ' }] ],

    ['<code><!-- foobar --></code>', [{ $: 'code', _: '<!-- foobar -->' }] ],

    ['<code><!-- foobar --></code><!-- foobar -->', [{ $: 'code', _: '<!-- foobar -->' }, { type: 'comment', _: ' foobar ' }] ],

    ['<code><!-- foobar --></code><!-- foobar -->', [{ $: 'code', _: '<!-- foobar -->' }], { remove_comments: true } ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

/** */
})
/** */
