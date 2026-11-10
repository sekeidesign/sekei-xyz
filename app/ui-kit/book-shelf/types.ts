export interface Book {
	id: string;
	title: string;
	author: string;
	cover: string;
	coverAlt?: string;
	/** Spine cloth color — book covers rarely have a distinct spine image, so this fakes one. */
	spineColor: string;
	/** Thickness in px — reads as page count. */
	depth?: number;
	/** Out of 5. */
	rating: number;
	/** The book's review, when it has one. */
	href?: string;
}
