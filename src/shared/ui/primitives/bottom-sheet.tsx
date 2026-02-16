import React from "react";
import { Button } from "./button";
import { BarGraph } from "./progress";

export function BottomSheet() {
	return (
		<section className="ui-bottom-sheet">
			<div className="ui-bottom-sheet__content">
				<BarGraph value={50} label="4명 중 2명이 제출했어요" />
				<p>아직 입력하지 않은 분들께 링크를 공유해 주세요</p>
			</div>
			<div className="ui-bottom-sheet__actions">
				<Button variant="primary">추천 결과 보기</Button>
				<span className="ui-bottom-sheet__home-indicator" />
			</div>
		</section>
	);
}
