import React, { useState } from "react";
import BlockSelector from "./components/BlockSelector";
import QuestionList from "./components/QuestionList";
import Result from "./components/Result";
import ViewResults from "./components/ViewResults"; // Componente para el historial
import questions from "./questions.json";
import { supabase } from "./supabaseConfig"; // Configuración de Supabase

// Define el tipo de pregunta
interface Question {
  id: number;
  question: string;
  answer: string;
}

// Filtrar preguntas válidas (respuestas entre A-E)
const validAnswers = ["A", "B", "C", "D", "E"];
const filteredQuestions = questions.filter((q) => validAnswers.includes(q.answer));

const App: React.FC = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Controlar la vista del historial
  const [questionBlock, setQuestionBlock] = useState<string>(""); // Guardar el bloque de preguntas

  // Seleccionar un bloque de preguntas
  const handleSelectBlock = (start: number, end: number) => {
    const startIndex = start - 1; // Índice inicial (base 0)
    const endIndex = end; // Índice final exclusivo
    const newQuestions = filteredQuestions.slice(startIndex, endIndex);

    // Generar el bloque de preguntas
    const block = `${start}-${end}`;

    // Inicializar todas las respuestas como null
    const initialAnswers: { [key: number]: string | null } = {};
    newQuestions.forEach((q) => {
      initialAnswers[q.id] = null;
    });

    setSelectedQuestions(newQuestions);
    setAnswers(initialAnswers);
    setShowResults(false);
    setShowHistory(false);
    setQuestionBlock(block); // Guardar el bloque
  };

  // Manejar la selección de una respuesta
  const handleAnswer = (id: number, answer: string | null) => {
    setAnswers((prev) => {
      if (prev[id] === answer) {
        // Deseleccionar si el usuario hace clic en la misma respuesta
        return { ...prev, [id]: null };
      }
      return { ...prev, [id]: answer };
    });
  };

  // Calcular resultados según las reglas
  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    selectedQuestions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer === null) {
        unanswered++; // No afecta el puntaje
      } else if (userAnswer === q.answer) {
        correct++; // Respuesta correcta suma puntos
      } else {
        incorrect++; // Respuesta incorrecta cuenta
      }
    });

    // Penalización: Por cada 3 incorrectas, resta 1 punto
    let penalty = Math.floor(incorrect / 3);
    const score = correct - penalty; // Correctas menos penalización

    return { correct, incorrect, unanswered, score };
  };

  // Guardar resultados en Supabase
  const saveResultToSupabase = async (
    correct: number,
    incorrect: number,
    unanswered: number,
    score: number,
    block: string
  ) => {
    const result = {
      timestamp: new Date().toISOString(),
      correct,
      incorrect,
      unanswered,
      score,
      questionBlock: block,
    };

    try {
      const { data, error } = await supabase.from("results").insert([result]);
      if (error) {
        console.error("Error al guardar resultado en Supabase:", error.message);
      } else {
        console.log("Resultado guardado en Supabase:", data);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error al conectar con Supabase:", err.message);
      } else {
        console.error("Error desconocido al conectar con Supabase:", err);
      }
    }
  };

  // Manejar la finalización del examen
  const handleFinishExam = () => {
    const results = calculateResults();
    saveResultToSupabase(
      results.correct,
      results.incorrect,
      results.unanswered,
      results.score,
      questionBlock // Pasamos el bloque de preguntas
    );
    setShowResults(true);
  };

  // Navegar al historial
  const handleViewHistory = () => {
    setShowHistory(true);
    setShowResults(false);
  };

  // Volver al examen
  const handleBackToExam = () => {
    setShowHistory(false);
    setShowResults(false);
  };

  return (
    <div className="container mx-auto p-4">
      {!showHistory ? (
        <>
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
                    onClick={handleFinishExam}
                    className="bg-green-500 text-white p-2 rounded mt-4"
                  >
                    Finalizar Examen
                  </button>
                </>
              )}
              <button
                className="bg-blue-500 text-white p-2 rounded mt-4"
                onClick={handleViewHistory}
              >
                Ver Historial
              </button>
            </>
          ) : (
            <Result
              correct={calculateResults().correct}
              incorrect={calculateResults().incorrect}
              unanswered={calculateResults().unanswered}
              score={calculateResults().score}
              questions={selectedQuestions}
              answers={answers}
            />
          )}
        </>
      ) : (
        <>
          <ViewResults />
          <button
            className="bg-gray-500 text-white p-2 rounded mt-4"
            onClick={handleBackToExam}
          >
            Volver al Examen
          </button>
        </>
      )}
    </div>
  );
};

export default App;