// app/privacy-policy/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Sales Command Center',
  description: 'Privacy policy for Sales Command Center - Multi-company sales management platform',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1135B5] to-[#1C40AC] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">SC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sales Command Center</h1>
                <p className="text-sm text-gray-500">Privacy Policy</p>
              </div>
            </div>
            <Link 
              href="/"
              className="text-[#1135B5] hover:text-[#1C40AC] transition-colors"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Last Updated */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Sales Command Center (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are committed to protecting your 
                privacy and ensuring the security of your personal information. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our mobile application and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. By using our application, you consent to the data practices 
                described in this policy.
              </p>
            </div>

            {/* Information Collection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700 text-sm mb-2">We may collect the following personal information:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Professional information (role, company relationships)</li>
                    <li>Account credentials</li>
                    <li>Profile information and preferences</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Data</h3>
                  <p className="text-gray-700 text-sm mb-2">The app processes the following business-related data:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                    <li>Employer/company information you work with</li>
                    <li>Client and business partner details</li>
                    <li>Sales orders and transaction records</li>
                    <li>Tasks, follow-ups, and meeting schedules</li>
                    <li>Performance metrics and analytics</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                  <p className="text-gray-700 text-sm">We automatically collect information about how you interact with our app, including:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2 mt-2">
                    <li>Device information (model, OS version, unique identifiers)</li>
                    <li>App usage patterns and feature interactions</li>
                    <li>Crash reports and performance data</li>
                    <li>IP address and network information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To provide and maintain our services</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To notify you about changes to our app</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To provide customer support</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To gather analysis for app improvement</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To monitor usage and detect issues</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#1135B5] rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">To process transactions and manage orders</span>
                </div>
              </div>
            </div>

            {/* Data Storage and Security */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Storage and Security</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm leading-relaxed">
                  🔒 We take data security seriously. Your information is stored locally on your device 
                  using secure encryption. We do not store your business data on external servers unless 
                  you explicitly enable cloud backup features.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These include:
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Local encrypted database storage</li>
                <li>Secure API communication (when cloud features are enabled)</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication measures</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in app operations (under confidentiality agreements)</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-[#1135B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Access Data</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Request a copy of your personal data</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-[#1135B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Correct Data</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Update or correct inaccurate information</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-[#1135B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Delete Data</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Request deletion of your information</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-[#1135B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Export Data</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Download your data in a portable format</p>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our application is not intended for children under the age of 13. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our app may integrate with third-party services for enhanced functionality:
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Cloud Backup (Optional)</span>
                  <span className="text-xs text-gray-500">Google Drive / iCloud</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Analytics</span>
                  <span className="text-xs text-gray-500">Firebase / Mixpanel</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Crash Reporting</span>
                  <span className="text-xs text-gray-500">Sentry / Crashlytics</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-3">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to 
                review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Us */}
            <div className="bg-gradient-to-r from-[#1135B5] to-[#1C40AC] rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-blue-100 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-100">privacy@salescommandcenter.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-blue-100">123 Business Ave, Suite 100, San Francisco, CA 94105</span>
                </div>
              </div>
            </div>

            {/* GDPR/CCPA Compliance Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs text-gray-500">CCPA Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-gray-500">Encrypted Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Sales Command Center. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/" className="text-[#1135B5] hover:text-[#1C40AC] mx-2">Home</Link>
              |
              <Link href="/terms" className="text-[#1135B5] hover:text-[#1C40AC] mx-2">Terms of Service</Link>
              |
              <Link href="/privacy-policy" className="text-[#1135B5] hover:text-[#1C40AC] mx-2">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}