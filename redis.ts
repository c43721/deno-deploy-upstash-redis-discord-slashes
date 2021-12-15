export async function getRedis(key: string) {
  const REDIS_KEY = Deno.env.get("REDIS_KEY");
  const REDIS_URL = Deno.env.get("REDIS_URL");

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${REDIS_KEY}`);

  const res = await fetch(`${REDIS_URL}/get/${key}`, { headers });

  const json = await res.json();

  return json;
}

export async function setRedis(key: string, value: string) {
  const REDIS_KEY = Deno.env.get("REDIS_KEY");
  const REDIS_URL = Deno.env.get("REDIS_URL");

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${REDIS_KEY}`);

  const res = await fetch(`${REDIS_URL}/set/${key}`, {
    headers,
    method: "POST",
    body: JSON.stringify(value),
  });

  const json = await res.json();

  return json;
}
