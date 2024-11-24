import React from 'react';

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface ResultProps {
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  questions: Question[];
  answers: { [key: number]: string | null };
}

const Result: React.FC<ResultProps> = ({
  correct,
  incorrect,
  unanswered,
  score,
  questions,
  answers,
}) => {
  const correctQuestions = questions.filter((q) => answers[q.id] === q.answer);
  const wrongQuestions = questions.filter(
    (q) => answers[q.id] !== q.answer && answers[q.id] !== null
  );
  const unansweredQuestions = questions.filter((q) => answers[q.id] === null);

  console.log('Answers:', answers);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resultados</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold">Puntaje Final</h3>
        <p className="text-2xl font-bold">
          <span
            className={`${
              score >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {score}
          </span>
        </p>
      </div>
      <br />
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-green-700">✅ Correctas: {correct}</h3>
          <ul className="list-disc pl-6">
            {correctQuestions.map((q) => (
              <li key={q.id}>
                <span className="font-bold">P{q.id}:</span> 
                <span className="text-green-500"> {answers[q.id]}</span>
                <span className="text-gray-500"> - {q.answer}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-red-700">❌ Incorrectas: {incorrect}</h3>
          <ul className="list-disc pl-6">
            {wrongQuestions.map((q) => (
              <li key={q.id}>
                <span className="font-bold">P{q.id}:</span> 
                <span className="text-red-500"> {answers[q.id]}</span>
                <span className="text-gray-500"> - {q.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded shadow mt-4">
        <h3 className="text-lg font-bold text-yellow-700">⚠️ Sin Responder: {unanswered}</h3>
        <ul className="list-disc pl-6">
          {unansweredQuestions.map((q) => (
            <li key={q.id}>
              <span className="font-bold">P{q.id}:</span> 
              <span className="text-gray-500"> N/A</span>
              <span className="text-gray-500"> - {q.answer}</span>
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};

export default Result;