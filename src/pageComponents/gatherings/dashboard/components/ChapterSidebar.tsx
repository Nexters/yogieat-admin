import React from "react";

type ChapterBase<ChapterId extends string> = {
	description: string;
	id: ChapterId;
	label: string;
};

type ChapterSidebarProps<ChapterId extends string> = {
	activeChapter: ChapterId;
	chapters: Array<ChapterBase<ChapterId>>;
	onSelectChapter: (chapterId: ChapterId) => void;
};

export function ChapterSidebar<ChapterId extends string>({
	activeChapter,
	chapters,
	onSelectChapter,
}: ChapterSidebarProps<ChapterId>) {
	return (
		<aside className="admin-insight-sidebar">
			<p className="admin-insight-sidebar__title">챕터</p>
			<nav className="admin-insight-sidebar__nav scrollbar-hide">
				{chapters.map((chapter) => (
					<button
						key={chapter.id}
						type="button"
						className={`admin-insight-sidebar__item${
							activeChapter === chapter.id
								? " admin-insight-sidebar__item--active"
								: ""
						}`}
						onClick={() => onSelectChapter(chapter.id)}
					>
						<span>{chapter.label}</span>
						<small>{chapter.description}</small>
					</button>
				))}
			</nav>
		</aside>
	);
}
