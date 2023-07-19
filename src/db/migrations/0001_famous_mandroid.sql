CREATE TABLE IF NOT EXISTS `feeds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`feed_url` text NOT NULL,
	`page_url` text NOT NULL,
	`title` text,
	`description` text,
	`link` text,
	`last_item_guid` text,
	`last_item_pub_date` text
);
