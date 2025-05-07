"use client";

import React, { useState } from "react";
import { Question, Questions } from "../types";

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  totalQuestions: number;
  currentIndex: number;
  correctAnswers: Questions | null;
  incorrectAnswers: Questions | null;
  setCorrectAnswers: (answers: Questions) => void;
  setIncorrectAnswers: (answers: Questions) => void;
}

export default function FlashCard({
  question,
  onNext,
  correctAnswers,
  incorrectAnswers,
  setCorrectAnswers,
  setIncorrectAnswers,
}: FlashCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerClick = (option: string) => {
    setSelectedAnswer(option);
    setShowAnswer(true);
    const isCorrect = option === question.correct_answer;

    if (isCorrect) {
      setCorrectAnswers({
        questions: [...(correctAnswers?.questions || []), question],
      });
    } else {
      setIncorrectAnswers({
        questions: [...(incorrectAnswers?.questions || []), question],
      });
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    onNext();
  };

  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4 text-sm text-gray-600">
        Correctly answered: {correctAnswers?.questions.length || 0}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

        <div className="space-y-3">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerClick(key)}
              disabled={showAnswer}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                showAnswer
                  ? key === question.correct_answer
                    ? "bg-green-100 border-green-500"
                    : key === selectedAnswer
                    ? "bg-red-100 border-red-500"
                    : "bg-gray-50"
                  : "bg-gray-50 hover:bg-gray-100"
              } border ${
                showAnswer &&
                (key === question.correct_answer || key === selectedAnswer)
                  ? "border-2"
                  : "border"
              }`}
            >
              <span className="font-medium">{key}:</span> {value}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Incorrect. Try again!"}
            </div>
            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
