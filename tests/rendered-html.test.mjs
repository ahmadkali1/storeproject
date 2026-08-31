import assert from "node:assert/strict";
import test from "node:test";

test("renders NORTHLINE metadata and storefront landmarks", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>NORTHLINE — Everyday objects, considered<\/title>/);
  assert.match(html, /<meta name="description" content="A considered edit of accessories/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<h1>Objects that earn their place\.<\/h1>/);
  assert.match(html, /src="\/northline-hero\.png"/);
});
