ALTER TABLE `orders`
  DROP INDEX `orders_email_idx`,
  DROP INDEX `orders_phone_idx`,
  ADD UNIQUE INDEX `orders_email_key`(`email`),
  ADD UNIQUE INDEX `orders_phone_key`(`phone`);
