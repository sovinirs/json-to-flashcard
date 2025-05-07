"use client";

import React, { useState, useEffect } from "react";
import FlashCard from "./components/FlashCard";
import type { Questions } from "./types";

export default function Home() {
  const [questions, setQuestions] = useState<Questions | null>(null);
  const [loading, setLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState<Questions | null>(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Questions | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/data/questions.json");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data: Questions = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
        // Optionally, set an error state here to display to the user
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading questions</div>
      </div>
    );
  }

  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      const questionsArray = questions.questions;

      questionsArray.shift();

      setQuestions({
        questions: questionsArray,
      });
    } else {
      setQuestions({
        questions: [...questions.questions],
      });
      setCorrectAnswers(null);
      setIncorrectAnswers(null);
      setCurrentQuestionIndex(0);
    }
  };

  const currentQuestion = questions.questions[currentQuestionIndex];
  const progress = currentQuestionIndex + 1;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <FlashCard
          question={currentQuestion}
          onNext={handleNext}
          totalQuestions={questions.questions.length}
          currentIndex={progress - 1}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          setCorrectAnswers={setCorrectAnswers}
          setIncorrectAnswers={setIncorrectAnswers}
        />
      </div>
    </main>
  );
}
