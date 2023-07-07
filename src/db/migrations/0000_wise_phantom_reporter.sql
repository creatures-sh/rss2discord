CREATE TABLE IF NOT EXISTS `global_metadata` (
	`id` integer PRIMARY KEY NOT NULL,
	`default_channel` text,
	`refresh_interval` integer DEFAULT 30 NOT NULL,
	`bot_metadata` blob
);