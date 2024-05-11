import { AsyncLocalStorage } from "node:async_hooks";
import { renderToReadableStream } from "react-dom/server";

import { User } from "./user";

const cookiesStorage = new AsyncLocalStorage<Record<string, string>>();

export function cookies() {
	return cookiesStorage.getStore();
}

function parseCookies(request) {
	const cookieHeader = request.headers.get("cookie") || "";
	return Object.fromEntries(
		cookieHeader.split(";").map((cookie) => {
			const [name, ...rest] = cookie.trim().split("=");
			return [name, rest.join("=")];
		}),
	);
}

const server = Bun.serve({
	port: 1234,
	fetch(request) {
		const requestCookies = parseCookies(request);
		return cookiesStorage.run(requestCookies, async () => {
			const stream = await renderToReadableStream(<User />);
			return new Response(stream, {
				headers: {
					"Content-type": "text/html; charset=utf-8",
					"Set-Cookie": `name=${"sysuke"}`,
				},
			});
		});
	},
});
console.log(`Server is running at http://${server.hostname}:${server.port}`);
