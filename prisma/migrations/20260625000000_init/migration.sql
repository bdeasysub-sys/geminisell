CREATE TABLE `links` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `link` VARCHAR(768) NOT NULL,
  `status` ENUM('available', 'sold') NOT NULL DEFAULT 'available',
  `assigned_to` VARCHAR(191) NULL,
  `payment_id` VARCHAR(191) NULL,
  `assigned_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `links_link_key`(`link`),
  UNIQUE INDEX `links_payment_id_key`(`payment_id`),
  INDEX `links_status_id_idx`(`status`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `payment_id` VARCHAR(191) NOT NULL,
  `link_id` INTEGER NOT NULL,
  `assigned_link` VARCHAR(768) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `orders_payment_id_key`(`payment_id`),
  UNIQUE INDEX `orders_link_id_key`(`link_id`),
  INDEX `orders_customer_name_idx`(`customer_name`),
  INDEX `orders_email_idx`(`email`),
  INDEX `orders_phone_idx`(`phone`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_link_id_fkey`
  FOREIGN KEY (`link_id`) REFERENCES `links`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
