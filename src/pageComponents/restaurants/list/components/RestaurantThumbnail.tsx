import React from "react";

type RestaurantThumbnailProps = {
	imageUrl?: string | null;
	isImageError: boolean;
	onImageError: () => void;
	restaurantName: string;
	sizeClassName: string;
};

const toImageSrc = (value: string | null | undefined): string => {
	if (!value) {
		return "";
	}
	return value.trim();
};

export function RestaurantThumbnail({
	imageUrl,
	isImageError,
	onImageError,
	restaurantName,
	sizeClassName,
}: RestaurantThumbnailProps) {
	const imageSrc = toImageSrc(imageUrl);
	const hasImage = Boolean(imageSrc) && !isImageError;

	return (
		<div className={`admin-restaurant-thumb ${sizeClassName}`}>
			{hasImage ? (
				<img
					src={imageSrc}
					alt={`${restaurantName} 대표 이미지`}
					loading="lazy"
					onError={onImageError}
				/>
			) : (
				<span>NO IMAGE</span>
			)}
		</div>
	);
}
