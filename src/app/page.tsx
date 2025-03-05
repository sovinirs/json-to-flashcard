"use client";

import React, { useState, useEffect } from "react";
import FlashCard from "./components/FlashCard";
import type { Questions, Question } from "./types";

export default function Home() {
  const [questions, setQuestions] = useState<Questions | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionQueue, setQuestionQueue] = useState<number[]>([]);

  useEffect(() => {
    localStorage.removeItem("incorrectQuestions");

    const loadQuestions = async () => {
      try {
        const response = await fetch("/data/questions.json");
        const data = await response.json();
        setQuestions(data);

        // Initialize question queue with sequential indices
        const indices = Array.from(
          { length: data.questions.length },
          (_, i) => i
        );
        setQuestionQueue(indices);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleNext = () => {
    if (!questions) return;

    // Get incorrect question IDs from localStorage
    const incorrectQuestions = JSON.parse(
      localStorage.getItem("incorrectQuestions") || "[]"
    );

    // Remove current question from queue
    const newQueue = [...questionQueue];
    newQueue.shift();

    // If we're running low on questions, check if we need to add incorrect ones
    if (newQueue.length < 3) {
      // Find indices of incorrect questions
      const incorrectIndices = questions.questions
        .map((q, index) => (incorrectQuestions.includes(q.id) ? index : -1))
        .filter((index) => index !== -1);

      // Add incorrect questions that aren't already in the queue
      incorrectIndices.forEach((index) => {
        if (!newQueue.includes(index)) {
          newQueue.push(index);
        }
      });
    }

    // If queue is empty, we're done
    if (newQueue.length === 0) {
      // You could handle completion here
      alert("You've completed all questions!");
      return;
    }

    setQuestionQueue(newQueue);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (!questions || questionQueue.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading questions</div>
      </div>
    );
  }

  const currentQuestionIndex = questionQueue[0];
  const currentQuestion = questions.questions[currentQuestionIndex];
  const progress = questions.questions.length - questionQueue.length + 1;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <FlashCard
          question={currentQuestion}
          onNext={handleNext}
          totalQuestions={questions.questions.length}
          currentIndex={progress - 1}
        />
      </div>
    </main>
  );
}
