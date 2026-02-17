import React from "react";

type DetailImagePanelProps = {
	hasImage: boolean;
	imageSrc: string;
	onImageError: () => void;
	restaurantName: string;
};

export function DetailImagePanel({
	hasImage,
	imageSrc,
	onImageError,
	restaurantName,
}: DetailImagePanelProps) {
	return (
		<div className="admin-detail-image-panel">
			{hasImage ? (
				<img
					src={imageSrc}
					alt={`${restaurantName} 대표 이미지`}
					className="admin-detail-image"
					onError={onImageError}
				/>
			) : (
				<div className="admin-detail-image admin-detail-image--fallback">
					<span>이미지를 불러올 수 없습니다.</span>
				</div>
			)}
		</div>
	);
}
