import React from "react";
import { supabase } from "../supabaseConfig";
import ScoreBarChart from "./ScoreBarChart";

interface Result {
  timestamp: string;
  questionBlock: string;
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
}

const ViewResults: React.FC = () => {
  const [results, setResults] = React.useState<Result[]>([]);
  const [groupedResults, setGroupedResults] = React.useState<{
    [key: string]: Result[];
  }>({});

  React.useEffect(() => {
    const fetchResultsFromSupabase = async () => {
      try {
        const { data, error } = await supabase.from("results").select("*");
        if (error) {
          console.error("Error al obtener resultados:", error);
        } else {
          const fetchedResults = (data || []) as Result[];
          setResults(fetchedResults);

          // Agrupar resultados por bloque de preguntas
          const grouped = fetchedResults.reduce((acc, result) => {
            const block = result.questionBlock;
            if (!acc[block]) {
              acc[block] = [];
            }
            acc[block].push(result);
            return acc;
          }, {} as { [key: string]: Result[] });

          setGroupedResults(grouped);
        }
      } catch (err) {
        console.error("Error al conectar con Supabase:", err);
      }
    };

    fetchResultsFromSupabase();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historial de Resultados por Bloque</h2>

      {Object.keys(groupedResults).length === 0 ? (
        <p>No hay resultados almacenados aún.</p>
      ) : (
        Object.keys(groupedResults).map((block) => {
          const blockResults = groupedResults[block];

          // Calcular estadísticas para este bloque
          const totalCorrect = blockResults.reduce((sum, r) => sum + r.correct, 0);
          const totalIncorrect = blockResults.reduce((sum, r) => sum + r.incorrect, 0);
          const totalUnanswered = blockResults.reduce((sum, r) => sum + r.unanswered, 0);
          const averageScore =
            blockResults.reduce((sum, r) => sum + r.score, 0) / blockResults.length;

          return (
            <div key={block} className="mb-8">
              <h3 className="text-lg font-bold mb-4">Bloque: {block}</h3>

              {/* Resumen del bloque */}
              <div className="mb-4">
                <p>
                  <b>Total de Aciertos:</b> {totalCorrect}
                </p>
                <p>
                  <b>Total de Incorrectas:</b> {totalIncorrect}
                </p>
                <p>
                  <b>Total Sin Responder:</b> {totalUnanswered}
                </p>
                <p>
                  <b>Puntaje Promedio:</b> {averageScore.toFixed(2)}
                </p>
              </div>

              {/* Gráfico de Barras para este bloque */}
              <ScoreBarChart results={blockResults} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewResults;