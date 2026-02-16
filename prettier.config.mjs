/**
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: "all",
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/shared/styles/globals.css",
	tailwindFunctions: ["cva", "twMerge", "twJoin"],
	tailwindPreserveWhitespace: true,
	tailwindPreserveDuplicates: true,
};

export default config;
