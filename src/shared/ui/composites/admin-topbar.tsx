import type { ReactNode } from "react";

type AdminTopbarProps = {
	actions: ReactNode;
	actionsClassName?: string;
	eyebrow: string;
	subtitle?: ReactNode;
	title: ReactNode;
};

export function AdminTopbar({
	actions,
	actionsClassName,
	eyebrow,
	subtitle,
	title,
}: AdminTopbarProps) {
	return (
		<header className="admin-topbar">
			<div className="admin-topbar__title-wrap">
				<p className="admin-topbar__eyebrow caption-12-sb">{eyebrow}</p>
				<h1 className="heading-22-bd">{title}</h1>
				{subtitle ? (
					<p className="admin-topbar__mode caption-12-md">
						{subtitle}
					</p>
				) : null}
			</div>
			<div
				className={`admin-topbar__actions${actionsClassName ? ` ${actionsClassName}` : ""}`}
			>
				{actions}
			</div>
		</header>
	);
}
