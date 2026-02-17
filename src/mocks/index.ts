import { resetAdminMockData } from "#/mocks/admin-db";

export const startMockWorker = async () => {
	const { worker } = await import("#/mocks/browser");
	resetAdminMockData();
	await worker.start({
		onUnhandledRequest: "bypass",
		quiet: true,
	});
};
