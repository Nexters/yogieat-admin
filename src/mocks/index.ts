import { resetAdminMockData } from "#/mocks/AdminDb";

export const startMockWorker = async () => {
	const { worker } = await import("#/mocks/browser");
	resetAdminMockData();
	await worker.start({
		onUnhandledRequest: "bypass",
		quiet: true,
	});
};
