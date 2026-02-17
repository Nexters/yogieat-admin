import { PropsWithChildren } from "react";

import { AuthProvider } from "#/providers/AuthProvider";
import { QueryProvider } from "#/providers/QueryProvider";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<QueryProvider>
			<AuthProvider>{children}</AuthProvider>
		</QueryProvider>
	);
}
