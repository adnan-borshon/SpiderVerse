import React, { useState, useEffect } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { QUIZ_QUESTIONS, STAGE2_QUIZ_QUESTIONS, STAGE3_QUIZ_QUESTIONS } from '@/lib/gameConstants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Quiz: React.FC = () => {
  const { quizActive, setQuizActive, answerQuizQuestion, questionsAnswered, phase, setPhase } = useFarmGame();
  
  // Select appropriate quiz questions based on phase
  const questions = phase === 'stage3' ? STAGE3_QUIZ_QUESTIONS : 
                   phase === 'stage2' ? STAGE2_QUIZ_QUESTIONS : QUIZ_QUESTIONS;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Reset quiz UI when quiz becomes active or when switching stages
  useEffect(() => {
    if (quizActive) {
      setCurrentQuestion(questionsAnswered);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [quizActive]);
  
  if (!quizActive) return null;
  
  const question = questions[currentQuestion];
  
  // Safety check - if question doesn't exist, close quiz
  if (!question) {
    setQuizActive(false);
    return null;
  }
  
  const quizTitle = phase === 'stage3' ? 'Flood Forecasting Knowledge Check' :
                   phase === 'stage2' ? 'MODIS & NDVI Knowledge Check' : 'SMAP Knowledge Check';
  
  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    answerQuizQuestion(correct);
  };
  
  const handleNext = () => {
    // Check if there's a next question
    if (currentQuestion + 1 >= questions.length) {
      // Quiz completed - close it
      setQuizActive(false);
      
      // Don't advance phases here - let App.tsx handle it via the buttons
      // This ensures proper counter reset and state management
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 pointer-events-auto">
      <Card className="max-w-2xl w-full mx-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl">
            🎓 {quizTitle}
          </CardTitle>
          <p className="text-sm text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-950/50 p-4 rounded-lg">
            <p className="text-lg font-semibold mb-4">{question.question}</p>
            
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                    showExplanation
                      ? index === question.correctIndex
                        ? 'border-green-500 bg-green-500/30'
                        : selectedAnswer === index
                        ? 'border-red-500 bg-red-500/30'
                        : 'border-gray-600 bg-gray-800/30'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showExplanation && index === question.correctIndex
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-500'
                    }`}>
                      {showExplanation && index === question.correctIndex && '✓'}
                      {showExplanation && selectedAnswer === index && index !== question.correctIndex && '✗'}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {showExplanation && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              <p className="font-semibold mb-2">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm text-gray-200">{question.explanation}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            {showExplanation && (
              <Button className="w-full" onClick={handleNext}>
                {questionsAnswered >= questions.length - 1 ? 'Continue to Farm' : 'Next Question'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
