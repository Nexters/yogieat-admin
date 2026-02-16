import React from "react";

const ICON_GLYPH: Record<string, string> = {
	"arrow-left": "←",
	"search-01": "⌕",
	"x-03": "×",
	check: "✓",
};

export const ARROW_ICON_NAMES = [
	"arrow-curve-left-down",
	"arrow-curve-left-right",
	"arrow-curve-left-up",
	"arrow-down-left",
	"arrow-curve-up-left",
	"arrow-curve-right-up",
	"arrow-left-square-contained",
	"arrow-right-square-contained",
	"arrow-up-square-contained",
	"arrow-down-square-contained",
	"arrow-expand-01",
	"arrow-expand-02",
	"arrow-expand-03",
	"arrow-expand-04",
	"arrow-up",
	"arrow-right",
	"arrow-left",
	"arrow-up-left",
	"arrow-down-right",
	"arrow-switch-horizontal",
	"arrow-switch-vertical",
	"arrow-refresh-01",
	"arrow-refresh-02",
	"arrow-refresh-03",
	"chevron-double-down",
	"chevron-double-left",
	"chevron-double-right",
	"chevron-double-up",
	"chevron-down",
	"chevron-left",
	"chevron-right",
	"chevron-up",
];

export const GENERAL_ICON_NAMES = [
	"activity",
	"edit-01",
	"home-04",
	"percent-01",
	"toggle-right",
	"add-square-01",
	"edit-02",
	"home-05",
	"percent-02",
	"toggle-left",
	"calendar-01",
	"email",
	"image",
	"plus-01",
	"trash-01",
	"calendar-02",
	"embed",
	"information-circle-contained",
	"plus-02",
	"trash-02",
	"cancel-left",
	"eye-open",
	"lightning-filled",
	"paperclip",
	"upload-01",
	"check",
	"eye-closed",
	"link",
	"progress",
	"upload-02",
	"clock-square-broken",
	"expand-01",
	"link-angled",
	"quote",
	"variant",
	"component",
	"favourite",
	"link-external",
	"save-01",
	"x-01",
	"dash",
	"filter",
	"loader-01",
	"save-02",
	"x-02",
	"download",
	"globe",
	"logout-01",
	"search-01",
	"x-03",
	"download-01",
	"hash-01",
	"menu-01",
	"settings",
	"x-circle-contained",
	"help",
	"menu-02",
	"share",
	"x-square-contained",
];

export function Icon({ name }: { name: string }) {
	const glyph = ICON_GLYPH[name];
	return (
		<span className="ui-icon" aria-label={name} title={name}>
			{glyph ? (
				<span className="ui-icon__glyph">{glyph}</span>
			) : (
				<span className="ui-icon__fallback" />
			)}
		</span>
	);
}
