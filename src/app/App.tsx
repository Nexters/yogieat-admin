import React from "react";

import { AppRoutes } from "#/app/routes";
import { AppProviders } from "#/providers";

function App() {
	return (
		<AppProviders>
			<AppRoutes />
		</AppProviders>
	);
}

export default App;
