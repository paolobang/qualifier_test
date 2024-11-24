import React from 'react';

interface Question {
  id: number;
  question: string;
}

interface QuestionListProps {
  questions: Question[];
  onAnswer: (id: number, answer: string | null) => void;
  answers: { [key: number]: string | null };
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onAnswer, answers }) => {
  const validOptions = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-4">
        {questions.map((q) => (
          <div key={q.id} className="p-4 bg-gray-100 rounded shadow">
            <p className="font-bold mb-2">Pregunta {q.id}</p>
            <div className="flex gap-2 flex-wrap">
              {validOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onAnswer(q.id, answers[q.id] === option ? null : option)}
                  className={`p-2 w-full rounded ${
                    answers[q.id] === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;