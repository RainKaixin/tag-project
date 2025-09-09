// PrivacyPolicyModal.js - 隱私政策彈窗組件

import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col'>
        {/* 头部 */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Privacy Policy — TAG (Tech Art Guide)
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className='p-6 overflow-y-auto flex-1'>
          <div className='prose prose-sm max-w-none'>
            <div className='mb-6'>
              <p>
                <strong>Effective Date:</strong> 2025-09-08
              </p>
              <p>
                <strong>Operator/Company:</strong> Shu Wang (Rain), Tech Art
                Guide(TAG)
              </p>
              <p>
                <strong>Primary Domain:</strong> techartguide.com
              </p>
              <p>
                <strong>Contact Email:</strong> tag@rainwang.art
              </p>
              <p>
                <strong>Mailing Address:</strong> 100 Town Center Dr. Apt 7402,
                Garden City， GA 31405
              </p>
            </div>

            <hr className='my-6' />

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              1) Scope
            </h3>
            <p className='mb-4'>
              This Privacy Policy applies to TAG websites, apps, and related
              services (collectively, the "<strong>Service</strong>"). If this
              Policy conflicts with the Terms of Service, the ToS controls.
              Specific feature policies prevail where conflicts arise.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              2) Information We Collect
            </h3>
            <p className='mb-2'>
              We follow data‑minimization principles and collect:
            </p>
            <ul className='list-disc pl-6 mb-4 space-y-2'>
              <li>
                <strong>Data you provide:</strong> account data (email, display
                name, avatar, profile/bio, school/major if you choose), content
                you upload (images/videos/text), collaboration applications,
                milestones, comments, and support/feedback communications.
              </li>
              <li>
                <strong>Data collected automatically:</strong> device and log
                data (IP, browser/OS, language, timestamps, referrer, error
                logs), usage events (page views, clicks, searches, likes,
                follows, notifications).
              </li>
              <li>
                <strong>Cookies & local storage:</strong> for session,
                preferences, and analytics (see Section 10).
              </li>
              <li>
                <strong>From third parties:</strong> authentication providers
                (basic profile per your settings), email delivery, analytics,
                and error‑monitoring services.
              </li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              3) How We Use Information
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <strong>Provide & maintain</strong> the Service (authentication,
                uploads, display, notifications, collaboration, comments).
              </li>
              <li>
                <strong>Security</strong> (fraud/abuse detection, access
                control, auditing).
              </li>
              <li>
                <strong>Improve</strong> the Service (debugging, performance
                analytics, user research).
              </li>
              <li>
                <strong>Communicate</strong> with you (service updates,
                important changes, support).
              </li>
              <li>
                <strong>Comply</strong> with legal obligations and enforce the
                ToS.
              </li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              4) Legal Bases (GDPR/UK GDPR, where applicable)
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <strong>Contractual necessity</strong> for core features.
              </li>
              <li>
                <strong>Legitimate interests</strong> for security, abuse
                prevention, product improvement, and baseline analytics (with
                safeguards).
              </li>
              <li>
                <strong>Consent</strong> for optional cookies/analytics and
                marketing communications.
              </li>
              <li>
                <strong>Legal obligation</strong> where required by law.
              </li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              5) Sharing & Disclosure
            </h3>
            <p className='mb-2'>
              We <strong>do not sell</strong> personal information. We may share
              with:
            </p>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <strong>Processors/sub‑processors</strong> that provide
                database, storage/CDN, email, analytics, and error monitoring.
              </li>
              <li>
                <strong>Legal/safety</strong> authorities when required or to
                protect users and the Service.
              </li>
              <li>
                <strong>Business transfers</strong> (merger, acquisition, asset
                sale) subject to this Policy's protections.
              </li>
            </ul>
            <p className='mb-4'>
              We maintain a public <strong>sub‑processor list</strong> (name,
              purpose, region, data categories) and keep it up to date on our
              site.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              6) Retention
            </h3>
            <p className='mb-4'>
              We retain information <strong>no longer than necessary</strong>{' '}
              for the purposes described. After you delete content or your
              account, we delete or anonymize data within a reasonable period,
              subject to technical backups and legal requirements.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              7) Security
            </h3>
            <p className='mb-4'>
              We implement reasonable{' '}
              <strong>technical and organizational measures</strong> (access
              control, encryption in transit/at rest via underlying providers,
              least privilege, logging and alerting). No system can be 100%
              secure.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              8) International Transfers
            </h3>
            <p className='mb-4'>
              Your information may be processed outside your country/region,
              depending on provider regions. We use appropriate safeguards
              (e.g., SCCs) where required by law.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              9) Your Rights
            </h3>
            <p className='mb-2'>
              Depending on your jurisdiction, you may have rights to{' '}
              <strong>
                access, portability, rectification, erasure, restriction, object
              </strong>
              , and <strong>withdraw consent</strong> (without affecting prior
              lawful processing).
            </p>
            <p className='mb-4'>
              <strong>CCPA/CPRA (California):</strong> rights to know, delete,
              correct, limit use of sensitive PI, and non‑discrimination. We do
              not sell personal information. If we ever "share" for
              cross‑context advertising, we will provide a "Do Not Share"
              mechanism.
            </p>
            <p className='mb-4'>
              You can exercise rights via the contact methods in Section 14; we
              may need to verify your identity.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              10) Cookies & Local Storage
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <strong>Strictly necessary:</strong> session, security, load
                balancing (cannot be disabled).
              </li>
              <li>
                <strong>Functional:</strong> language/theme preferences.
              </li>
              <li>
                <strong>Analytics:</strong> aggregate usage and performance
                (opt‑in where required).
              </li>
            </ul>
            <p className='mb-4'>
              You can manage cookies in your browser or via our
              cookie‑preferences center. Blocking strictly necessary cookies may
              break the Service.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              11) Children's Privacy
            </h3>
            <p className='mb-4'>
              The Service is intended for users <strong>13+</strong> (or the
              local minimum age). We do not knowingly collect personal data from
              children. Contact us if you believe we collected data without
              guardian consent.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              12) Do Not Track
            </h3>
            <p className='mb-4'>
              Industry standards for DNT are not uniform; we may not respond to
              DNT signals.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              13) Changes to this Policy
            </h3>
            <p className='mb-4'>
              We may update this Policy from time to time. Material changes will
              be notified in‑product or via email. Continued use after the
              effective date constitutes acceptance.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              14) Contact Us
            </h3>
            <p className='mb-4'>
              <strong>Email:</strong> tag@rainwang.art
              <br />
              <strong>Address:</strong> 100 Town Center Dr. Apt 7402, Garden
              City， GA 31405
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              15) Sub‑processors (Illustrative Placeholders)
            </h3>
            <p className='mb-2'>
              Publish and maintain a page at <code>/legal/subprocessors</code>{' '}
              listing current providers. Example table:
            </p>
            <div className='overflow-x-auto mb-4'>
              <table className='min-w-full border border-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Name
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Purpose
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Region
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Data Categories
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2'>
                      Supabase
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Database, Auth, Storage/CDN, Edge Functions
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      US/EU (selected region)
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Account data, content files, logs
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2'>Vercel</td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Frontend hosting, CDN, edge caching
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>Global</td>
                    <td className='border border-gray-300 px-4 py-2'>
                      IP, request metadata, static access logs
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2'>
                      Email service (Resend)
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Transactional email
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>US/EU</td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Email, delivery status
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2'>
                      Analytics/Monitoring (Vercel Analytics/Sentry)
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Performance analytics & error monitoring
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>Global</td>
                    <td className='border border-gray-300 px-4 py-2'>
                      Usage/error logs (mostly de‑identified)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              16) Additional Retention Details
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                Account data: delete/anonymize within{' '}
                <strong>30–90 days</strong> after account deletion.
              </li>
              <li>
                Content files: CDN invalidation and backend deletion may take{' '}
                <strong>X days</strong>.
              </li>
              <li>
                Security/audit logs: retained <strong>90–180 days</strong> for
                safety and compliance.
              </li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              17) Complaints
            </h3>
            <p className='mb-4'>
              If you believe our processing violates applicable law, you may
              lodge a complaint with a supervisory authority. We encourage you
              to contact us first.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              18) Definitions
            </h3>
            <p className='mb-4'>
              "personal data / personal information", "processing",
              "controller", "processor", "sell", and "share" have the meanings
              given under applicable law.
            </p>

            <hr className='my-6' />

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Annex — Cookie/Local Storage Examples
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <code>session</code> for authentication (strictly necessary)
              </li>
              <li>
                <code>preferred_language</code>, <code>theme</code> for UI
                preferences (functional)
              </li>
              <li>
                <code>analytics_*</code> for performance/aggregated metrics
                (analytics; opt‑in where required)
              </li>
            </ul>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className='flex justify-end p-6 border-t border-gray-200 flex-shrink-0'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-tag-blue text-white rounded-md hover:bg-tag-dark-blue transition-colors duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
