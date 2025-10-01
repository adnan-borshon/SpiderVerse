import React, { useState, useEffect } from 'react';
import { useFarmGame } from '@/lib/stores/useFarmGame';
import { QUIZ_QUESTIONS } from '@/lib/gameConstants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Quiz: React.FC = () => {
  const { quizActive, setQuizActive, answerQuizQuestion, questionsAnswered } = useFarmGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  useEffect(() => {
    if (quizActive && questionsAnswered < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(questionsAnswered);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [quizActive, questionsAnswered]);
  
  if (!quizActive) return null;
  
  const question = QUIZ_QUESTIONS[currentQuestion];
  
  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    answerQuizQuestion(correct);
  };
  
  const handleNext = () => {
    if (questionsAnswered >= QUIZ_QUESTIONS.length - 1) {
      setQuizActive(false);
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
            🎓 SMAP Knowledge Check
          </CardTitle>
          <p className="text-sm text-gray-300">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-950/50 p-4 rounded-lg">
            <p className="text-lg font-semibold mb-4">{question.question}</p>
            
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                    showExplanation
                      ? index === question.correctIndex
                        ? 'border-green-500 bg-green-500/30'
                        : selectedAnswer === index
                        ? 'border-red-500 bg-red-500/30'
                        : 'border-gray-600 bg-gray-800/30'
                      : selectedAnswer === index
                      ? 'border-yellow-500 bg-yellow-500/30'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showExplanation && index === question.correctIndex
                        ? 'border-green-500 bg-green-500'
                        : selectedAnswer === index
                        ? 'border-yellow-500 bg-yellow-500'
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
            {!showExplanation ? (
              <Button
                className="w-full"
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button className="w-full" onClick={handleNext}>
                {questionsAnswered >= QUIZ_QUESTIONS.length - 1 ? 'Continue to Farm' : 'Next Question'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
