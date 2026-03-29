import { useState, useCallback, useEffect } from 'react'

import { useExercisePaths } from '../hooks/useExercisePaths'
import { useLanguage } from '../hooks/useLanguage'
import { useCollapsible } from '../hooks/useCollapsible'
import { useQuizLoader } from '../hooks/useQuizLoader'
import { useProgress } from '../hooks/useProgress'
import type { QuizQuestion as QuizQuestionType } from '../types'

import styles from './QuizBlock.module.css'

interface QuizBlockProps {
  level: string
}

export function QuizBlock({ level }: QuizBlockProps) {
  const { getQuizPath } = useExercisePaths()
  const { t } = useLanguage()
  const { questions } = useQuizLoader(getQuizPath(level))
  const { isQuizComplete, setQuizComplete } = useProgress()
  const quizDone = isQuizComplete(level)
  const { isOpen, toggle } = useCollapsible({ initialState: false })
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set())

  const totalQuestions = questions?.length ?? 0

  const handleQuestionResult = useCallback((index: number, correct: boolean) => {
    setCorrectAnswers(prev => {
      const next = new Set(prev)
      if (correct) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (totalQuestions > 0 && correctAnswers.size === totalQuestions) {
      if (!quizDone) {
        setQuizComplete(level, true)
      }
    }
  }, [correctAnswers.size, totalQuestions, quizDone, setQuizComplete, level])

  if (!questions || questions.length === 0) {
    return null
  }

  const score = correctAnswers.size
  const headerSuffix = quizDone ? ` ✅ ${score}/${totalQuestions}` : score > 0 ? ` (${score}/${totalQuestions})` : ''

  return (
    <section className={styles.container}>
      <div
        className={`${styles.header} ${isOpen ? styles.headerOpen : styles.headerClosed}`}
        onClick={toggle}
      >
        <span className={styles.title}>{t('quiz.title')}{headerSuffix}</span>
        <span className={styles.icon}>{isOpen ? '🔼' : '🔽'}</span>
      </div>

      {isOpen && (
        <div className={styles.content}>
          {questions.map((q, i) => (
            <QuizQuestion
              key={i}
              question={q}
              index={i}
              onResult={handleQuestionResult}
            />
          ))}
        </div>
      )}
    </section>
  )
}

interface QuizQuestionProps {
  question: QuizQuestionType
  index: number
  onResult: (index: number, correct: boolean) => void
}

function QuizQuestion({ question, index, onResult }: QuizQuestionProps) {
  const { t } = useLanguage()
  const isSingle = question.type === 'single'
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null)
  const [checkedBoxes, setCheckedBoxes] = useState<Set<number>>(new Set())
  const [revealed, setRevealed] = useState(false)

  const correctIndices = new Set(
    question.options
      .map((opt, i) => (opt.correct ? i : -1))
      .filter(i => i !== -1)
  )

  const computeCorrect = (selected: number | null, checked: Set<number>) => {
    if (isSingle) {
      return selected !== null && correctIndices.has(selected)
    }
    return (
      checked.size === correctIndices.size &&
      [...checked].every(i => correctIndices.has(i))
    )
  }

  const handleRadioChange = useCallback((optionIndex: number) => {
    if (revealed) {
      setRevealed(false)
      onResult(index, false)
    }
    setSelectedRadio(optionIndex)
    setTimeout(() => {
      setRevealed(true)
      onResult(index, correctIndices.has(optionIndex))
    }, 0)
  }, [index, onResult, correctIndices, revealed])

  const handleCheckboxChange = useCallback((optionIndex: number) => {
    if (revealed) {
      setRevealed(false)
      onResult(index, false)
    }
    setCheckedBoxes(prev => {
      const next = new Set(prev)
      if (next.has(optionIndex)) {
        next.delete(optionIndex)
      } else {
        next.add(optionIndex)
      }
      return next
    })
  }, [revealed, index, onResult])

  const handleSubmitCheckbox = useCallback(() => {
    if (checkedBoxes.size > 0) {
      setRevealed(true)
      onResult(index, computeCorrect(null, checkedBoxes))
    }
  }, [checkedBoxes, index, onResult])

  const isAnswerCorrect = isSingle
    ? selectedRadio !== null && correctIndices.has(selectedRadio)
    : revealed && computeCorrect(null, checkedBoxes)

  return (
    <div className={styles.question}>
      <p className={styles.questionText}>
        <span className={styles.questionNumber}>{index + 1}.</span> {question.question}
      </p>
      <div className={styles.options}>
        {question.options.map((option, optIdx) => {
          const isSelected = isSingle
            ? selectedRadio === optIdx
            : checkedBoxes.has(optIdx)
          const showResult = revealed && isSelected

          let optionClass = styles.option
          if (revealed && isAnswerCorrect) {
            if (isSelected && option.correct) {
              optionClass += ` ${styles.optionCorrect}`
            }
          } else if (revealed && !isAnswerCorrect) {
            if (isSelected && !option.correct) {
              optionClass += ` ${styles.optionWrong}`
            } else if (option.correct && !isSelected) {
              optionClass += ` ${styles.optionWrong}`
            } else if (option.correct && isSelected) {
              optionClass += ` ${styles.optionCorrect}`
            }
          }

          return (
            <label key={optIdx} className={optionClass}>
              <input
                type={isSingle ? 'radio' : 'checkbox'}
                name={`quiz-q-${index}`}
                checked={isSelected}
                onChange={() =>
                  isSingle
                    ? handleRadioChange(optIdx)
                    : handleCheckboxChange(optIdx)
                }
                className={styles.input}
              />
              <span className={styles.optionText}>{option.text}</span>
              {revealed && !isAnswerCorrect && !option.correct && option.explanation && (
                <span className={styles.explanation}>{option.explanation}</span>
              )}
            </label>
          )
        })}
      </div>

      {!isSingle && !revealed && (
        <button
          className={styles.submitButton}
          onClick={handleSubmitCheckbox}
          disabled={checkedBoxes.size === 0}
        >
          {t('quiz.submit')}
        </button>
      )}

      {revealed && (
        <div
          className={
            isAnswerCorrect ? styles.resultCorrect : styles.resultWrong
          }
        >
          {isAnswerCorrect ? t('quiz.correct') : t('quiz.wrong')}
        </div>
      )}
    </div>
  )
}
