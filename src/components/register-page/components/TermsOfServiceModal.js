// TermsOfServiceModal.js - 服務條款彈窗組件

import React from 'react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
            Terms of Service — TAG (Tech Art Guide)
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
                <strong>Contact Email:</strong> tag@rainwang.art
              </p>
            </div>

            <hr className='my-6' />

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              1) Acceptance of Terms
            </h3>
            <p className='mb-4'>
              By accessing or using TAG's websites and related services (the "
              <strong>Service</strong>"), you agree to be bound by these Terms
              of Service ("<strong>Terms</strong>"). If you do not agree, do not
              use the Service. Our <strong>Privacy Policy</strong> and any
              posted guidelines are incorporated into these Terms by reference.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              2) Eligibility
            </h3>
            <p className='mb-4'>
              You represent and warrant that you are at least{' '}
              <strong>13 years old</strong> (or the minimum age in your
              jurisdiction). If you use the Service on behalf of an
              organization, you are authorized to bind that entity to these
              Terms.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              3) Accounts & Security
            </h3>
            <p className='mb-4'>
              You must provide accurate information and safeguard your
              credentials. You are responsible for all activity under your
              account. Notify us promptly of any unauthorized use.
              <br />
              <strong>Password recovery</strong> is available via our reset
              flow; additional verification may be required.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              4) User Content & License
            </h3>
            <ul className='list-disc pl-6 mb-4 space-y-2'>
              <li>
                <strong>Ownership.</strong> You retain ownership of any content
                you upload or post (images, text, audio/video, projects,
                comments) ("<strong>User Content</strong>").
              </li>
              <li>
                <strong>License to TAG.</strong> You grant TAG a{' '}
                <strong>
                  non‑exclusive, worldwide, royalty‑free, transferable,
                  sublicensable
                </strong>{' '}
                license to host, store, reproduce, process, transmit, display,
                and distribute your User Content as necessary to operate,
                improve, and promote the Service. Reasonable technical copies
                may persist in backups/logs for a limited period after deletion.
              </li>
              <li>
                <strong>Marketing Display (Opt‑out).</strong> We may showcase
                public User Content in product placements, emails, or social
                channels to promote the Service. You can opt out via settings or
                by contacting us.
              </li>
              <li>
                <strong>Collaboration Artifacts.</strong> Content created or
                exchanged within applications, milestones, or reviews remains
                owned by the respective creators, but you grant a limited{' '}
                <strong>in‑product re‑use</strong> license so it can appear in
                collaboration histories, notifications, and related features.
              </li>
              <li>
                <strong>Responsibility.</strong> You are solely responsible for
                your User Content and for having all rights necessary to grant
                the above license.
              </li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              5) Acceptable Use Policy (AUP)
            </h3>
            <p className='mb-2'>You agree not to:</p>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                upload or engage in illegal, infringing, hateful, harassing,
                violent, sexually exploitative, or otherwise objectionable
                content or conduct;
              </li>
              <li>
                upload malware, attempt to gain unauthorized access, scrape at
                scale, or disrupt the Service;
              </li>
              <li>
                circumvent technical limits (including file‑size or rate limits)
                or security controls.
              </li>
            </ul>
            <p className='mb-4'>
              <strong>File & Bandwidth Limits.</strong> Upload size, types, and
              traffic are subject to posted guidelines. We may rate‑limit,
              remove content, or suspend accounts for abusive or excessive
              usage.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              6) Third‑Party Services
            </h3>
            <p className='mb-4'>
              The Service may integrate third‑party providers
              (Supabase、Vercel、Resend). Their own terms and privacy policies
              govern those services. TAG is not responsible for third‑party
              content, outages, or actions.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              7) Copyright & Takedown (DMCA)
            </h3>
            <p className='mb-4'>
              We respect intellectual property. If you believe material on the
              Service infringes your rights, send a takedown notice to our{' '}
              <strong>Designated Agent</strong>:<br />
              <strong>Email:</strong> tag@rainwang.art
              <br />
              <br />
              Your notice must include the required elements under applicable
              law (identification of the work, location of the material, your
              statements, and signature). We may terminate repeat infringers.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              8) Feedback
            </h3>
            <p className='mb-4'>
              Ideas, suggestions, or feedback you submit are deemed{' '}
              <strong>non‑confidential</strong> and you grant TAG a{' '}
              <strong>perpetual, worldwide, royalty‑free</strong> license to use
              them for any purpose.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              9) Fees & Taxes
            </h3>
            <p className='mb-4'>
              Unless otherwise stated, core features are currently free. Paid
              subscriptions or premium features, if any, will be described at
              purchase time. You are responsible for applicable taxes.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              10) Privacy
            </h3>
            <p className='mb-4'>
              Our collection and use of personal information is described in our{' '}
              <strong>Privacy Policy</strong>. Please review it carefully.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              11) Termination
            </h3>
            <p className='mb-4'>
              We may suspend or terminate access to all or part of the Service
              if you violate these Terms, create risks, or for other legitimate
              reasons. You may stop using the Service at any time and may delete
              your account/content (subject to technical backups and legal
              requirements).
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              12) Changes to the Service
            </h3>
            <p className='mb-4'>
              We may modify, suspend, or discontinue features at any time. For
              material changes, we will provide reasonable notice.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              13) Disclaimers
            </h3>
            <p className='mb-4'>
              THE SERVICE IS PROVIDED <strong>"AS IS"</strong> AND{' '}
              <strong>"AS AVAILABLE"</strong> WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON‑INFRINGEMENT.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              14) Limitation of Liability
            </h3>
            <p className='mb-4'>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAG AND ITS AFFILIATES
              SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE,
              OR CONSEQUENTIAL DAMAGES. OUR AGGREGATE LIABILITY FOR DIRECT
              DAMAGES SHALL NOT EXCEED THE GREATER OF <strong>USD $100</strong>{' '}
              OR THE AMOUNTS YOU PAID TO TAG FOR THE SERVICE IN THE{' '}
              <strong>12 MONTHS</strong> PRECEDING THE EVENT GIVING RISE TO
              LIABILITY.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              15) Indemnification
            </h3>
            <p className='mb-4'>
              You will indemnify and hold TAG, its officers, employees, and
              partners harmless from any claims, losses, liabilities, and
              expenses (including reasonable attorneys' fees) arising from your
              use of the Service, your User Content, or your breach of these
              Terms.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              16) Governing Law & Disputes
            </h3>
            <p className='mb-4'>
              These Terms are governed by the laws of{' '}
              <strong>State of Georgia, USA</strong>, without regard to conflict
              of laws. You consent to the exclusive jurisdiction of the courts
              located in <strong>Location</strong>.<br />
              <em>Optional:</em> an arbitration and class‑action waiver clause
              may be added upon legal review.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              17) Changes to Terms
            </h3>
            <p className='mb-4'>
              We may update these Terms from time to time. Changes are effective
              upon posting or as otherwise stated in the notice. Your continued
              use constitutes acceptance.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              18) Severability & Entire Agreement
            </h3>
            <p className='mb-4'>
              If any provision is found unenforceable, the remainder remains in
              effect. These Terms, together with the documents incorporated by
              reference, constitute the entire agreement between you and TAG.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              19) Contact
            </h3>
            <p className='mb-6'>
              <strong>Email:</strong> tag@rainwang.art
              <br />
              <strong>Address:</strong> 100 Town Center Dr. Apt 7402, Garden
              City， GA 31405
            </p>

            <hr className='my-6' />

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Annex — Community & Technical Guidelines (Summary)
            </h3>
            <p className='mb-2'>
              To allow faster iteration, we maintain detailed guidelines
              separately and reference them here:
            </p>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              <li>
                <strong>Upload Limits:</strong> ≤ 10 MB per file for
                images/short clips (see posted limits). Do not circumvent limits
                or security controls.
              </li>
              <li>
                <strong>Attribution & Provenance:</strong> disclose
                AI‑generated/AI‑assisted works and the licensing or sources of
                materials used where applicable.
              </li>
              <li>
                <strong>Abuse & Rate‑Limits:</strong> unusual traffic, mass
                sign‑ups, or suspicious engagement may be restricted.
              </li>
              <li>
                <strong>Appeals:</strong> content removals or account actions
                can be appealed within <strong>14 days</strong> via the Help
                Center.
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

export default TermsOfServiceModal;
