'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { supabase } from '../lib/supabase';

type MenuItem = { name: string; price?: string; description?: string };
type MenuSection = { title: string; items: MenuItem[] };

export const Restaurant: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: '2' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [copy, setCopy] = useState({
    title: 'Vintage Car Restaurant',
    description: 'Step into a retro-styled dining experience. The Vintage Car Restaurant serves hearty breakfasts, leisurely lunches, and elegant dinners — all with a Karoo twist. Fresh, locally sourced ingredients paired with warm hospitality make every meal unforgettable.',
  heroImage: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215819859_d1a76dd0.webp',
  });
  const [menuSections, setMenuSections] = useState<MenuSection[] | null>(null);
  const [showFullMenu, setShowFullMenu] = useState(false);

  // Fallback full menu (can be edited in DB: restaurant_info.menu_sections)
  const fallbackMenu: MenuSection[] = useMemo(() => ([
    {
      title: '☕ Hot Beverages',
      items: [
        { name: 'Espresso', price: 'Single R20 | Double R27' },
        { name: 'Americano', price: 'R28' },
        { name: 'Cappuccino', price: 'R35' },
        { name: 'Hazelnut Cappuccino', price: 'R42' },
        { name: 'Latte', price: 'R40', description: 'Almond milk available' },
        { name: 'Cafè Mocha', price: 'R35' },
        { name: 'Hot Chocolate', price: 'R35' },
        { name: 'Tea / Rooibos Tea', price: 'R30' },
      ]
    },
    {
      title: '🥤 Cold Beverages',
      items: [
        { name: 'Appletizer / Grapetizer', price: 'R34' },
        { name: 'Iced Tea', price: 'R35' },
        { name: 'Fruit Juices', price: 'R25' },
        { name: 'Soda', price: 'R20' },
        { name: 'Still or Sparkling Water (500ml)', price: 'R24' },
      ]
    },
    {
      title: '🍨 Milkshakes (R34 each)',
      items: [
        { name: 'Chocolate · Banana · Bubblegum · Strawberry · Lime · Vanilla' },
      ]
    },
    {
      title: '🍳 Breakfast',
      items: [
        { name: 'Farmstyle Breakfast', price: 'R130', description: '2 eggs, bacon, beef sausage, grilled tomato & mushroom, chips, toast.' },
        { name: 'Omelette', price: 'R78', description: 'Choose 2 fillings: onion, spinach, feta, mushroom, tomato, cheddar, ham, bacon, mince (+R10 per extra).' },
        { name: 'Bolognese Toast', price: 'R60', description: 'Savoury tomato bolognese on toast, topped with fried egg.' },
        { name: 'Baked Bean Toast', price: 'R60', description: 'Spicy beans on toast.' },
        { name: 'Breakfast Croissant', price: 'R65', description: 'Scrambled egg & bacon.' },
        { name: 'Filled Croissant', price: 'R60', description: 'Ham, cheese & tomato.' },
        { name: 'Veggie Stack', price: 'R95', description: 'Black mushroom, tomato & avo on corn crumpets (+R10 add egg).' },
        { name: 'Salmon Croissant', price: 'R135', description: 'Smoked salmon with scrambled eggs.' },
        { name: 'Muffins / Scones', price: 'R45' },
      ]
    },
    {
      title: '🥪 Toasties (served with chips or salad)',
      items: [
        { name: 'Chicken Mayo', price: 'R60' },
        { name: 'Tuna Mayo with Onion & Peppers', price: 'R60' },
        { name: 'Ham, Cheese & Tomato', price: 'R60' },
        { name: 'Bacon, Egg & Cheese', price: 'R65' },
        { name: 'Bolognese & Cheese', price: 'R65' },
        { name: 'Smoked Chicken Mayo & Mozzarella', price: 'R65' },
      ]
    },
    {
      title: '🧇 Savoury Waffles',
      items: [
        { name: 'Bolognese & Grilled Cheddar', price: 'R110' },
        { name: 'Chicken Mayo', price: 'R110' },
        { name: 'Creamed Spinach with Mozzarella & Feta', price: 'R120' },
      ]
    },
    {
      title: '🍔 Burgers (served with chips or salad)',
      items: [
        { name: 'Classic Beef Burger', price: 'R80' },
        { name: 'Cheese Burger', price: 'R90' },
        { name: 'Chicken Burger', price: 'R90' },
        { name: 'Breakfast Burger', price: 'R120', description: 'beef patty, onion rings, bacon & egg' },
      ]
    },
    {
      title: '🥗 Salads',
      items: [
        { name: 'Greek Salad', price: 'R88', description: 'with feta & olives' },
        { name: 'Smoked Chicken Salad', price: 'R92', description: 'with sweet chilli' },
        { name: 'Chicken Salad', price: 'R110', description: 'with avo & bacon/feta' },
        { name: 'Potato Salad', price: 'R60' },
      ]
    },
    {
      title: '🍝 Pasta & Mains',
      items: [
        { name: 'Fettucine Alfredo', price: 'R119', description: 'ham & mushroom in cream sauce' },
        { name: 'Spaghetti Bolognese', price: 'R112' },
        { name: 'Lasagne', price: 'R110', description: 'served with salad' },
        { name: 'Chicken Parmigiano', price: 'R102' },
        { name: 'Chicken & Mushroom Pie', price: 'R120', description: 'side salad' },
        { name: 'Hake Fillet', price: 'R98', description: 'grilled or battered' },
        { name: 'Fish Basket', price: 'R160', description: 'fish, calamari, crab sticks, onion rings' },
        { name: 'Calamari', price: 'R105', description: 'deep fried or grilled, with sauce' },
        { name: 'Prego Roll', price: 'R102', description: 'beef steak with prego sauce' },
        { name: 'Steak & Egg', price: 'R120', description: '250g sirloin, onion rings' },
      ]
    },
    {
      title: '🍰 Desserts',
      items: [
        { name: 'Ice Cream & Chocolate Sauce', price: 'R50' },
        { name: 'Fruit Salad & Ice Cream', price: 'R60' },
        { name: 'Waffle with Ice Cream', price: 'R80' },
        { name: 'Waffle with Chocolate Mousse', price: 'R80' },
        { name: 'Cake of the Day', price: 'SQ' },
      ]
    }
  ]), []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_info')
          .select('title,description,background_image,menu_sections')
          .maybeSingle();
    if (!error && data) {
          setCopy(prev => ({
            ...prev,
            title: data.title || prev.title,
            description: data.description || prev.description,
      heroImage: data.background_image || (data as any).backgroundImage || prev.heroImage,
          }));
          if (Array.isArray((data as any).menu_sections) && (data as any).menu_sections.length > 0) {
            setMenuSections((data as any).menu_sections as MenuSection[]);
          } else {
            setMenuSections(fallbackMenu);
          }
        }
      } catch (_) {
        setMenuSections(fallbackMenu);
      }
    };
    load();
  }, [fallbackMenu]);

  const featuredItems = useMemo(() => {
    const all = (menuSections ?? fallbackMenu).flatMap(section =>
      section.items.map(item => ({ ...item, section: section.title }))
    );
    return all.slice(0, 8);
  }, [menuSections, fallbackMenu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('restaurant_reservations').insert({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests || '2'),
      });
      alert('Reservation request submitted!');
    } catch (_) {
      alert('Reservation submitted (offline mode).');
    } finally {
      setShowBookingModal(false);
      setFormData({ name: '', email: '', date: '', time: '', guests: '2' });
    }
  };

  return (
    <section id="restaurant" className="py-20 bg-gradient-to-br from-slate-50 to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              {copy.title}
            </h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              {copy.description}
            </p>
            <Button 
              onClick={() => setShowBookingModal(true)}
              variant="primary" 
              className="px-8 py-4 text-lg shadow-2xl"
            >
              Reserve a Table
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 relative h-96">
            <Image 
              src={copy.heroImage}
              alt="Restaurant Interior"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
        </div>

        {/* Compact menu preview */}
        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 text-center">Menu</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {featuredItems.map((it, idx) => (
            <div key={idx} className="bg-white/90 rounded-xl shadow-md ring-1 ring-slate-200 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{(it as any).section}</div>
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-semibold text-slate-800">{it.name}</h4>
                {it.price && <span className="text-amber-600 whitespace-nowrap">{it.price}</span>}
              </div>
              {it.description && <p className="text-sm text-slate-600 mt-1">{it.description}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mb-16">
          <Button variant="outline" onClick={() => setShowFullMenu(s => !s)}>
            {showFullMenu ? 'Hide Full Menu' : 'View Full Menu'}
          </Button>
        </div>

        {showFullMenu && (
          <div className="space-y-10 mb-8">
            {(menuSections ?? fallbackMenu).map((section, idx) => (
              <div key={idx}>
                <h4 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h4>
                <div className="divide-y divide-slate-200 bg-white/80 rounded-xl ring-1 ring-slate-200">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 p-4">
                      <div>
                        <div className="font-medium text-slate-800">{item.name}</div>
                        {item.description && <div className="text-sm text-slate-600">{item.description}</div>}
                      </div>
                      {item.price && <div className="text-amber-700 whitespace-nowrap">{item.price}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)}>
        <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 text-center">Reserve a Table</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Submit Reservation
            </Button>
          </form>
        </div>
      </Modal>
    </section>
  );
};
