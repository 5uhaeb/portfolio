// Only the backend holds this database-scoped credential.
class Drivebase {
  constructor({
    url = process.env.DRIVEBASE_API_URL,
    id = process.env.DRIVEBASE_DATABASE_ID,
    key = process.env.DRIVEBASE_API_KEY,
    fetcher = fetch,
  } = {}) {
    this.url = url?.replace(/\/$/, "");
    this.id = id;
    this.key = key;
    this.fetcher = fetcher;
    this.cache = new Map();
    this.queues = new Map();
  }
  async request(path, method = "GET", body) {
    if (!this.url || !this.id || !this.key)
      throw new Error("Drivebase server configuration is required");
    const response = await this.fetcher(
      `${this.url}/databases/${encodeURIComponent(this.id)}${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${this.key}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(90000),
      },
    );
    if (!response.ok)
      throw new Error(`Drivebase storage request failed (${response.status})`);
    return response.json();
  }
  async ready() {
    await this.request("/schema");
  }
  async list(collection) {
    const cached = this.cache.get(collection);
    if (cached && cached.expires > Date.now())
      return structuredClone(await cached.promise);
    const promise = (async () => {
      const rows = [];
      for (let offset = 0; ; offset += 100) {
        const page = await this.request(
          `/collections/${collection}/documents?offset=${offset}`,
        );
        rows.push(...page.documents.map((d) => d.data));
        if (page.documents.length < 100) return rows;
      }
    })();
    this.cache.set(collection, { expires: Date.now() + 10000, promise });
    try {
      return structuredClone(await promise);
    } catch (error) {
      this.cache.delete(collection);
      throw error;
    }
  }
  async put(collection, document) {
    const data = JSON.parse(JSON.stringify(document));
    await this.request(
      `/collections/${collection}/documents/${encodeURIComponent(data._id)}`,
      "PUT",
      { data },
    );
    this.cache.delete(collection);
    return data;
  }
  async remove(collection, id) {
    await this.request(
      `/collections/${collection}/documents/${encodeURIComponent(id)}`,
      "DELETE",
    );
    this.cache.delete(collection);
  }
  serial(collection, fn) {
    const pending = (this.queues.get(collection) || Promise.resolve())
      .catch(() => {})
      .then(fn);
    this.queues.set(collection, pending);
    return pending.finally(() => {
      if (this.queues.get(collection) === pending)
        this.queues.delete(collection);
    });
  }
}
module.exports = new Drivebase();
module.exports.Drivebase = Drivebase;
