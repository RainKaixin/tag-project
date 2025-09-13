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
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8'>
            Student Competitions 2025
          </h2>

          <button
            onClick={handleJoinNowClick}
            className='bg-black text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-tag-blue transition-colors duration-200'
          >
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
