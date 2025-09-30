import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Filter } from 'lucide-react';

const Menu = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://hamburgueria-api-lbm4.onrender.com/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? 'https://hamburgueria-api-lbm4.onrender.com/api/products'
        : `https://hamburgueria-api-lbm4.onrender.com/api/products?category_id=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="font-nunito text-lg text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-fredoka text-4xl md:text-5xl text-gray-800 mb-4">
            Nosso Cardápio
          </h1>
          <p className="font-nunito text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra nossos deliciosos hambúrgueres, acompanhamentos e bebidas. 
            Todos preparados com ingredientes frescos e muito amor!
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <span className="font-nunito font-semibold text-gray-700">Filtrar por categoria:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-nunito font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-100'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-nunito font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-red-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card bg-white rounded-2xl overflow-hidden shadow-lg">
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-red-100 to-yellow-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl">🍔</div>
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-nunito text-sm font-semibold">4.8</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">{product.name}</h3>
                  <p className="font-nunito text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="font-fredoka text-2xl text-red-600">
                      R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary p-3 rounded-full hover:scale-110 transition-all duration-200 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍔</div>
            <h3 className="font-fredoka text-2xl text-gray-800 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="font-nunito text-gray-600">
              Tente selecionar uma categoria diferente ou volte mais tarde.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <h2 className="font-fredoka text-3xl mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="font-nunito text-lg mb-6">
            Monte seu próprio hambúrguer do jeito que você gosta!
          </p>
          <a
  href="/monte-seu-burger"
  className="btn-secondary px-8 py-3 rounded-full font-nunito font-bold"
>
  Monte seu Burger
</a>
        </div>
      </div>
    </div>
  );
};

export default Menu;

