import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Truck, ChefHat } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Clock className="w-12 h-12 text-yellow-400" />,
      title: "15min",
      subtitle: "Entrega rápida",
      description: "Seu pedido pronto em até 15 minutos"
    },
    {
      icon: <ChefHat className="w-12 h-12 text-green-500" />,
      title: "100%",
      subtitle: "Ingredientes frescos",
      description: "Sempre frescos e de qualidade"
    },
    {
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      title: "24/7",
      subtitle: "Sempre aberto",
      description: "Funcionamos todos os dias"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      rating: 5,
      comment: "Melhor hambúrguer da cidade! Ingredientes frescos e entrega super rápida.",
      avatar: "👩‍🦰"
    },
    {
      name: "João Santos",
      rating: 5,
      comment: "Atendimento excelente e o sabor é incomparável. Recomendo!",
      avatar: "👨‍💼"
    },
    {
      name: "Ana Costa",
      rating: 5,
      comment: "Adoro a opção de montar meu próprio hambúrguer. Muito criativo!",
      avatar: "👩‍🎓"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center gradient-hero">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute top-20 left-10 text-6xl animate-bounce float">🍔</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse float" style={{ animationDelay: '1s' }}>🍟</div>
          <div className="absolute bottom-40 left-20 text-5xl animate-bounce float" style={{ animationDelay: '2s' }}>🥤</div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 stagger-animation">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
            <span className="ml-2 font-nunito text-lg">
              Mais de <AnimatedCounter end={10000} /> clientes satisfeitos
            </span>
          </div>
          
          <h1 className="font-fredoka text-5xl md:text-7xl mb-4 hero-title stagger-animation">
            O melhor
            <br />
            <span className="text-yellow-400 shimmer">HAMBÚRGUER</span>
            <br />
            da cidade!
          </h1>
          
          <p className="font-nunito text-lg md:text-xl mb-8 hero-subtitle stagger-animation">
            Ingredientes frescos, sabor incomparável e entrega rápida.
            <br />
            <span className="stagger-animation">Experimente agora!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center stagger-animation">
            <Link
              to="/cardapio"
              className="btn-secondary px-8 py-4 rounded-full font-nunito font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 ripple"
            >
              PEDIR AGORA
            </Link>
          </div>
          
          <div className="mt-12 text-yellow-400 stagger-animation">
            <p className="font-nunito text-sm mb-2">A partir de</p>
            <p className="font-fredoka text-4xl neon pulse">R$ 15,90</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 product-card bg-gray-50 stagger-animation glass">
                <div className="flex justify-center mb-4 morph-icon">
                  {feature.icon}
                </div>
                <h3 className="font-fredoka text-3xl text-gray-800 mb-2 counter">{feature.title}</h3>
                <h4 className="font-nunito font-bold text-lg text-gray-700 mb-2">{feature.subtitle}</h4>
                <p className="font-nunito text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <h2 className="font-fredoka text-6xl md:text-7xl text-center text-gray-800 mb-16">
      O que nossos clientes dizem
    </h2>
        <div className="mt-16">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
      name: "Maria Silva",
      rating: "⭐⭐⭐⭐⭐",
      comment: "Melhor hambúrguer da cidade! Ingredientes frescos e entrega super rápida.",
      avatar: "👩‍🦰"
    },
    {
      name: "João Santos",
      rating: "⭐⭐⭐⭐⭐",
      comment: "Atendimento excelente e o sabor é incomparável. Recomendo!",
      avatar: "👨‍💼"
    },
    {
      name: "Ana Costa",
      rating: "⭐⭐⭐⭐⭐",
      comment: "Adoro a opção de montar meu próprio hambúrguer. Muito criativo!",
      avatar: "👩‍🎓"
    }
            ].map((social, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{social.avatar}</div>
                  <h3 className="font-fredoka text-xl text-gray-800">{social.name}</h3>
                </div>
                <p className="font-nunito text-gray-600 text-sm mb-4 text-center">
                  {social.rating}
                </p>
                <div className="text-center">
                  <span className="font-fredoka text-xl text-black-600">{social.comment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  </div>
</section>


      {/* About Section */}
      <section className="py-16 gradient-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-fredoka text-4xl md:text-5xl text-gray-800 mb-6 stagger-animation">
              Nossa História
            </h2>
            <p className="font-nunito text-lg text-gray-700 mb-8 leading-relaxed stagger-animation">
              Há mais de <AnimatedCounter end={10} /> anos servindo os melhores hambúrgueres da cidade. Nossa paixão pela 
              culinária e ingredientes frescos nos tornou referência em qualidade e sabor. 
              Cada hambúrguer é preparado com carinho e dedicação para proporcionar uma 
              experiência única aos nossos clientes.
            </p>
            <Link
              to="/sobre"
              className="btn-primary px-8 py-3 rounded-full font-nunito font-semibold inline-block ripple stagger-animation"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stagger-animation">
              <div className="text-4xl mb-2">🍔</div>
              <div className="font-fredoka text-3xl text-yellow-400 mb-2">
                <AnimatedCounter end={50000} suffix="+" />
              </div>
              <p className="font-nunito text-gray-300">Hambúrgueres Vendidos</p>
            </div>
            <div className="stagger-animation">
              <div className="text-4xl mb-2">😊</div>
              <div className="font-fredoka text-3xl text-yellow-400 mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="font-nunito text-gray-300">Clientes Felizes</p>
            </div>
            <div className="stagger-animation">
              <div className="text-4xl mb-2">⭐</div>
              <div className="font-fredoka text-3xl text-yellow-400 mb-2">
                <AnimatedCounter end={4.9} suffix="/5" />
              </div>
              <p className="font-nunito text-gray-300">Avaliação Média</p>
            </div>
            <div className="stagger-animation">
              <div className="text-4xl mb-2">🚚</div>
              <div className="font-fredoka text-3xl text-yellow-400 mb-2">
                <AnimatedCounter end={15} suffix=" min" />
              </div>
              <p className="font-nunito text-gray-300">Tempo de Entrega</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-bounce float">🍔</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-pulse float" style={{ animationDelay: '1s' }}>🍟</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-fredoka text-4xl md:text-5xl mb-6 stagger-animation">
            Pronto para experimentar?
          </h2>
          <p className="font-nunito text-lg mb-8 stagger-animation">
            Faça seu pedido agora e receba em casa em até <span className="font-bold text-yellow-400">15 minutos</span>!
          </p>
          <Link
            to="/cardapio"
            className="btn-secondary px-8 py-4 rounded-full font-nunito font-bold text-lg inline-block ripple pulse stagger-animation"
          >
            FAZER PEDIDO AGORA
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

