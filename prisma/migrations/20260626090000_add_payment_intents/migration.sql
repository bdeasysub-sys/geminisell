CREATE TABLE `payment_intents` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `invoice_id` VARCHAR(191) NOT NULL,
  `payment_url` VARCHAR(768) NOT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `amount` INTEGER NOT NULL,
  `status` ENUM('pending', 'completed', 'failed', 'canceled') NOT NULL DEFAULT 'pending',
  `transaction_id` VARCHAR(191) NULL,
  `payment_method` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `payment_intents_invoice_id_key`(`invoice_id`),
  INDEX `payment_intents_email_idx`(`email`),
  INDEX `payment_intents_phone_idx`(`phone`),
  INDEX `payment_intents_status_created_at_idx`(`status`, `created_at`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
