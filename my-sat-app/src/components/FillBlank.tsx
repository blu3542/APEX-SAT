// in FillBlank.tsx

interface FillBlankProps {
  questionId: number;
  value: string;
  onAnswerChange: (questionId: number, answer: string) => void;
}

const FillBlank: React.FC<FillBlankProps> = ({
  questionId,
  value,
  onAnswerChange,
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={`fillblank-${questionId}`} className="font-medium">
      Your Answer:
    </label>
    <input
      id={`fillblank-${questionId}`}
      type="text"
      value={value}
      onChange={(e) => {
        // e: ChangeEvent<HTMLInputElement>
        onAnswerChange(questionId, e.target.value);
      }}
      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      placeholder="Type your answer..."
    />
  </div>
);

export default FillBlank;
