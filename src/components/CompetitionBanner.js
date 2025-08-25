import React, { useState } from 'react';

import Modal from './Modal/Modal';

const CompetitionBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinNowClick = e => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGoToCompetition = () => {
    window.location.href = '/tagme/co-future-2025';
  };

  return (
    <>
      <section className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-tag-blue mb-6'>
            Student Competitions 2025
          </h2>

          <p className='text-lg md:text-xl text-tag-blue mb-8 max-w-2xl mx-auto leading-relaxed opacity-90'>
            Participate in exciting design challenges and win recognition from
            industry professionals.
          </p>

          <button
            onClick={handleJoinNowClick}
            className='bg-tag-blue text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-tag-dark-blue transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center'
          >
            <svg
              className='w-6 h-6 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            Join Now
          </button>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGoToCompetition={handleGoToCompetition}
      />
    </>
  );
};

export default CompetitionBanner;
