import React from "react";

import { SystemIllustration } from "#/shared/ui/primitives/illustration";

export function Toast({ message }: { message: string }) {
	return (
		<div className="ui-toast" role="status" aria-live="polite">
			<SystemIllustration type="exclamation" />
			<span>{message}</span>
		</div>
	);
}
