import React, { useState, useEffect } from 'react';

import {
  getProjectReviewRequests as getReviewRequests,
  sendReviewRequest,
  createFinalComment,
  getProjectFinalComments as getFinalComments,
} from '../services/mock/reviewRequestService.js';

import FinalCommentModal from './FinalCommentModal';
import FinalComments from './FinalComments';
import ProjectVision from './ProjectVision';

const RightOwnerPanel = ({ project, owner, currentUser, eligibility }) => {
  const [reviewRequests, setReviewRequests] = useState([]);
  const [finalComments, setFinalComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState('SIGN_IN');

  // Mock current user for demo
  const mockCurrentUser = currentUser || { id: 'user-1', name: 'Current User' };
  const mockEligibility = eligibility || { isMemberCompleted: true };

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    try {
      const [requests, comments] = await Promise.all([
        getReviewRequests(project.id),
        getFinalComments(project.id),
      ]);
      setReviewRequests(requests);
      setFinalComments(comments);
      updateButtonState(requests, comments);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateButtonState = (requests, comments) => {
    if (!mockCurrentUser) {
      setButtonState('SIGN_IN');
      return;
    }

    if (!mockEligibility.isMemberCompleted) {
      setButtonState('DISABLED');
      return;
    }

    const userRequest = requests.find(
      req => req.requesterId === mockCurrentUser.id
    );
    const userComment = comments.find(
      comment => comment.authorId === mockCurrentUser.id
    );

    if (userComment) {
      setButtonState('SUBMITTED');
    } else if (userRequest?.status === 'approved') {
      setButtonState('WRITE_COMMENT');
    } else if (userRequest?.status === 'pending') {
      setButtonState('PENDING');
    } else {
      setButtonState('SEND_REQUEST');
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      await sendReviewRequest(project.id, mockCurrentUser.id);
      await loadData(); // Reload to update button state
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async commentText => {
    setIsLoading(true);
    try {
      await createFinalComment(project.id, {
        authorId: mockCurrentUser.id,
        authorName: mockCurrentUser.name,
        authorRole: 'Member',
        text: commentText,
        sentiment: 'positive', // Default sentiment
      });
      await loadData(); // Reload to update comments and button state
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    const baseClasses =
      'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200';

    switch (buttonState) {
      case 'SIGN_IN':
        return (
          <button
            className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
            onClick={() => (window.location.href = '/login')}
          >
            Sign in to request review
          </button>
        );

      case 'DISABLED':
        return (
          <button
            className={`${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`}
            disabled
            title='Only completed members can request to comment.'
          >
            Request Review
          </button>
        );

      case 'SEND_REQUEST':
        return (
          <button
            className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
            onClick={handleSendRequest}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send a Request'}
          </button>
        );

      case 'PENDING':
        return (
          <button
            className={`${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`}
            disabled
            title='Waiting for owner approval'
          >
            Pending Approval
          </button>
        );

      case 'WRITE_COMMENT':
        return (
          <button
            className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
            onClick={() => setIsModalOpen(true)}
          >
            Write Final Comment
          </button>
        );

      case 'SUBMITTED':
        return (
          <button
            className={`${baseClasses} bg-green-100 text-green-800 cursor-not-allowed`}
            disabled
          >
            Submitted
          </button>
        );

      default:
        return null;
    }
  };

  const isProjectCompleted = project.status === 'completed';

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full overflow-auto'>
      {isProjectCompleted ? (
        <FinalComments comments={finalComments} />
      ) : (
        <ProjectVision vision={project.vision} owner={owner} />
      )}

      {/* Action Button */}
      {isProjectCompleted && (
        <div className='mt-6 pt-4 border-t border-gray-200'>
          {renderButton()}
        </div>
      )}

      {/* Modal */}
      <FinalCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitComment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RightOwnerPanel;
