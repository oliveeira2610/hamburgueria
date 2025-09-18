

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Package, ShoppingCart, Users, TrendingUp, Crown, UserCheck, UserX, X, Eye } from 'lucide-react';

// const Admin = ({ user, token }) => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [showProductForm, setShowProductForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [productForm, setProductForm] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: ''
//   });

//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//       fetchCategories();
//       fetchOrders();
//       fetchUsers();
//     }
//   }, [token]);

//   const fetchWithAuth = async (url, options = {}) => {
//     return fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/products');
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error('Erro ao buscar produtos:', error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/categories');
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error('Erro ao buscar categorias:', error);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await fetchWithAuth('http://localhost:3001/api/orders');
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setOrders(data);
//       } else {
//         setOrders([]);
//         console.error("API /orders não retornou array:", data);
//       }
//     } catch (error) {
//       console.error('Erro ao buscar pedidos:', error);
//       setOrders([]);
//     }
//   };

// const fetchOrderDetails = async (orderId) => {
//   try {
//     const response = await fetchWithAuth(`http://localhost:3001/api/orders/${orderId}`);
//     const data = await response.json();
//     console.log('orderDetails:', data); // <--- veja se vem customer_cpf
//     setOrderDetails(data);
//     setShowOrderModal(true);
//   } catch (error) {
//     console.error('Erro ao buscar detalhes do pedido:', error);
//     alert('Erro ao carregar detalhes do pedido');
//   }
// };

// const formatCPF = (cpf) => {
//   if (!cpf) return '';
//   return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
// };


//   const fetchUsers = async () => {
//     try {
//       const response = await fetchWithAuth('http://localhost:3001/api/users');
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Erro ao buscar usuários:', error);
//     }
//   };

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = editingProduct 
//         ? `http://localhost:3001/api/products/${editingProduct.id}`
//         : 'http://localhost:3001/api/products';
      
//       const method = editingProduct ? 'PUT' : 'POST';
      
//       const response = await fetchWithAuth(url, {
//         method,
//         body: JSON.stringify({
//           ...productForm,
//           price: parseFloat(productForm.price),
//           is_available: true
//         })
//       });

//       if (response.ok) {
//         fetchProducts();
//         setShowProductForm(false);
//         setEditingProduct(null);
//         setProductForm({
//           name: '',
//           description: '',
//           price: '',
//           category_id: '',
//           image_url: ''
//         });
//       } else {
//         const errorData = await response.json();
//         alert(errorData.error || 'Erro ao salvar produto');
//       }
//     } catch (error) {
//       console.error('Erro ao salvar produto:', error);
//       alert('Erro ao salvar produto');
//     }
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setProductForm({
//       name: product.name,
//       description: product.description,
//       price: product.price.toString(),
//       category_id: product.category_id.toString(),
//       image_url: product.image_url || ''
//     });
//     setShowProductForm(true);
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (window.confirm('Tem certeza que deseja excluir este produto?')) {
//       try {
//         const response = await fetchWithAuth(`http://localhost:3001/api/products/${productId}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           fetchProducts();
//         } else {
//           const errorData = await response.json();
//           alert(errorData.error || 'Erro ao excluir produto');
//         }
//       } catch (error) {
//         console.error('Erro ao excluir produto:', error);
//         alert('Erro ao excluir produto');
//       }
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetchWithAuth(`http://localhost:3001/api/orders/${orderId}/status`, {
//         method: 'PUT',
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (response.ok) {
//         fetchOrders();
//         // Se o modal está aberto, atualizar os detalhes
//         if (showOrderModal && orderDetails?.id === orderId) {
//           fetchOrderDetails(orderId);
//         }
//       } else {
//         const errorData = await response.json();
//         alert(errorData.error || 'Erro ao atualizar status');
//       }
//     } catch (error) {
//       console.error('Erro ao atualizar status:', error);
//       alert('Erro ao atualizar status');
//     }
//   };

//   const handleUpdateUserRole = async (userId, newRole) => {
//     if (window.confirm(`Tem certeza que deseja ${newRole === 'admin' ? 'promover' : 'rebaixar'} este usuário?`)) {
//       try {
//         const response = await fetchWithAuth(`http://localhost:3001/api/users/${userId}/role`, {
//           method: 'PUT',
//           body: JSON.stringify({ role: newRole })
//         });

//         if (response.ok) {
//           fetchUsers();
//         } else {
//           const errorData = await response.json();
//           alert(errorData.error || 'Erro ao atualizar usuário');
//         }
//       } catch (error) {
//         console.error('Erro ao atualizar usuário:', error);
//         alert('Erro ao atualizar usuário');
//       }
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'preparing': return 'bg-blue-100 text-blue-800';
//       case 'ready': return 'bg-green-100 text-green-800';
//       case 'delivered': return 'bg-gray-100 text-gray-800';
//       case 'canceled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'Pendente';
//       case 'preparing': return 'Preparando';
//       case 'ready': return 'Pronto';
//       case 'delivered': return 'Entregue';
//       case 'canceled': return 'Cancelado';
//       default: return status;
//     }
//   };

//   const tabs = [
//     { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
//     { id: 'products', name: 'Produtos', icon: Package },
//     { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
//     { id: 'users', name: 'Usuários', icon: Users }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="font-fredoka text-3xl text-gray-800 mb-2">Painel Administrativo</h1>
//               <p className="font-nunito text-gray-600">
//                 Bem-vindo, {user?.name}! Gerencie sua hamburgeria aqui.
//               </p>
//             </div>
//             <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-lg">
//               <Crown className="w-5 h-5 text-red-600" />
//               <span className="font-nunito font-semibold text-red-800">Administrador</span>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               {tabs.map((tab) => {
//                 const Icon = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
//                       activeTab === tab.id
//                         ? 'border-red-500 text-red-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <Icon size={18} />
//                     <span>{tab.name}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         {/* Dashboard Tab */}
//         {activeTab === 'dashboard' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-nunito text-gray-600 text-sm">Total de Produtos</p>
//                   <p className="font-fredoka text-3xl text-gray-800">{products.length}</p>
//                 </div>
//                 <Package className="w-8 h-8 text-blue-600" />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-nunito text-gray-600 text-sm">Pedidos Hoje</p>
//                   <p className="font-fredoka text-3xl text-gray-800">{orders.length}</p>
//                 </div>
//                 <ShoppingCart className="w-8 h-8 text-green-600" />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-nunito text-gray-600 text-sm">Usuários Cadastrados</p>
//                   <p className="font-fredoka text-3xl text-gray-800">{users.length}</p>
//                 </div>
//                 <Users className="w-8 h-8 text-purple-600" />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-nunito text-gray-600 text-sm">Receita Total</p>
//                   <p className="font-fredoka text-3xl text-gray-800">
//                     R$ {orders.reduce((total, order) => total + parseFloat(order.total_amount || 0), 0).toFixed(2).replace('.', ',')}
//                   </p>
//                 </div>
//                 <TrendingUp className="w-8 h-8 text-red-600" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Products Tab */}
//         {activeTab === 'products' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-fredoka text-2xl text-gray-800">Gerenciar Produtos</h2>
//               <button
//                 onClick={() => {
//                   setShowProductForm(true);
//                   setEditingProduct(null);
//                   setProductForm({
//                     name: '',
//                     description: '',
//                     price: '',
//                     category_id: '',
//                     image_url: ''
//                   });
//                 }}
//                 className="btn-primary px-4 py-2 rounded-lg font-nunito font-semibold flex items-center space-x-2"
//               >
//                 <Plus size={18} />
//                 <span>Novo Produto</span>
//               </button>
//             </div>

//             {/* Product Form Modal */}
//             {showProductForm && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
//                   <h3 className="font-fredoka text-xl text-gray-800 mb-4">
//                     {editingProduct ? 'Editar Produto' : 'Novo Produto'}
//                   </h3>
                  
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div>
//                       <label className="block font-nunito font-semibold text-gray-700 mb-2">Nome</label>
//                       <input
//                         type="text"
//                         value={productForm.name}
//                         onChange={(e) => setProductForm({...productForm, name: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block font-nunito font-semibold text-gray-700 mb-2">Descrição</label>
//                       <textarea
//                         value={productForm.description}
//                         onChange={(e) => setProductForm({...productForm, description: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                         rows="3"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block font-nunito font-semibold text-gray-700 mb-2">Preço</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={productForm.price}
//                         onChange={(e) => setProductForm({...productForm, price: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block font-nunito font-semibold text-gray-700 mb-2">Categoria</label>
//                       <select
//                         value={productForm.category_id}
//                         onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                         required
//                       >
//                         <option value="">Selecione uma categoria</option>
//                         {categories.map(category => (
//                           <option key={category.id} value={category.id}>{category.name}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block font-nunito font-semibold text-gray-700 mb-2">URL da Imagem</label>
//                       <input
//                         type="url"
//                         value={productForm.image_url}
//                         onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       />
//                     </div>
                    
//                     <div className="flex space-x-4 pt-4">
//                       <button
//                         type="submit"
//                         className="flex-1 btn-primary py-2 rounded-lg font-nunito font-semibold"
//                       >
//                         {editingProduct ? 'Atualizar' : 'Criar'}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShowProductForm(false)}
//                         className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-nunito font-semibold hover:bg-gray-400 transition-colors"
//                       >
//                         Cancelar
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}

//             {/* Products List */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {products.map((product) => (
//                       <tr key={product.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center mr-4">
//                               <span className="text-lg">🍔</span>
//                             </div>
//                             <div>
//                               <div className="font-nunito font-semibold text-gray-900">{product.name}</div>
//                               <div className="font-nunito text-sm text-gray-500">{product.description}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="font-nunito text-gray-900">{product.category_name}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="font-nunito font-semibold text-red-600">
//                             R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEditProduct(product)}
//                               className="text-blue-600 hover:text-blue-900 p-1"
//                             >
//                               <Edit size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteProduct(product.id)}
//                               className="text-red-600 hover:text-red-900 p-1"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Orders Tab */}
//         {activeTab === 'orders' && (
//           <div>
//             <h2 className="font-fredoka text-2xl text-gray-800 mb-6">Gerenciar Pedidos</h2>
            
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido #</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {orders.map((order) => (
//                       <tr key={order.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="font-nunito font-semibold text-gray-900">#{order.id}</div>
//                           <div className="font-nunito text-xs text-gray-500">
//                             {new Date(order.created_at).toLocaleDateString('pt-BR')} às {' '}
//                             {new Date(order.created_at).toLocaleTimeString('pt-BR', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>
//                             <div className="font-nunito font-semibold text-gray-900">{order.customer_name}</div>
//                             <div className="font-nunito text-sm text-gray-500">{order.customer_phone}</div>
//                             {order.user_name && (
//                               <div className="font-nunito text-xs text-blue-600">Usuário: {order.user_name}</div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="font-nunito font-semibold text-red-600">
//                             R$ {parseFloat(order.total_amount).toFixed(2).replace('.', ',')}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                             {getStatusText(order.status)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => fetchOrderDetails(order.id)}
//                               className="text-blue-600 hover:text-blue-900 p-1"
//                               title="Ver detalhes"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             <select
//                               value={order.status}
//                               onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
//                               className="border border-gray-300 rounded px-2 py-1 text-sm"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <option value="pending">Pendente</option>
//                               <option value="preparing">Preparando</option>
//                               <option value="ready">Pronto</option>
//                               <option value="delivered">Entregue</option>
//                               <option value="canceled">Cancelado</option>
//                             </select>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {showOrderModal && orderDetails && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-fredoka text-2xl text-gray-800">
//                   Pedido #{orderDetails.id}
//                 </h3>
//                 <button
//                   onClick={() => setShowOrderModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* Order Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-nunito font-semibold text-gray-800 mb-3">Informações do Cliente</h4>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Nome: </span>
//                       <span className="font-nunito text-gray-900">{orderDetails.customer_name}</span>
//                     </div>
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Telefone: </span>
//                       <span className="font-nunito text-gray-900">{orderDetails.customer_phone || 'Não informado'}</span>
//                     </div>
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Email: </span>
//                       <span className="font-nunito text-gray-900">{orderDetails.customer_email || 'Não informado'}</span>
//                     </div>
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">CPF: </span>
//                       <span className="font-nunito text-gray-900">{orderDetails.customer_cpf || 'Não informado'}</span>
//                     </div>
//                     {orderDetails.user_name && (
//                       <div>
//                         <span className="font-nunito font-medium text-gray-600">Usuário cadastrado: </span>
//                         <span className="font-nunito text-blue-600">{orderDetails.user_name}</span>
//                       </div>
//                     )}
//                   </div>

//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-nunito font-semibold text-gray-800 mb-3">Detalhes do Pedido</h4>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Data: </span>
//                       <span className="font-nunito text-gray-900">
//                         {new Date(orderDetails.created_at).toLocaleDateString('pt-BR')}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Hora: </span>
//                       <span className="font-nunito text-gray-900">
//                         {new Date(orderDetails.created_at).toLocaleTimeString('pt-BR', {
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="font-nunito font-medium text-gray-600">Status: </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderDetails.status)}`}>
//                         {getStatusText(orderDetails.status)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Address */}
//               {orderDetails.delivery_address && (
//                 <div className="bg-blue-50 rounded-lg p-4 mb-6">
//                   <h4 className="font-nunito font-semibold text-gray-800 mb-2">Endereço de Entrega</h4>
//                   <p className="font-nunito text-gray-900">{orderDetails.delivery_address}</p>
//                 </div>
//               )}

//               {/* Notes */}
//               {orderDetails.notes && (
//                 <div className="bg-yellow-50 rounded-lg p-4 mb-6">
//                   <h4 className="font-nunito font-semibold text-gray-800 mb-2">Observações</h4>
//                   <p className="font-nunito text-gray-900">{orderDetails.notes}</p>
//                 </div>
//               )}

//               {/* Order Items */}
//               <div className="mb-6">
//                 <h4 className="font-nunito font-semibold text-gray-800 mb-4">Itens do Pedido</h4>
//                 {orderDetails.items && orderDetails.items.length > 0 ? (
//                   <div className="space-y-3">
//                     {orderDetails.items.map((item, index) => {
//                       // Parse dos ingredientes extras (caso venha como string do backend)
//                       let extras = [];
//                       if (item.custom_ingredients) {
//                         try {
//                           extras = typeof item.custom_ingredients === 'string'
//                             ? JSON.parse(item.custom_ingredients)
//                             : item.custom_ingredients;
//                         } catch {
//                           extras = [];
//                         }
//                       }
//                       return (
//                         <div key={index} className="flex justify-between items-center bg-white rounded-lg p-4 border">
//                           <div className="flex items-center space-x-4">
//                             <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center">
//                               <span className="text-lg">🍔</span>
//                             </div>
//                             <div>
//                               <div className="font-nunito font-semibold text-gray-900">{item.product_name}</div>
//                               <div className="font-nunito text-sm text-gray-600">
//                                 Quantidade: {item.quantity}
//                               </div>
//                               {item.notes && (
//                                 <div className="font-nunito text-xs text-gray-500 italic">
//                                   ingredientes: {item.notes}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="font-nunito font-semibold text-gray-900">
//                               R$ {(parseFloat(item.unit_price) * parseInt(item.quantity)).toFixed(2).replace('.', ',')}
//                             </div>
//                             <div className="font-nunito text-sm text-gray-500">
//                               R$ {parseFloat(item.unit_price).toFixed(2).replace('.', ',')} cada
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <p className="font-nunito">Itens do pedido não encontrados</p>
//                   </div>
//                 )}
//               </div>

//               {/* Total */}
//               <div className="border-t pt-4 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="font-nunito text-lg font-semibold text-gray-800">Total:</span>
//                   <span className="font-fredoka text-2xl font-bold text-red-600">
//                     R$ {parseFloat(orderDetails.total_amount).toFixed(2).replace('.', ',')}
//                   </span>
//                 </div>
//               </div>

//               {/* Status Update */}
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-4">
//                   <label className="font-nunito font-semibold text-gray-700">
//                     Atualizar Status:
//                   </label>
//                   <select
//                     value={orderDetails.status}
//                     onChange={(e) => handleUpdateOrderStatus(orderDetails.id, e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 font-nunito"
//                   >
//                     <option value="pending">Pendente</option>
//                     <option value="preparing">Preparando</option>
//                     <option value="ready">Pronto</option>
//                     <option value="delivered">Entregue</option>
//                     <option value="canceled">Cancelado</option>
//                   </select>
//                 </div>
                
//                 <button
//                   onClick={() => setShowOrderModal(false)}
//                   className="bg-gray-500 text-white px-6 py-2 rounded-lg font-nunito font-semibold hover:bg-gray-600 transition-colors"
//                 >
//                   Fechar
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Users Tab */}
//         {/* Users Tab */}
// {activeTab === 'users' && (
//   <div>
//     <h2 className="font-fredoka text-2xl text-gray-800 mb-6">Gerenciar Usuários</h2>
    
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((userItem) => (
//               <tr key={userItem.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-4">
//                       <Users size={20} className="text-blue-600" />
//                     </div>
//                     <div>
//                       <div className="font-nunito font-semibold text-gray-900">{userItem.name}</div>
//                       <div className="font-nunito text-sm text-gray-500">{userItem.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div>
//                     <div className="font-nunito text-sm text-gray-900">{userItem.phone || 'N/A'}</div>
//                     <div className="font-nunito text-xs text-gray-500">{userItem.address || 'Endereço não informado'}</div>
//                     {userItem.cpf && (
//                       <div className="font-nunito text-xs text-gray-700 font-medium">
//                         CPF: {formatCPF(userItem.cpf)}
//                       </div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
//                     userItem.role === 'admin' 
//                       ? 'bg-red-100 text-red-800' 
//                       : 'bg-green-100 text-green-800'
//                   }`}>
//                     {userItem.role === 'admin' ? (
//                       <>
//                         <Crown size={12} className="mr-1" />
//                         Admin
//                       </>
//                     ) : (
//                       <>
//                         <UserCheck size={12} className="mr-1" />
//                         Usuário
//                       </>
//                     )}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="font-nunito text-sm text-gray-900">
//                     {new Date(userItem.created_at).toLocaleDateString('pt-BR')}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   {userItem.id !== user?.id && (
//                     <button
//                       onClick={() => handleUpdateUserRole(
//                         userItem.id, 
//                         userItem.role === 'admin' ? 'user' : 'admin'
//                       )}
//                       className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
//                         userItem.role === 'admin'
//                           ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
//                           : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//                       }`}
//                     >
//                       {userItem.role === 'admin' ? (
//                         <>
//                           <UserX size={12} className="mr-1" />
//                           Rebaixar
//                         </>
//                       ) : (
//                         <>
//                           <Crown size={12} className="mr-1" />
//                           Promover
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );
// };

// export default Admin;









import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, ShoppingCart, Users, TrendingUp, Crown, UserCheck, UserX, X, Eye } from 'lucide-react';

const Admin = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [dashboardPeriod, setDashboardPeriod] = useState('total');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });

  // ✅ Função para formatar CPF
  const formatCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCategories();
      fetchOrders();
      fetchUsers();
      fetchDashboardStats(dashboardPeriod); // ✅ Busca estatísticas
    }
  }, [token, dashboardPeriod]);

  const fetchWithAuth = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3001/api/orders');
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
        console.error("API /orders não retornou array:", data);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setOrders([]);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:3001/api/orders/${orderId}`);
      const data = await response.json();
      setOrderDetails(data);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      alert('Erro ao carregar detalhes do pedido');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `http://localhost:3001/api/products/${editingProduct.id}`
        : 'http://localhost:3001/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          is_available: true
        })
      });

      if (response.ok) {
        fetchProducts();
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category_id: '',
          image_url: ''
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      image_url: product.image_url || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetchWithAuth(`http://localhost:3001/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchProducts();
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Erro ao excluir produto');
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetchWithAuth(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        if (showOrderModal && orderDetails?.id === orderId) {
          fetchOrderDetails(orderId);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (window.confirm(`Tem certeza que deseja ${newRole === 'admin' ? 'promover' : 'rebaixar'} este usuário?`)) {
      try {
        const response = await fetchWithAuth(`http://localhost:3001/api/users/${userId}/role`, {
          method: 'PUT',
          body: JSON.stringify({ role: newRole })
        });

        if (response.ok) {
          fetchUsers();
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Erro ao atualizar usuário');
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'products', name: 'Produtos', icon: Package },
    { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
    { id: 'users', name: 'Usuários', icon: Users }
  ];

  const fetchDashboardStats = async (period = 'total') => {
  try {
    const response = await fetchWithAuth(`http://localhost:3001/api/dashboard/stats?period=${period}`);
    const data = await response.json();
    setDashboardStats(data);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-fredoka text-3xl text-gray-800 mb-2">Painel Administrativo</h1>
              <p className="font-nunito text-gray-600">
                Bem-vindo, {user?.name}! Gerencie sua hamburgeria aqui.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-lg">
              <Crown className="w-5 h-5 text-red-600" />
              <span className="font-nunito font-semibold text-red-800">Administrador</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
{activeTab === 'dashboard' && (
  <div>
    {/* Selector de período */}
    <div className="mb-6 flex justify-end">
      <select
        value={dashboardPeriod}
        onChange={(e) => setDashboardPeriod(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="total">Visão Geral</option>
        <option value="monthly">Mês Atual</option>
        <option value="last6months">Últimos 6 Meses</option>
      </select>
    </div>

    {dashboardPeriod !== 'last6months' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-nunito text-gray-600 text-sm">Total de Produtos</p>
              <p className="font-fredoka text-3xl text-gray-800">{dashboardStats.totalProducts || 0}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-nunito text-gray-600 text-sm">
                {dashboardPeriod === 'total' ? 'Pedidos Totais' : 'Pedidos este mês'}
              </p>
              <p className="font-fredoka text-3xl text-gray-800">{dashboardStats.totalOrders || 0}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-nunito text-gray-600 text-sm">Usuários Cadastrados</p>
              <p className="font-fredoka text-3xl text-gray-800">{dashboardStats.totalUsers || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-nunito text-gray-600 text-sm">
                {dashboardPeriod === 'total' ? 'Receita Total' : 'Receita este mês'}
              </p>
              <p className="font-fredoka text-3xl text-gray-800">
                R$ {parseFloat(dashboardStats.totalRevenue || 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    ) : (
      // Gráfico de últimos 6 meses
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="font-fredoka text-xl text-gray-800 mb-4">Faturamento - Últimos 6 Meses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Mês</th>
                <th className="text-left py-2">Pedidos</th>
                <th className="text-left py-2">Receita</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.monthlyData && dashboardStats.monthlyData.length > 0 ? (
                dashboardStats.monthlyData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.month}</td>
                    <td className="py-3">{item.totalOrders}</td>
                    <td className="py-3">R$ {parseFloat(item.totalRevenue).toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">Nenhum dado encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-fredoka text-2xl text-gray-800">Gerenciar Produtos</h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    category_id: '',
                    image_url: ''
                  });
                }}
                className="btn-primary px-4 py-2 rounded-lg font-nunito font-semibold flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Novo Produto</span>
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-4">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h3>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block font-nunito font-semibold text-gray-700 mb-2">Nome</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block font-nunito font-semibold text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-nunito font-semibold text-gray-700 mb-2">Preço</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block font-nunito font-semibold text-gray-700 mb-2">Categoria</label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-nunito font-semibold text-gray-700 mb-2">URL da Imagem</label>
                      <input
                        type="url"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 btn-primary py-2 rounded-lg font-nunito font-semibold"
                      >
                        {editingProduct ? 'Atualizar' : 'Criar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-nunito font-semibold hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center mr-4">
                              <span className="text-lg">🍔</span>
                            </div>
                            <div>
                              <div className="font-nunito font-semibold text-gray-900">{product.name}</div>
                              <div className="font-nunito text-sm text-gray-500">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-nunito text-gray-900">{product.category_name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-nunito font-semibold text-red-600">
                            R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-fredoka text-2xl text-gray-800 mb-6">Gerenciar Pedidos</h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-nunito font-semibold text-gray-900">#{order.id}</div>
                          <div className="font-nunito text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')} às {' '}
                            {new Date(order.created_at).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-nunito font-semibold text-gray-900">{order.customer_name}</div>
                            <div className="font-nunito text-sm text-gray-500">{order.customer_phone}</div>
                            <div className="font-nunito text-xs text-gray-700">
                              <strong>CPF:</strong> {formatCPF(order.customer_cpf)}
                            </div>
                            {order.user_name && (
                              <div className="font-nunito text-xs text-blue-600">Usuário: {order.user_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-nunito font-semibold text-red-600">
                            R$ {parseFloat(order.total_amount).toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => fetchOrderDetails(order.id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Ver detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="pending">Pendente</option>
                              <option value="preparing">Preparando</option>
                              <option value="ready">Pronto</option>
                              <option value="delivered">Entregue</option>
                              <option value="canceled">Cancelado</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-fredoka text-2xl text-gray-800">
                  Pedido #{orderDetails.id}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-nunito font-semibold text-gray-800 mb-3">Informações do Cliente</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Nome: </span>
                      <span className="font-nunito text-gray-900">{orderDetails.customer_name}</span>
                    </div>
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Telefone: </span>
                      <span className="font-nunito text-gray-900">{orderDetails.customer_phone || 'Não informado'}</span>
                    </div>
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Email: </span>
                      <span className="font-nunito text-gray-900">{orderDetails.customer_email || 'Não informado'}</span>
                    </div>
                    <div>
                      <span className="font-nunito font-medium text-gray-600">CPF: </span>
                      <span className="font-nunito text-gray-900 font-semibold">
                        {formatCPF(orderDetails.customer_cpf)}
                      </span>
                    </div>
                    {orderDetails.user_name && (
                      <div>
                        <span className="font-nunito font-medium text-gray-600">Usuário cadastrado: </span>
                        <span className="font-nunito text-blue-600">{orderDetails.user_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-nunito font-semibold text-gray-800 mb-3">Detalhes do Pedido</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Data: </span>
                      <span className="font-nunito text-gray-900">
                        {new Date(orderDetails.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Hora: </span>
                      <span className="font-nunito text-gray-900">
                        {new Date(orderDetails.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-nunito font-medium text-gray-600">Status: </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderDetails.status)}`}>
                        {getStatusText(orderDetails.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {orderDetails.delivery_address && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-nunito font-semibold text-gray-800 mb-2">Endereço de Entrega</h4>
                  <p className="font-nunito text-gray-900">{orderDetails.delivery_address}</p>
                </div>
              )}

              {/* Notes */}
              {orderDetails.notes && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <h4 className="font-nunito font-semibold text-gray-800 mb-2">Observações</h4>
                  <p className="font-nunito text-gray-900">{orderDetails.notes}</p>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-nunito font-semibold text-gray-800 mb-4">Itens do Pedido</h4>
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  <div className="space-y-3">
                    {orderDetails.items.map((item, index) => {
                      let extras = [];
                      if (item.custom_ingredients) {
                        try {
                          extras = typeof item.custom_ingredients === 'string'
                            ? JSON.parse(item.custom_ingredients)
                            : item.custom_ingredients;
                        } catch {
                          extras = [];
                        }
                      }
                      return (
                        <div key={index} className="flex justify-between items-center bg-white rounded-lg p-4 border">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">🍔</span>
                            </div>
                            <div>
                              <div className="font-nunito font-semibold text-gray-900">
                                {item.custom_name || item.product_name || 'Hambúrguer Personalizado'}
                              </div>
                              <div className="font-nunito text-sm text-gray-600">
                                Quantidade: {item.quantity}
                              </div>
                              {item.notes && (
                                <div className="font-nunito text-xs text-gray-500 italic">
                                  ingredientes: {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-nunito font-semibold text-gray-900">
                              R$ {(parseFloat(item.unit_price) * parseInt(item.quantity)).toFixed(2).replace('.', ',')}
                            </div>
                            <div className="font-nunito text-sm text-gray-500">
                              R$ {parseFloat(item.unit_price).toFixed(2).replace('.', ',')} cada
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="font-nunito">Itens do pedido não encontrados</p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-nunito text-lg font-semibold text-gray-800">Total:</span>
                  <span className="font-fredoka text-2xl font-bold text-red-600">
                    R$ {parseFloat(orderDetails.total_amount).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <label className="font-nunito font-semibold text-gray-700">
                    Atualizar Status:
                  </label>
                  <select
                    value={orderDetails.status}
                    onChange={(e) => handleUpdateOrderStatus(orderDetails.id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-nunito"
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Entregue</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-nunito font-semibold hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="font-fredoka text-2xl text-gray-800 mb-6">Gerenciar Usuários</h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-4">
                              <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-nunito font-semibold text-gray-900">{userItem.name}</div>
                              <div className="font-nunito text-sm text-gray-500">{userItem.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-nunito text-sm text-gray-900">{userItem.phone || 'N/A'}</div>
                            <div className="font-nunito text-xs text-gray-500">{userItem.address || 'Endereço não informado'}</div>
                            <div className="font-nunito text-xs text-gray-700 font-medium mt-1">
                              <strong>CPF:</strong> {formatCPF(userItem.cpf)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {userItem.role === 'admin' ? (
                              <>
                                <Crown size={12} className="mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} className="mr-1" />
                                Usuário
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-nunito text-sm text-gray-900">
                            {new Date(userItem.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {userItem.id !== user?.id && (
                            <button
                              onClick={() => handleUpdateUserRole(
                                userItem.id, 
                                userItem.role === 'admin' ? 'user' : 'admin'
                              )}
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                userItem.role === 'admin'
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              {userItem.role === 'admin' ? (
                                <>
                                  <UserX size={12} className="mr-1" />
                                  Rebaixar
                                </>
                              ) : (
                                <>
                                  <Crown size={12} className="mr-1" />
                                  Promover
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;