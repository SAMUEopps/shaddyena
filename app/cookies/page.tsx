// app/cookie-policy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Cookie,
  Info,
  BarChart3,
  Target,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Smartphone,
  Laptop,
  RefreshCw,
  Download,
  Eye,
  Sliders,
  Trash2,
  Clock,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  Heart
} from 'lucide-react';
import Link from 'next/link';

const CookiePolicyPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(true);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedCookie, setExpandedCookie] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check if user has already set cookie preferences
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences));
      setShowConsentBanner(false);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowConsentBanner(false);
    // Trigger a page reload to apply new preferences
    window.location.reload();
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
    savePreferences();
  };

  const rejectAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false
    });
    savePreferences();
  };

  // Cookie categories
  const cookieCategories = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      icon: <Shield className="w-6 h-6" />,
      description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation, security, and access to secure areas. The website cannot function properly without these cookies.',
      alwaysOn: true,
      cookies: [
        { name: 'session_id', purpose: 'Maintains your login session', duration: 'Session' },
        { name: 'csrf_token', purpose: 'Protects against cross-site request forgery', duration: 'Session' },
        { name: 'cart_id', purpose: 'Remembers items in your shopping cart', duration: '30 days' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.',
      alwaysOn: false,
      cookies: [
        { name: '_ga', purpose: 'Google Analytics - distinguishes users', duration: '2 years' },
        { name: '_gid', purpose: 'Google Analytics - distinguishes users', duration: '24 hours' },
        { name: '_gat', purpose: 'Google Analytics - throttles request rate', duration: '1 minute' }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      icon: <Target className="w-6 h-6" />,
      description: 'These cookies are used to deliver relevant advertisements to you. They track your browsing habits across websites to show you products and offers that match your interests.',
      alwaysOn: false,
      cookies: [
        { name: '_fbp', purpose: 'Facebook Pixel - tracks conversions', duration: '3 months' },
        { name: '_gcl_au', purpose: 'Google Ads - conversion tracking', duration: '3 months' },
        { name: '_uetsid', purpose: 'Microsoft Advertising - tracking', duration: '24 hours' }
      ]
    }
  ];

  // Third-party cookies
  const thirdPartyCookies = [
    { name: 'Google Analytics', purpose: 'Website analytics and behavior tracking', privacyUrl: 'https://policies.google.com/privacy' },
    { name: 'Facebook Pixel', purpose: 'Ad targeting and conversion tracking', privacyUrl: 'https://www.facebook.com/privacy/policy/' },
    { name: 'Google Ads', purpose: 'Ad performance measurement', privacyUrl: 'https://policies.google.com/privacy' },
    { name: 'Cloudflare', purpose: 'Security and performance optimization', privacyUrl: 'https://www.cloudflare.com/privacypolicy/' }
  ];

  const manageCookies = () => {
    setShowPreferences(true);
    // In a real implementation, this would open a modal or redirect to settings
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Cookie className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-4">
              We use cookies to enhance your browsing experience and understand how you use our platform.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] text-sm">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Last Updated: April 1, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What Are Cookies Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            What Are Cookies?
          </h2>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
                <Cookie className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                  Cookies are small text files that websites place on your computer, phone, or tablet when you visit. They help websites remember information about your visit, like your preferences and settings, making your next visit easier and the site more useful to you.
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  Think of cookies like a memory aid - they help websites recognize you and remember your preferences, so you don't have to set them every time you visit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Types of Cookies We Use
          </h2>
          
          <div className="space-y-4">
            {cookieCategories.map((category) => (
              <div key={category.id} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <button
                  onClick={() => setExpandedCookie(expandedCookie === category.id ? null : category.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-[var(--color-background-soft)] transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      category.alwaysOn ? 'bg-green-500/10' : 'bg-[var(--color-primary)]/10'
                    }`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">{category.name}</h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {category.alwaysOn ? 'Always Active' : 'Optional'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!category.alwaysOn && (
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                          onChange={(e) => {
                            setCookiePreferences({
                              ...cookiePreferences,
                              [category.id]: e.target.checked
                            });
                          }}
                          className="w-5 h-5 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    )}
                    {expandedCookie === category.id ? (
                      <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                    )}
                  </div>
                </button>
                
                {expandedCookie === category.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-[var(--color-border)] bg-[var(--color-background-soft)]/30 animate-slide-in">
                    <p className="text-[var(--color-text-muted)] text-sm mb-4">{category.description}</p>
                    <div className="bg-[var(--color-surface)] rounded-lg overflow-hidden border border-[var(--color-border)]">
                      <table className="w-full text-sm">
                        <thead className="bg-[var(--color-background-soft)]">
                          <tr>
                            <th className="px-4 py-2 text-left text-[var(--color-text)]">Cookie Name</th>
                            <th className="px-4 py-2 text-left text-[var(--color-text)]">Purpose</th>
                            <th className="px-4 py-2 text-left text-[var(--color-text)]">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          {category.cookies.map((cookie, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 font-mono text-xs text-[var(--color-primary)]">{cookie.name}</td>
                              <td className="px-4 py-2 text-[var(--color-text-muted)]">{cookie.purpose}</td>
                              <td className="px-4 py-2 text-[var(--color-text-muted)]">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How We Use Cookies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            How We Use Cookies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:shadow-lg transition-all">
              <div className="inline-flex p-2 bg-green-500/10 rounded-lg mb-3">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Essential Operations</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Keep the website secure and functioning properly, including shopping cart and login features.</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:shadow-lg transition-all">
              <div className="inline-flex p-2 bg-blue-500/10 rounded-lg mb-3">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Analytics & Performance</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Understand how visitors use our site to improve user experience and fix issues.</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:shadow-lg transition-all">
              <div className="inline-flex p-2 bg-purple-500/10 rounded-lg mb-3">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Personalization</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Remember your preferences and show you relevant products and recommendations.</p>
            </div>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Third-Party Cookies
          </h2>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <p className="text-[var(--color-text-muted)] mb-4">
              We use trusted third-party services that may place cookies on your device. These services help us analyze traffic, show relevant ads, and improve our services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {thirdPartyCookies.map((cookie, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[var(--color-background-soft)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--color-text)] text-sm">{cookie.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{cookie.purpose}</p>
                  </div>
                  <a
                    href={cookie.privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline text-xs flex items-center space-x-1"
                  >
                    <span>Privacy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Control */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Your Control Over Cookies
          </h2>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-4">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">Cookie Preferences</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  You can manage your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website. You can choose to accept or reject non-essential cookies.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Sliders className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">Browser Settings</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Most browsers allow you to control cookies through their settings. You can set your browser to block cookies, delete existing cookies, or notify you when cookies are being set.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">How to Manage Cookies by Browser</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences' },
                    { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac' },
                    { name: 'Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }
                  ].map((browser) => (
                    <a
                      key={browser.name}
                      href={browser.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 bg-[var(--color-background-soft)] text-[var(--color-text)] rounded-full hover:bg-[var(--color-primary)]/10 transition-colors"
                    >
                      {browser.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Cookie Preferences (if user has set) */}
        {!showConsentBanner && (
          <div className="mb-12">
            <div className="bg-green-500/10 rounded-xl p-5 border border-green-500/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">Your Current Preferences</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Analytics: {cookiePreferences.analytics ? 'Enabled' : 'Disabled'} • 
                      Marketing: {cookiePreferences.marketing ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsentBanner(true)}
                  className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Change Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cookie Consent Banner */}
        {showConsentBanner && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-2xl animate-slide-in">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cookie className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="font-semibold text-[var(--color-text)]">🍪 We Value Your Privacy</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    <Link href="/cookie-policy" className="text-[var(--color-primary)] hover:underline ml-1">
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2 text-sm border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={manageCookies}
                    className="px-4 py-2 text-sm border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
                  >
                    Customize
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Preferences Modal (shown when Customize is clicked) */}
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="p-6 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--color-text)]">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-1 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Choose which cookies you want to allow. Necessary cookies are always enabled.
                </p>
              </div>
              <div className="p-6 space-y-4">
                {cookieCategories.map((category) => (
                  <div key={category.id} className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-[var(--color-text)]">{category.name}</h4>
                        {category.alwaysOn && (
                          <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">Always On</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{category.description.split('.')[0]}</p>
                    </div>
                    {!category.alwaysOn && (
                      <input
                        type="checkbox"
                        checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                        onChange={(e) => {
                          setCookiePreferences({
                            ...cookiePreferences,
                            [category.id]: e.target.checked
                          });
                        }}
                        className="w-5 h-5 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background-soft)] flex gap-3">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    savePreferences();
                    setShowPreferences(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
          <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3 flex items-center">
              <Heart className="w-5 h-5 text-[var(--color-primary)] mr-2" />
              Questions About Cookies?
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">
              If you have any questions about our use of cookies or how we protect your privacy, please contact us.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:privacy@shaddyna.com" className="inline-flex items-center space-x-2 text-sm text-[var(--color-primary)] hover:underline">
                <Mail className="w-4 h-4" />
                <span>privacy@shaddyna.com</span>
              </a>
              <a href="/privacy-policy" className="inline-flex items-center space-x-2 text-sm text-[var(--color-primary)] hover:underline">
                <Shield className="w-4 h-4" />
                <span>View Privacy Policy</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;