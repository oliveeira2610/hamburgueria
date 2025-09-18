// import express from 'express';
// import pkg from 'sqlite3';
// const { Database } = pkg;
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3001;
// const JWT_SECRET = process.env.JWT_SECRET || 'burger_cia_secret_key_2024';

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('dist'));

// // Middleware de autenticação
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Token de acesso requerido' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Token inválido' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Middleware para verificar se é admin
// const requireAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
//   }
//   next();
// };

// // Inicializar banco de dados
// const db = new Database('./burger_cia.db', (err) => {
//   if (err) {
//     console.error('Erro ao conectar com o banco de dados:', err.message);
//   } else {
//     console.log('Conectado ao banco de dados SQLite.');
//   }
// });

// // Rotas de Autenticação

// // Registro de usuário
// app.post('/api/auth/register', (req, res) => {
//   const { name, email, cpf, password, phone, address } = req.body;

//   if (!name || !email || !password || !cpf ) {
//     return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
//   }

//   // Verificar se o email já existe
//   db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
    
//     if (row) {
//       return res.status(400).json({ error: 'Email já cadastrado' });
//     }

//     // Hash da senha
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Inserir novo usuário
//     db.run(
//     "INSERT INTO users (name, email, cpf, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
//     [name, email, cpf, hashedPassword, phone, address],
//     function(err) {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       // Gerar token JWT
//       const token = jwt.sign(
//         { id: this.lastID, email, name, role: 'user' },
//         JWT_SECRET,
//         { expiresIn: '24h' }
//       );

//       res.json({
//         message: 'Usuário cadastrado com sucesso',
//         token,
//         user: { id: this.lastID, name, email, phone, address, role: 'user' }
//       });
//     });
//   });
// });

// // Login de usuário
// app.post('/api/auth/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email e senha são obrigatórios' });
//   }

//   // Buscar usuário
//   db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     if (!user) {
//       return res.status(400).json({ error: 'Email ou senha incorretos' });
//     }

//     // Verificar senha
//     if (!bcrypt.compareSync(password, user.password)) {
//       return res.status(400).json({ error: 'Email ou senha incorretos' });
//     }

//     // Gerar token JWT
//     const token = jwt.sign(
//       { id: user.id, email: user.email, name: user.name, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login realizado com sucesso',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         role: user.role
//       }
//     });
//   });
// });

// // Verificar token
// app.get('/api/auth/verify', authenticateToken, (req, res) => {
//   // Buscar dados atualizados do usuário
//   db.get("SELECT id, name, email, phone, address, role FROM users WHERE id = ?", [req.user.id], (err, user) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     if (!user) {
//       return res.status(404).json({ error: 'Usuário não encontrado' });
//     }

//     res.json({ user });
//   });
// });

// // Rotas da API

// // Categorias
// app.get('/api/categories', (req, res) => {
//   db.all("SELECT * FROM categories ORDER BY name", (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// app.post('/api/categories', authenticateToken, requireAdmin, (req, res) => {
//   const { name, description } = req.body;
//   db.run("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ id: this.lastID, name, description });
//   });
// });

// // Produtos
// app.get('/api/products', (req, res) => {
//   const { category_id } = req.query;
//   let sql = `SELECT p.*, c.name as category_name 
//              FROM products p 
//              LEFT JOIN categories c ON p.category_id = c.id 
//              WHERE p.is_available = 1`;
//   let params = [];

//   if (category_id) {
//     sql += " AND p.category_id = ?";
//     params.push(category_id);
//   }

//   sql += " ORDER BY p.name";

//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
//   const { name, description, price, image_url, category_id } = req.body;
//   db.run("INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)", 
//     [name, description, price, image_url, category_id], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ id: this.lastID, name, description, price, image_url, category_id });
//   });
// });

// app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, image_url, category_id, is_available } = req.body;
  
//   db.run("UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, is_available = ? WHERE id = ?",
//     [name, description, price, image_url, category_id, is_available, id], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ message: 'Produto atualizado com sucesso' });
//   });
// });

// app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
//   const { id } = req.params;
//   db.run("DELETE FROM products WHERE id = ?", id, function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ message: 'Produto removido com sucesso' });
//   });
// });

// // Ingredientes
// app.get('/api/ingredients', (req, res) => {
//   db.all("SELECT * FROM ingredients WHERE is_available = 1 ORDER BY name", (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// app.post('/api/ingredients', authenticateToken, requireAdmin, (req, res) => {
//   const { name, price } = req.body;
//   db.run("INSERT INTO ingredients (name, price) VALUES (?, ?)", [name, price], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ id: this.lastID, name, price });
//   });
// });

// // Pedidos

// // Listar pedidos
// app.get('/api/orders', authenticateToken, (req, res) => {
//   let sql = `SELECT o.*, u.name as user_name,
//           GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items
//           FROM orders o
//           LEFT JOIN users u ON o.user_id = u.id
//           LEFT JOIN order_items oi ON o.id = oi.order_id
//           LEFT JOIN products p ON oi.product_id = p.id`;
  
//   let params = [];

//   // Se não for admin, mostrar apenas pedidos do usuário logado
//   if (req.user.role !== 'admin') {
//     sql += " WHERE o.user_id = ?";
//     params.push(req.user.id);
//   }

//   sql += " GROUP BY o.id ORDER BY o.created_at DESC";

//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// // Buscar detalhes de um pedido específico
// app.get('/api/orders/:id', authenticateToken, (req, res) => {
//   const orderId = req.params.id;
  
//   const orderQuery = `
//     SELECT o.*, u.name as user_name 
//     FROM orders o
//     LEFT JOIN users u ON o.user_id = u.id 
//     WHERE o.id = ?
//   `;
  
//   const itemsQuery = `
//     SELECT oi.*, p.name as product_name
//     FROM order_items oi
//     LEFT JOIN products p ON oi.product_id = p.id
//     WHERE oi.order_id = ?
//   `;
  
//   db.get(orderQuery, [orderId], (err, order) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
    
//     if (!order) {
//       res.status(404).json({ error: 'Pedido não encontrado' });
//       return;
//     }
    
//     // Se não for admin, verificar se é o dono do pedido
//     if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
//       res.status(403).json({ error: 'Acesso negado' });
//       return;
//     }
    
//     db.all(itemsQuery, [orderId], (err, items) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
      
//       res.json({
//         ...order,
//         items: items
//       });
//     });
//   });
// });

// // Criar pedido
// app.post('/api/orders', authenticateToken, (req, res) => {
//   const {
//     customer_name,
//     customer_phone,
//     customer_email,
//     total_amount,
//     delivery_address,
//     notes,
//     items
//   } = req.body;

//   // Começar transação
//   db.serialize(() => {
//     db.run('BEGIN TRANSACTION');

//     // Inserir pedido
//     db.run(
//       `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, 
//        total_amount, delivery_address, notes, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
//       [req.user.id, customer_name, customer_phone, customer_email, 
//        total_amount, delivery_address, notes],
//       function(err) {
//         if (err) {
//           db.run('ROLLBACK');
//           return res.status(500).json({ error: err.message });
//         }

//         const orderId = this.lastID;

//         // Inserir itens do pedido
//         if (items && items.length > 0) {
//           const stmt = db.prepare(
//             'INSERT INTO order_items (order_id, product_id, quantity, unit_price, custom_ingredients, notes) VALUES (?, ?, ?, ?, ?, ?)'
//           );

//           let completed = 0;
//           let hasError = false;

//           items.forEach((item) => {
//             stmt.run([
//               orderId,
//               item.product_id,
//               item.quantity,
//               item.unit_price,
//               item.custom_ingredients ? JSON.stringify(item.custom_ingredients) : null,
//               item.notes
//             ], (err) => {
//               if (err && !hasError) {
//                 hasError = true;
//                 db.run('ROLLBACK');
//                 return res.status(500).json({ error: err.message });
//               }

//               completed++;
//               if (completed === items.length && !hasError) {
//                 stmt.finalize();
//                 db.run('COMMIT');
//                 res.status(201).json({
//                   id: orderId,
//                   message: 'Pedido criado com sucesso'
//                 });
//               }
//             });
//           });
//         } else {
//           db.run('COMMIT');
//           res.status(201).json({
//             id: orderId,
//             message: 'Pedido criado com sucesso'
//           });
//         }
//       }
//     );
//   });
// });

// // Atualizar status do pedido (apenas admin)
// app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'canceled'];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ error: 'Status inválido' });
//   }

//   db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     if (this.changes === 0) {
//       res.status(404).json({ error: 'Pedido não encontrado' });
//       return;
//     }

//     res.json({ message: 'Status atualizado com sucesso' });
//   });
// });
// // Usuários (apenas para admin)
// app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
//   db.all("SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY created_at DESC", (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

// app.put('/api/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;
  
//   if (!['user', 'admin'].includes(role)) {
//     return res.status(400).json({ error: 'Role inválido' });
//   }
  
//   db.run("UPDATE users SET role = ? WHERE id = ?", [role, id], function(err) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({ message: 'Role do usuário atualizado' });
//   });
// });

// // Servir arquivos estáticos do React em produção
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });

// // Fechar conexão com o banco ao encerrar o processo
// process.on('SIGINT', () => {
//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Conexão com o banco de dados fechada.');
//     process.exit(0);
//   });
// });


import express from 'express';
import pkg from 'sqlite3';
const { Database } = pkg;
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'burger_cia_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Inicializar banco de dados
const db = new Database('./burger_cia.db', (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// ✅ Função para validar CPF
function validateCPF(cpf) {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

// Rotas de Autenticação

// Registro de usuário
app.post('/api/auth/register', (req, res) => {
  const { name, email, cpf, password, phone, address } = req.body;

  if (!name || !email || !password || !cpf ) {
    return res.status(400).json({ error: 'Nome, email, CPF e senha são obrigatórios' });
  }

  // Verificar se o email já existe
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Inserir novo usuário
    db.run(
    "INSERT INTO users (name, email, cpf, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, cpf, hashedPassword, phone, address],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: this.lastID, email, name, role: 'user' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Usuário cadastrado com sucesso',
        token,
        user: { id: this.lastID, name, email, phone, address, role: 'user' }
      });
    });
  });
});

// Login de usuário
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Buscar usuário
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  });
});

// Verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  // Buscar dados atualizados do usuário
  db.get("SELECT id, name, email, cpf, phone, address, role FROM users WHERE id = ?", [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });
  });
});

// Rotas da API

// Categorias
app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories ORDER BY name", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/categories', authenticateToken, requireAdmin, (req, res) => {
  const { name, description } = req.body;
  db.run("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description });
  });
});

// Produtos
app.get('/api/products', (req, res) => {
  const { category_id } = req.query;
  let sql = `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.is_available = 1`;
  let params = [];

  if (category_id) {
    sql += " AND p.category_id = ?";
    params.push(category_id);
  }

  sql += " ORDER BY p.name";

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;
  db.run("INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)", 
    [name, description, price, image_url, category_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description, price, image_url, category_id });
  });
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category_id, is_available } = req.body;
  
  db.run("UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, is_available = ? WHERE id = ?",
    [name, description, price, image_url, category_id, is_available, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produto atualizado com sucesso' });
  });
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produto removido com sucesso' });
  });
});

// Ingredientes
app.get('/api/ingredients', (req, res) => {
  db.all("SELECT * FROM ingredients WHERE is_available = 1 ORDER BY name", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/ingredients', authenticateToken, requireAdmin, (req, res) => {
  const { name, price } = req.body;
  db.run("INSERT INTO ingredients (name, price) VALUES (?, ?)", [name, price], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, price });
  });
});

// Pedidos

// Listar pedidos
app.get('/api/orders', authenticateToken, (req, res) => {
  let sql = `SELECT o.*, u.name as user_name,
          GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          LEFT JOIN order_items oi ON o.id = oi.order_id
          LEFT JOIN products p ON oi.product_id = p.id`;
  
  let params = [];

  // Se não for admin, mostrar apenas pedidos do usuário logado
  if (req.user.role !== 'admin') {
    sql += " WHERE o.user_id = ?";
    params.push(req.user.id);
  }

  sql += " GROUP BY o.id ORDER BY o.created_at DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Buscar detalhes de um pedido específico
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  
  const orderQuery = `
    SELECT o.*, u.name as user_name 
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE o.id = ?
  `;
  
  const itemsQuery = `
    SELECT oi.*, p.name as product_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;
  
  db.get(orderQuery, [orderId], (err, order) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }
    
    // Se não for admin, verificar se é o dono do pedido
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }
    
    db.all(itemsQuery, [orderId], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        ...order,
        items: items
      });
    });
  });
});

// Criar pedido — ✅ ATUALIZADO PARA INCLUIR CPF
app.post('/api/orders', authenticateToken, (req, res) => {
  const {
    customer_name,
    customer_phone,
    customer_email,
    customer_cpf, // ✅ Recebe o CPF
    total_amount,
    delivery_address,
    notes,
    items
  } = req.body;

  // ✅ Validação opcional de CPF
  if (customer_cpf && !validateCPF(customer_cpf)) {
    return res.status(400).json({ error: 'CPF inválido' });
  }

  // Começar transação
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Inserir pedido — ✅ Inclui customer_cpf
    db.run(
      `INSERT INTO orders (
        user_id, 
        customer_name, 
        customer_phone, 
        customer_email, 
        customer_cpf,  -- ✅ Campo adicionado
        total_amount, 
        delivery_address, 
        notes, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id,
        customer_name,
        customer_phone,
        customer_email,
        customer_cpf, // ✅ Valor inserido aqui
        total_amount,
        delivery_address,
        notes
      ],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        const orderId = this.lastID;

        // Inserir itens do pedido
        if (items && items.length > 0) {
          const stmt = db.prepare(
            'INSERT INTO order_items (order_id, product_id, quantity, unit_price, custom_ingredients, notes, custom_name) VALUES (?, ?, ?, ?, ?, ?, ?)'
          );

          let completed = 0;
          let hasError = false;

          items.forEach((item) => {
            stmt.run([
              orderId,
              item.product_id,
              item.quantity,
              item.unit_price,
              item.custom_ingredients ? JSON.stringify(item.custom_ingredients) : null,
              item.notes,
              item.custom_name || null // ✅ Nome customizado do item
            ], (err) => {
              if (err && !hasError) {
                hasError = true;
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }

              completed++;
              if (completed === items.length && !hasError) {
                stmt.finalize();
                db.run('COMMIT');
                res.status(201).json({
                  id: orderId,
                  message: 'Pedido criado com sucesso'
                });
              }
            });
          });
        } else {
          db.run('COMMIT');
          res.status(201).json({
            id: orderId,
            message: 'Pedido criado com sucesso'
          });
        }
      }
    );
  });
});

// Atualizar status do pedido (apenas admin)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'canceled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }

    res.json({ message: 'Status atualizado com sucesso' });
  });
});

// Usuários (apenas para admin)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, name, email, phone, address, cpf, role, created_at FROM users ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }
  
  db.run("UPDATE users SET role = ? WHERE id = ?", [role, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Role do usuário atualizado' });
  });
});


// Nova rota: Estatísticas da Dashboard
app.get('/api/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
  const { period = 'total' } = req.query; // 'total', 'monthly', 'last6months'

  let stats = {};

  const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  const getStats = async () => {
    try {
      // Total de produtos
      const products = await runQuery("SELECT COUNT(*) as total FROM products WHERE is_available = 1");
      stats.totalProducts = products[0].total;

      // Total de usuários
      const users = await runQuery("SELECT COUNT(*) as total FROM users");
      stats.totalUsers = users[0].total;

      if (period === 'total') {
        // Total de pedidos e receita
        const orders = await runQuery("SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders");
        stats.totalOrders = orders[0].total;
        stats.totalRevenue = parseFloat(orders[0].revenue || 0).toFixed(2);
      } else if (period === 'monthly') {
        // Estatísticas do mês atual
        const currentMonth = await runQuery(`
          SELECT 
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        `);
        stats.totalOrders = currentMonth[0].total_orders;
        stats.totalRevenue = parseFloat(currentMonth[0].total_revenue || 0).toFixed(2);
      } else if (period === 'last6months') {
        // Últimos 6 meses
        const last6Months = await runQuery(`
          SELECT 
            strftime('%Y-%m', created_at) as month,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE created_at >= date('now', '-6 months')
          GROUP BY strftime('%Y-%m', created_at)
          ORDER BY month ASC
        `);
        stats.monthlyData = last6Months.map(row => ({
          month: row.month,
          totalOrders: row.total_orders,
          totalRevenue: parseFloat(row.total_revenue || 0).toFixed(2)
        }));
      }

      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  };

  getStats();
});

// Servir arquivos estáticos do React em produção
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



// Fechar conexão com o banco ao encerrar o processo
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
    process.exit(0);
  });
});