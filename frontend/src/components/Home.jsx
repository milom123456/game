import React from 'react';
import { MousePointerClick, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // লোকাল স্টোরেজ থেকে ইউজার ডেটা চেক করা
  const user = JSON.parse(localStorage.getItem('user'));

  // ডেমো পে-আউট ডেটা
  const payouts = [
    { user: "Arif**", amount: "$5.00", method: "Litecoin", time: "2 min ago" },
    { user: "Sumi**", amount: "$10.50", method: "PayPal", time: "5 min ago" },
    { user: "John**", amount: "$1.00", method: "Amazon", time: "12 min ago" },
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-500 italic">CASHFLOW</h1>
        <div className="space-x-6 hidden md:flex text-gray-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#offers" className="hover:text-white transition">Offers</a>
          <a href="#reviews" className="hover:text-white transition">Reviews</a>
        </div>
        <div className="space-x-4">
          {user ? (
            <Link to="/dashboard" className="text-blue-400 font-bold px-4 py-2 border border-blue-500/30 rounded-lg bg-blue-500/10">
              Hi, {user.name}
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white cursor-pointer px-4">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-bold transition cursor-pointer">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Live Payouts Section (Now at the TOP) */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-b border-gray-900">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Payouts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {payouts.map((p, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500 transition cursor-default">
              <div>
                <p className="font-bold text-gray-200">{p.user}</p>
                <p className="text-xs text-gray-500">{p.time}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">{p.amount}</p>
                <p className="text-[10px] text-gray-500 uppercase">{p.method}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-blue-400 text-sm mb-6">
          <Zap size={16} /> <span>সর্বাধিক পেমেন্ট দেওয়ার নিশ্চয়তা!</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          গেম খেলুন, সার্ভে করুন <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            এবং রিয়েল ক্যাশ আয় করুন
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          বিনা অভিজ্ঞতায় ঘরে বসে ডলার ইনকাম শুরু করুন। আমরা সরাসরি পেপাল, বিটকয়েন এবং গিফট কার্ডে পেমেন্ট করি।
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to={user ? "/dashboard" : "/signup"} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105">
            এখনই ইনকাম শুরু করুন <ArrowRight size={20} />
          </Link>
          <button className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition cursor-pointer">
            কিভাবে কাজ করে?
          </button>
        </div>

        {/* Trust Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 text-gray-500">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">$1.2M+</p>
            <p className="text-sm">টাকা প্রদান করা হয়েছে</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">450K+</p>
            <p className="text-sm">অ্যাক্টিভ ইউজার</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">4.8/5</p>
            <p className="text-sm">ট্রাস্টপাইলট রেটিং</p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-gray-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">কেন আমাদের বেছে নিবেন?</h2>
            <p className="text-gray-400">সেরা ফিচারের মাধ্যমে আপনার আয়কে সহজ করুন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MousePointerClick className="text-blue-500" size={32} />}
              title="সহজ টাস্ক"
              desc="গেম ডাউনলোড বা সার্ভে পূরণ করে সহজেই পয়েন্ট জমান।"
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-500" size={32} />}
              title="ইনস্ট্যান্ট উইথড্র"
              desc="৫০০ পয়েন্ট হলেই মাত্র ৫ মিনিটে পেমেন্ট পেয়ে যাবেন আপনার ওয়ালেটে।"
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" size={32} />}
              title="নিরাপদ প্ল্যাটফর্ম"
              desc="আপনার তথ্য এবং আয় আমাদের কাছে ১০০% নিরাপদ।"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500">
        <p>© 2026 CASHFLOW. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gray-800/40 border border-gray-800 p-8 rounded-2xl hover:border-blue-500 transition group cursor-default">
    <div className="mb-4 transform group-hover:scale-110 transition">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Home;