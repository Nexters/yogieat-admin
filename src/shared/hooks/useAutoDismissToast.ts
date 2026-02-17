import { useEffect } from "react";

export const useAutoDismissToast = (
	message: string,
	onDismiss: () => void,
	delayMs = 2200,
) => {
	useEffect(() => {
		if (!message) {
			return;
		}

		const timer = window.setTimeout(() => {
			onDismiss();
		}, delayMs);

		return () => {
			window.clearTimeout(timer);
		};
	}, [delayMs, message, onDismiss]);
};
