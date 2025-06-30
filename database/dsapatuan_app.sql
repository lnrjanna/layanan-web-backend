-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 02:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dsapatuan_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `size` varchar(10) DEFAULT NULL,
  `checked` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_user`
--

CREATE TABLE `data_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_user`
--

INSERT INTO `data_user` (`id`, `user_id`, `first_name`, `last_name`, `email`, `address`, `phone_number`, `date_of_birth`, `location`, `postal_code`, `gender`, `profile_photo`, `created_at`, `updated_at`) VALUES
(8, 18, 'ilma', 'Amalia', 'ilmaamalia1502@gmail.com', 'rajapolah', '087722585319', '2025-06-04', 'jawa barat', '000000', 'female', '1750595381095-3d Cartoon Images - Free Download on Freepik.jpg', '2025-06-22 12:28:47', '2025-06-22 14:27:44'),
(9, 23, 'Lia', 'Nurjannah', 'lia@gmail.com', 'Cikalang', '0834651456876', '2025-06-11', 'jawa barat', '000000', 'female', '1750654110239-3D Cartoon Avatar of a Woman Minimal 3D Character _ Premium AI-generated image.jpg', '2025-06-23 04:47:17', '2025-06-23 04:48:30'),
(10, 24, 'Silvi', 'Widiasari', 'silvi@gmail.com', 'Karangnunggal', '081122334455', '2025-06-02', 'jawa barat', '000000', 'female', NULL, '2025-06-23 04:49:06', '2025-06-23 04:59:35'),
(11, 25, NULL, NULL, 'kania@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 17:20:11', '2025-06-23 17:20:11'),
(12, 26, NULL, NULL, 'ismi@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-24 15:05:41', '2025-06-24 15:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_price` decimal(10,2) NOT NULL,
  `shipping_address` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_date`, `total_price`, `shipping_address`, `payment_method`, `status`) VALUES
(2, 18, '2025-06-24 09:18:28', 1964000.00, 'Jl. Ajibarang - Wangon, Winong, Karangbawang, Kec. Ajibarang, Kabupaten Banyumas, Jawa Tengah 53163', 'Card', 'DONE'),
(3, 18, '2025-06-24 10:20:36', 1964000.00, NULL, 'DANA', 'DONE'),
(4, 18, '2025-06-24 12:29:59', 2965000.00, NULL, 'OVO', 'done'),
(5, 18, '2025-06-24 13:07:54', 1964000.00, NULL, 'BNI', 'done'),
(6, 18, '2025-06-24 14:35:37', 3063300.00, NULL, 'Gopay', 'done'),
(7, 18, '2025-06-24 14:56:45', 3402300.00, NULL, 'DANA', 'delivered'),
(8, 18, '2025-06-24 15:01:51', 1964000.00, NULL, 'DANA', 'packed'),
(9, 18, '2025-06-24 15:02:04', 1564000.00, NULL, 'DANA', 'pending'),
(10, 18, '2025-06-25 01:51:30', 1225000.00, NULL, 'OVO', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `size`, `price`) VALUES
(3, 2, 2, 1, '40', 1999000.00),
(4, 3, 2, 1, '39', 1999000.00),
(5, 4, 3, 1, '38', 3000000.00),
(6, 5, 2, 1, '39', 1999000.00),
(7, 6, 7, 1, '39', 999000.00),
(8, 6, 4, 1, '37', 1260000.00),
(9, 6, 5, 1, '38', 839300.00),
(10, 7, 5, 1, '38', 839300.00),
(11, 7, 6, 1, '38', 1599000.00),
(12, 7, 7, 1, '39', 999000.00),
(13, 8, 2, 1, '39', 1999000.00),
(14, 9, 6, 1, '40', 1599000.00),
(15, 10, 4, 1, '37', 1260000.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sizes` varchar(255) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `status` enum('active','deleted') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `stock`, `price`, `weight`, `description`, `sizes`, `images`, `status`, `created_at`) VALUES
(2, 'Puma Speedcat TTF  ', 'PUMA', 20, 1999000, 1498.00, 'Puma Speedcat TTF ', '[39,40]', '[\"uploads/products/1750696464125-Screenshot 2025-05-10 162823.png\"]', 'active', '2025-06-23 12:19:26'),
(3, 'Newbalance', 'Newbalance', 4, 3000000, 99.00, 'svhjguki', '[37,38]', '[\"uploads/products/1750700680946-Screenshot 2025-05-10 165512.png\"]', 'active', '2025-06-23 17:44:41'),
(4, 'Adidas Trail Running ', 'Adidas', 12, 1260000, 1199.00, 'Adidas Trail Running ', '[36,37,38,39,40]', '[\"uploads/products/1750775279374-Screenshot 2025-05-10 164841.png\"]', 'active', '2025-06-24 14:27:59'),
(5, 'Puma Milenio Tech', 'Puma', 10, 839300, 1199.00, 'Puma Milenio Tech', '[36,37,38,39,40]', '[\"uploads/products/1750775366994-Screenshot 2025-05-10 162624.png\"]', 'active', '2025-06-24 14:29:26'),
(6, 'New Balance 574', 'New Balance', 10, 1599000, 12000.00, 'New Balance 574', '[38,39,40]', '[\"uploads/products/1750775448378-Screenshot 2025-05-10 164027.png\"]', 'active', '2025-06-24 14:30:48'),
(7, 'Converse Chuck Taylor', 'Converse', 10, 999000, 1200.00, 'Converse Chuck Taylor', '[38,39,40]', '[\"uploads/products/1750775543930-Screenshot 2025-05-10 164530.png\"]', 'active', '2025-06-24 14:32:23'),
(8, 'Nikr=e', 'asdfg', 1, 0, 15.00, 'aaaaaa', '[37]', '[\"uploads/products/1750817631023-download (26).jpg\"]', 'active', '2025-06-25 02:13:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(9, 'Admin', 'dsapatuan@admin.com', '$2b$10$GGLfavZlS8c9QdgTtwuStuYGQYiMc7DeZMryBSHRotdh3k3zpHZNC', 'admin', '2025-06-21 09:09:50'),
(18, 'Ilma Amalia', 'ilmaamalia1502@gmail.com', '$2b$10$9k3ijKiZWPcUqQz5d/vLTujXbziio35LLevs3ZZhH00bBaHzssaUK', 'user', '2025-06-22 12:28:47'),
(23, 'Lia Nurjannah', 'lia@gmail.com', '$2b$10$fglc8sfLoQdDj2N5pAwbOOTnvT0nVSYiuwDqaGBcorp0qiEUTLaEW', 'user', '2025-06-23 04:47:17'),
(24, 'Silvi Widiasari', 'silvi@gmail.com', '$2b$10$En1zs9FQlAVDaxGM8pvUYOjpUwGmGR7fIxaH6GDUhx4Np1T0j3We2', 'user', '2025-06-23 04:49:06'),
(25, 'Kania Rahma', 'kania@gmail.com', '$2b$10$9sOBRcZEfzazxty9aYoNBudzdUWnaFwGTqNHbfoBK48DUQ5eTh0l2', 'user', '2025-06-23 17:20:11'),
(26, 'ismi', 'ismi@gmail.com', '$2b$10$tsEXP1V7fiCk7E210GCunOcfBlFMTi3uCo8QY8qJJdoZjxdUqAo7O', 'user', '2025-06-24 15:05:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart` (`user_id`,`product_id`,`size`),
  ADD KEY `fk_cart_product` (`product_id`);

--
-- Indexes for table `data_user`
--
ALTER TABLE `data_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `data_user`
--
ALTER TABLE `data_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_user`
--
ALTER TABLE `data_user`
  ADD CONSTRAINT `data_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
