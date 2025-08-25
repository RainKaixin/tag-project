
const FinalComments = ({ comments = [] }) => {
  const getSentimentColor = sentiment => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'constructive':
        return 'bg-yellow-100 text-yellow-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (comments.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>No final comments yet</p>
        <p className='text-sm text-gray-400 mt-2'>
          Final, qualitative comments from teammates after project completion.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>Final Comments</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Final, qualitative comments from teammates after project completion.
        </p>
      </div>

      <div className='space-y-4'>
        {comments.map(comment => (
          <div key={comment.id} className='bg-gray-50 rounded-lg p-4'>
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-medium text-purple-700'>
                    {comment.authorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className='font-medium text-gray-900'>
                    {comment.authorName}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {comment.authorRole}
                  </div>
                </div>
              </div>
              {comment.sentiment && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(
                    comment.sentiment
                  )}`}
                >
                  {comment.sentiment.charAt(0).toUpperCase() +
                    comment.sentiment.slice(1)}
                </span>
              )}
            </div>

            <div className='text-gray-700 leading-relaxed mb-3'>
              {comment.text}
            </div>

            <div className='text-xs text-gray-500'>
              {formatDate(comment.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalComments;






















