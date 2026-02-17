import { resetAdminMockData } from "./admin-db";

export const startMockWorker = async () => {
	const { worker } = await import("./browser");
	resetAdminMockData();
	await worker.start({
		onUnhandledRequest: "bypass",
		quiet: true,
	});
};
