import { describe, expect, it } from "vitest";
import { getAuthToken } from "@/lib/auth";

describe("Auth utils", () => {
  it("returns the Bearer token from headers", async () => {
    const req = { headers: new Headers({ authorization: "Bearer abc123" }) } as any;
    const token = await getAuthToken(req);
    expect(token).toBe("abc123");
  });

  it("returns null when no authorization header", async () => {
    const req = { headers: new Headers() } as any;
    const token = await getAuthToken(req);
    expect(token).toBeNull();
  });
});
