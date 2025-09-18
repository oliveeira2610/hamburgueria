/**
 * Burger & Cia - Esquema do Banco de Dados
 *
 * Este arquivo contém o código SQL para criar todas as tabelas necessárias
 * e inserir os dados iniciais para o funcionamento do sistema.
 */

-- Habilitar chaves estrangeiras
PRAGMA foreign_keys = ON;


-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user', -- 'user' ou 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id INTEGER,
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Tabela de ingredientes
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  customer_cpf TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'delivered', 'canceled'
  delivery_address TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);


-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  product_id INTEGER,
  custom_name TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  custom_ingredients TEXT, -- JSON com ingredientes extras
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);


-- =============================================================================
-- INSERÇÃO DE DADOS INICIAIS
-- =============================================================================

UPDATE users
SET role = 'admin'
WHERE email = 'bielolirodrigues@gmail.com';

-- Categorias
INSERT INTO categories (name, description) VALUES
('Hambúrgueres', 'Nossos deliciosos hambúrgueres artesanais'),
('Batatas', 'Batatas fritas crocantes e saborosas'),
('Bebidas', 'Bebidas geladas para acompanhar'),
('Combos', 'Combos especiais com desconto'),
('Sobremesas', 'Doces para finalizar sua refeição');

-- Produtos
INSERT INTO products (name, description, price, image_url, category_id) VALUES
('Burger Clássico', 'Hambúrguer com carne, queijo, alface, tomate e molho especial', 15.90, '/images/burger-classico.jpg', 1),
('Burger Bacon', 'Hambúrguer com carne, bacon, queijo e molho barbecue', 18.90, '/images/burger-bacon.jpg', 1),
('Burger Vegetariano', 'Hambúrguer vegano com ingredientes frescos', 16.90, '/images/burger-veggie.jpg', 1),
('Batata Frita Simples', 'Porção individual de batata frita', 8.90, '/images/batata-simples.jpg', 2),
('Batata Frita Grande', 'Porção grande de batata frita', 12.90, '/images/batata-grande.jpg', 2),
('Refrigerante Lata', 'Refrigerante gelado 350ml', 4.50, '/images/refri-lata.jpg', 3),
('Suco Natural', 'Suco natural de frutas 400ml', 6.90, '/images/suco-natural.jpg', 3),
('Combo Clássico', 'Burger Clássico + Batata + Refrigerante', 25.90, '/images/combo-classico.jpg', 4),
('Combo Bacon', 'Burger Bacon + Batata Grande + Refrigerante', 32.90, '/images/combo-bacon.jpg', 4);

-- Ingredientes
INSERT INTO ingredients (name, price) VALUES
('Carne Bovina', 0),
('Queijo Cheddar', 2.00),
('Bacon', 3.00),
('Alface', 0.50),
('Tomate', 0.50),
('Cebola', 0.50),
('Picles', 1.00),
('Molho Especial', 0),
('Molho Barbecue', 0),
('Pão Brioche', 0);


-- Fim do Script


