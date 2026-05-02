import { Link } from 'react-router-dom';

const columns = [
  {
    heading: 'About Us',
    links: ['Our Company', 'Our Coffee', 'Stories & News', 'Investor Relations', 'Customer Service'],
  },
  {
    heading: 'Careers',
    links: ['Culture & Values', 'Inclusion, Diversity & Equity', 'College Achievement Plan', 'Alumni Community', 'U.S. Careers'],
  },
  {
    heading: 'Social Impact',
    links: ['Sustainability', 'Creating Opportunities', 'Ethical Sourcing', 'Community', 'Starbucks Foundation'],
  },
  {
    heading: 'For Business Partners',
    links: ['Suppliers', 'Corporate Gift Card Sales', 'Office & Foodservice', 'Contact Us', 'Accessibility'],
  },
];

const socials = [
  { icon: '📸', label: 'Instagram', href: '#' },
  { icon: '🐦', label: 'Twitter/X', href: '#' },
  { icon: '👤', label: 'Facebook', href: '#' },
  { icon: '🎵', label: 'TikTok', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-sb-dark text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-black text-sm tracking-wider mb-4 text-sb-light uppercase">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sb-green flex items-center justify-center font-black text-2xl shadow-lg">S</div>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-full bg-white/10 hover:bg-sb-green flex items-center justify-center text-xl transition">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm text-center cursor-pointer">
              <div className="text-xs text-gray-400">Download on the</div>
              <div className="font-bold">App Store</div>
            </div>
            <div className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm text-center cursor-pointer">
              <div className="text-xs text-gray-400">Get it on</div>
              <div className="font-bold">Google Play</div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          © {new Date().getFullYear()} Starbucks Coffee Company. All rights reserved. |{' '}
          <a href="#" className="hover:text-white transition">Privacy Notice</a> ·{' '}
          <a href="#" className="hover:text-white transition">Terms of Use</a>
        </p>
      </div>
    </footer>
  );
}
