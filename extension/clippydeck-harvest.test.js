const test = require('node:test');
const assert = require('node:assert/strict');
const harvest = require('./clippydeck-harvest');

const profile = {
  profile: {id: 'real', privacyMode: 'private-real', synthetic: false},
  content: {customer: {displayName: 'Real Customer'}, slides: {slide001: {title: 'Architecture'}}},
  entities: [{path: 'customer.displayName', type: 'customer', value: 'Real Customer', sensitivity: 'confidential', source: 'authorized-source'}]
};

const card = {
  type: 'AdaptiveCard',
  body: [
    {type: 'TextBlock', text: '${content.customer.displayName}'},
    {type: 'TextBlock', text: '${content.slides.slide001.title} for ${content.customer.displayName}'}
  ]
};

test('resolves exact and interpolated bindings', () => {
  const result = harvest.resolve(card, profile);
  assert.equal(result.body[0].text, 'Real Customer');
  assert.equal(result.body[1].text, 'Architecture for Real Customer');
});

test('fails missing bindings in strict mode', () => {
  assert.throws(() => harvest.resolve('${content.missing}', profile), /Missing binding/);
});

test('syntheticizes without mutating the real profile', () => {
  const result = harvest.syntheticize(profile, {
    replacements: [{path: 'customer.displayName', syntheticValue: 'Contoso'}]
  });
  assert.equal(result.content.customer.displayName, 'Contoso');
  assert.equal(result.entities[0].value, 'Contoso');
  assert.equal(result.entities[0].source, 'synthetic');
  assert.equal(result.entities[0].sensitivity, 'public');
  assert.equal(result.profile.synthetic, true);
  assert.equal(profile.content.customer.displayName, 'Real Customer');
  assert.equal(harvest.audit(result, ['Real Customer']).pass, true);
});

test('rejects prototype-polluting replacement paths', () => {
  assert.throws(() => harvest.syntheticize(profile, {
    replacements: [{path: '__proto__.polluted', syntheticValue: 'yes'}]
  }), /Unsafe binding path/);
  assert.equal({}.polluted, undefined);
});

test('collects binding locations', () => {
  const bindings = harvest.collectBindings(card);
  assert.deepEqual(bindings.map((x) => x.binding), [
    'content.customer.displayName',
    'content.slides.slide001.title'
  ]);
});

test('reports forbidden customer text in values and keys', () => {
  const result = harvest.audit(card, ['Real Customer']);
  assert.equal(result.pass, true);
  const rendered = harvest.resolve(card, profile);
  assert.equal(harvest.audit(rendered, ['Real Customer']).pass, false);
  assert.equal(harvest.audit({'Real Customer asset': true}, ['Real Customer']).findings[0].kind, 'key');
});
