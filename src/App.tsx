import React, { useState } from 'react';
import BlockSelector from './components/BlockSelector';
import QuestionList from './components/QuestionList';
import Result from './components/Result';
import questions from './questions.json';

// Define el tipo de pregunta
interface Question {
  id: number;
  question: string;
  answer: string;
}

// Filtrar preguntas válidas (respuestas entre A-D, E)
const validAnswers = ['A', 'B', 'C', 'D', 'E'];
const filteredQuestions = questions.filter((q) => validAnswers.includes(q.answer));

const App: React.FC = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectBlock = (start: number, end: number) => {
    const startIndex = start - 1; // Índice inicial (base 0)
    const endIndex = end; // Índice final exclusivo
    const newQuestions = filteredQuestions.slice(startIndex, endIndex);
  
    // Inicializar todas las respuestas como null
    const initialAnswers: { [key: number]: string | null } = {};
    newQuestions.forEach((q) => {
      initialAnswers[q.id] = null;
    });
  
    setSelectedQuestions(newQuestions);
    setAnswers(initialAnswers); // Inicializa las respuestas con null
    setShowResults(false);
  };

  const handleAnswer = (id: number, answer: string | null) => {
    setAnswers((prev) => {
      if (prev[id] === answer) {
        // Deseleccionar si el usuario hace clic en la misma respuesta
        return { ...prev, [id]: null };
      }
      return { ...prev, [id]: answer };
    });
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
  
    selectedQuestions.forEach((q) => {
      const userAnswer = answers[q.id];
  
      if (userAnswer === null) {
        // Incrementa solo el contador de respuestas no respondidas
        unanswered++;
      } else if (userAnswer === q.answer) {
        // Incrementa las respuestas correctas
        correct++;
      } else {
        // Incrementa solo las respuestas incorrectas seleccionadas
        incorrect++;
      }
    });
  
    // Calcula el puntaje con correctas e incorrectas seleccionadas
    const score = correct * 3 - incorrect;
  
    return { correct, incorrect, unanswered, score };
  };

  const results = calculateResults(); // Calcula los resultados

  return (
    <div className="container mx-auto p-4">
      {!showResults ? (
        <>
          <BlockSelector onSelect={handleSelectBlock} />
          {selectedQuestions.length > 0 && (
            <>
              <QuestionList
                questions={selectedQuestions}
                onAnswer={handleAnswer}
                answers={answers}
              />
              <button
                onClick={() => setShowResults(true)}
                className="bg-green-500 text-white p-2 rounded mt-4"
              >
                Calificar
              </button>
            </>
          )}
        </>
      ) : (
        <Result
          correct={results.correct}
          incorrect={results.incorrect}
          unanswered={results.unanswered}
          score={results.score} // Pasamos la propiedad score
          questions={selectedQuestions}
          answers={answers}
        />
      )}
    </div>
  );
};

export default App;