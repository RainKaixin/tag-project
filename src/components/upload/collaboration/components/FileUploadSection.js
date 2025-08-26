const FileUploadSection = ({ onFileUpload, posterPreview }) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Recruitment Poster
      </label>

      {posterPreview ? (
        // 显示已上传的图片预览
        <div className='border-2 border-dashed border-gray-300 rounded-lg bg-white p-4'>
          <div className='relative'>
            <img
              src={posterPreview}
              alt='Recruitment Poster Preview'
              className='w-full h-48 object-cover rounded-lg'
            />
            <button
              type='button'
              onClick={() => {
                // 清除文件输入
                const fileInput = document.getElementById(
                  'recruitment-poster-upload'
                );
                if (fileInput) {
                  fileInput.value = '';
                }
                // 触发重新上传
                onFileUpload({ target: { files: [] } });
              }}
              className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors'
            >
              ×
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-2 text-center'>
            Click the × button to remove and upload a new image
          </p>
        </div>
      ) : (
        // 显示上传界面
        <div className='border-2 border-dashed border-gray-300 rounded-lg bg-white py-6 px-4 text-center'>
          <svg
            className='w-8 h-8 text-gray-400 mx-auto mb-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='text-gray-600 mb-2'>Upload recruitment poster</p>
          <p className='text-xs text-gray-400 mb-4'>
            JPG, PNG (Max 5MB) - Only one image allowed
          </p>
          <input
            type='file'
            accept='.jpg,.jpeg,.png'
            onChange={onFileUpload}
            multiple={false}
            className='hidden'
            id='recruitment-poster-upload'
          />
          <label
            htmlFor='recruitment-poster-upload'
            className='bg-tag-purple text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-700 transition-colors duration-200'
          >
            Choose Image
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
