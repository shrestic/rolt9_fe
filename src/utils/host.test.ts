import { describe, it, expect } from "vitest";
import { apiHostname, canonicalHostRedirect } from "./host";

describe("apiHostname", () => {
	it("extracts the hostname from the API base URL", () => {
		expect(apiHostname("http://localhost:8000/api/v1")).toBe("localhost");
	});

	it("returns null for an invalid URL", () => {
		expect(apiHostname("not a url")).toBeNull();
	});
});

describe("canonicalHostRedirect", () => {
	const onLocalhost = "localhost";

	it("redirects 127.0.0.1 to the canonical host, preserving port/path/query", () => {
		const loc = {
			hostname: "127.0.0.1",
			href: "http://127.0.0.1:5173/dashboard?x=1",
		};
		expect(canonicalHostRedirect(loc, onLocalhost)).toBe(
			"http://localhost:5173/dashboard?x=1"
		);
	});

	it("redirects a LAN IP to the canonical host", () => {
		const loc = {
			hostname: "172.20.10.3",
			href: "http://172.20.10.3:5173/",
		};
		expect(canonicalHostRedirect(loc, onLocalhost)).toBe("http://localhost:5173/");
	});

	it("returns null when already on the canonical host", () => {
		const loc = {
			hostname: "localhost",
			href: "http://localhost:5173/dashboard",
		};
		expect(canonicalHostRedirect(loc, onLocalhost)).toBeNull();
	});

	it("returns null when the canonical host can't be determined", () => {
		const loc = { hostname: "127.0.0.1", href: "http://127.0.0.1:5173/" };
		expect(canonicalHostRedirect(loc, null)).toBeNull();
	});
});
