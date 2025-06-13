import React from "react";

interface QuestionHeaderProps {
  questionNumber: number;
  isMarkedForReview: boolean;
  onToggleMarkForReview: () => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  questionNumber,
  isMarkedForReview,
  onToggleMarkForReview,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-black text-white font-semibold rounded-md text-lg">
          {questionNumber}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="markForReview"
            className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
            checked={isMarkedForReview}
            onChange={onToggleMarkForReview}
          />
          <label
            htmlFor="markForReview"
            className="flex items-center text-gray-700 font-medium cursor-pointer select-none"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Mark For Review</span>
            <span className="sm:hidden">Mark</span>
          </label>
        </div>
      </div>
      <button className="self-start sm:self-auto p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuestionHeader;
