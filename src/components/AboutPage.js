import React, { useState } from 'react';

import { supabase } from '../services/supabase/client';

const AboutPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubscribe = async e => {
    e.preventDefault();

    // 前端邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()) || email.trim().length >= 254) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const { data, error } = await supabase.functions.invoke('subscribe', {
        body: { email: email.trim(), source: 'about_page' },
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');
        setEmail(''); // 清空输入框
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Top Section (reduced gaps) */}
      <section className='pt-12 pb-6 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            About TAG (Tech Art Guide)
          </h1>
        </div>
      </section>

      {/* About TAG Section - Blue Theme (pulled upward) */}
      <section className='pt-8 pb-16 bg-gradient-to-br from-blue-50 to-blue-100'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <p className='text-lg leading-relaxed mb-4'>
              TAG is an online platform that connects all students from all
              majors and departments. Our shared vision is to build a platform—a
              bridge—that brings together students across the entire college.
              The reason I wanted to do this is that, in many ways, popular
              sites like ArtStation, Behance, and LinkedIn are not always
              friendly to entry-level students. So why not build an online
              platform that truly belongs to us? A platform where we can
              showcase our works, discover talents around us, and look for
              collaboration opportunities. If we do so, we could create our own
              student-driven art market!
            </p>
            <p className='text-lg leading-relaxed mb-4'>To put it simply:</p>
            <p className='text-lg leading-relaxed mb-0'>
              This platform has two main purposes – one for increasing job
              visibility by uploading (TAG), and one for finding collaborators
              and experiences by doing (TAG Me). One helps build experience; the
              other helps get hired.
            </p>
          </div>

          {/* IMPORTANT Notice - Independent in blue section */}
          <div className='bg-white rounded-lg p-8 border-l-4 border-purple-500 mt-8 shadow-lg'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>IMPORTANT</h3>
            <p className='text-lg leading-relaxed text-gray-700'>
              At the current stage, all the{' '}
              <span className='text-blue-600 font-semibold'>
                Gallery features (blue)
              </span>{' '}
              of TAG have been completed, while the{' '}
              <span className='text-purple-600 font-semibold'>
                Collaboration system (purple)
              </span>{' '}
              is still under testing and development. I will do my best to bring
              those functions to life in the following weeks.
            </p>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
            The Story & TAG Vision
          </h2>
          {/* 段落容器（保留 space-y-4） */}
          <div className='space-y-4'>
            <p className='text-lg leading-relaxed'>
              Since my very first week in this college, I have been thinking
              about identifying pain points and solving real demands, because I
              know this is probably the last chance, as a student, to build
              something truly meaningful.
            </p>
            <p className='text-lg leading-relaxed'>
              I personally believe that people's behaviors are always driven by
              the environment. Here, we have thousands of students and over a
              hundred majors, and each of us carries a unique spirit and passion
              for creation. Yet if we do not have the chance to see each other's
              works, to witness these differences, I feel it would be a regret.
              But if we can see more, connect more, and find more real
              collaboration opportunities right now, right here—wouldn't that be
              the most exciting thing?
            </p>
            <p className='text-lg leading-relaxed'>
              Honestly, this has been extremely challenging for me. I have been
              planning this for months, doing extensive research, and investing
              a huge amount of time. Sometimes it took me an entire week and I
              still could not figure out a single function, and I had to take
              alternative paths to balance the site's features. Even now, I
              still feel there are so many features I wish I had time to
              implement, so many designs I wish I could refine, and so many
              needs I cannot yet fulfill. The work ahead seems 'infinite'...
            </p>
            <p className='text-lg leading-relaxed'>
              Here, I sincerely hope you can be one of the people who share this
              vision with me. If every artist has their own personal spirit,
              then being a TAG Member means carrying that spirit to the world.
              In this environment with ten thousand students, the true value of
              a college is not about "ten thousand techniques," but "ten
              thousand personalities." Only we can tag ourselves, and let our
              personalities shape a platform that belongs to us all.
            </p>
          </div>

          {/* 签名块容器（不再受 space-y 影响） */}
          <div className='text-center mt-24'>
            <p className='text-lg font-semibold text-gray-900 mb-4'>
              Excited to have you join TAG.
            </p>
            <p className='text-base text-gray-600 mt-8'>
              Best,
              <br />
              Rain Wang
              <br />
              <span className='text-purple-600 font-semibold'>
                Founder of TAG
              </span>
            </p>
            <p className='text-base text-gray-600 mt-4'>
              Contact:{' '}
              <a
                href='mailto:tag@rainwang.art'
                className='text-purple-600 underline hover:text-purple-700 transition-colors duration-200'
              >
                tag@rainwang.art
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Section - Subscribe */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Divider */}
          <div className='border-t border-gray-300 mb-12' />

          {/* Subscribe Form (tighter title/subtitle gap) */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold text-gray-900 mb-2 text-center'>
              Stay Connected with TAG
            </h3>
            <p className='text-base text-gray-600 mb-9 text-center'>
              to get the latest updates and new feature releases.
            </p>

            <form onSubmit={handleSubscribe} className='max-w-md mx-auto'>
              {/* 消息显示 */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-md text-center ${
                    messageType === 'success'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className='mb-4'>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-lg transform ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              <p className='text-sm text-gray-600 mt-3 text-center'>
                We encourage your other emails (e.g. Gmail, Outlook). Note:
                SCAD.EDU accounts may sometimes filter messages into junk mail.
                We’ll never share your information.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
