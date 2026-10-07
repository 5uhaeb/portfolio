// Accept only editable schema fields, never IDs, timestamps or Mongo operators.
function editableFields(Model, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid content');
  const blocked = new Set(['_id', '__v', 'slug', 'order', 'createdAt', 'updatedAt']);
  const allowed = new Set(Object.keys(Model.schema.paths).map(path => path.split('.')[0]).filter(key => !blocked.has(key)));
  const fields = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.has(key)));
  function check(value) {
    if (typeof value === 'string' && value.length > 10000) throw new Error('Content too long');
    if (Array.isArray(value) && value.length > 100) throw new Error('Too many entries');
    if (value && typeof value === 'object') {
      for (const [key, nested] of Object.entries(value)) {
        if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor') throw new Error('Invalid content');
        check(nested);
      }
    }
  }
  check(fields);
  return fields;
}
module.exports = { editableFields };
