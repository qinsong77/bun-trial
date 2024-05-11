import * as React from "react";

import { cookies } from "./index";

export function User() {
	const cookieStore = cookies();

	return (
		<body>
			<h1>cookies()</h1>
			<p>
				This reads <code>name</code> from cookies
			</p>
			<p>
				Names: <code>{cookieStore?.name || "No name"}</code>
			</p>
		</body>
	);
}
