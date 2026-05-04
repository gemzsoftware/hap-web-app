export function serialize(value) {
  if (Array.isArray(value)) return value.map((item) => serialize(item));
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Date) return value;

  const source = value.toObject ? value.toObject() : value;
  const object = {};

  for (const [key, item] of Object.entries(source)) {
    if (['_id', '__v', 'passwordHash', 'passwordSalt'].includes(key)) continue;
    object[key] = serialize(item);
  }

  if (source._id) object.id = source._id.toString();
  if (object?.imageUrl) object.image = object.imageUrl;
  return object;
}
