import React from "react";

type TagSize = "small" | "medium";

type TagProps = {
	children: React.ReactNode;
	size?: TagSize;
};

export function Tag({ children, size = "medium" }: TagProps) {
	return <span className={`ui-tag ui-tag--${size}`}>{children}</span>;
}
