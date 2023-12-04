import React, { useState, useEffect } from 'react';
import '../style/QuizComponent.css';
import { FaFlag } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizComponent = ({ questions, handleAnswerSubmit }) => {
    const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers')) || Array(questions.length).fill([]);
    const savedCurrentIndex = parseInt(localStorage.getItem('currentQuestionIndex')) || 0;
    const savedMarkedQuestions = JSON.parse(localStorage.getItem('markedQuestions')) || [];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedCurrentIndex);
    const [selectedAnswers, setSelectedAnswers] = useState(savedSelectedAnswers);
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const [showMarkedQuestions, setShowMarkedQuestions] = useState(false);
    const [markedQuestions, setMarkedQuestions] = useState(savedMarkedQuestions);

    const handleAnswerSelect = (option) => {
        const updatedAnswers = [...selectedAnswers];

        if (questions[currentQuestionIndex].type === 'singleChoice') {
            updatedAnswers.splice(currentQuestionIndex, 1, [option]);
        } else {
            const currentSelectedAnswers = updatedAnswers[currentQuestionIndex];
            const limit = currentQuestion.limit || Number.MAX_SAFE_INTEGER;

            if (currentSelectedAnswers.includes(option)) {
                const newSelectedAnswers = currentSelectedAnswers.filter((ans) => ans !== option);
                updatedAnswers[currentQuestionIndex] = newSelectedAnswers;
            } else if (currentSelectedAnswers.length < limit) {
                updatedAnswers[currentQuestionIndex] = [...currentSelectedAnswers, option];
            }
        }

        setSelectedAnswers(updatedAnswers);
    };


    useEffect(() => {
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
        localStorage.setItem('currentQuestionIndex', JSON.stringify(currentQuestionIndex));
        localStorage.setItem('markedQuestions', JSON.stringify(markedQuestions));
    }, [selectedAnswers, currentQuestionIndex, markedQuestions]);

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        const unansweredQuestions = selectedAnswers.filter((answers) => answers.length === 0);
        if (unansweredQuestions.length === 0) {
            const answersToSubmit = selectedAnswers.map((answers, index) => ({
                question: questions[index],
                answers: answers,
            }));
            handleAnswerSubmit(answersToSubmit);
        } else {
            const confirmation = window.confirm("You haven't answered all questions. Do you still want to submit?");
            if (confirmation) {
                const answersToSubmit = selectedAnswers.map((answers, index) => ({
                    question: questions[index],
                    answers: answers,
                }));
                handleAnswerSubmit(answersToSubmit);
            }
        }
    };
    const handleGoToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setShowAllQuestions(false);
    };

    const handleGoToQuestionWhichIsMarked = (index) => {
        setCurrentQuestionIndex(index);
        setShowMarkedQuestions(false);
    };

    const toggleAllQuestions = () => {
        setShowAllQuestions(!showAllQuestions);
    };

    const toggleAllMarked = () => {
        if (markedQuestions.length === 0) {
            toast.info("There is not marked question")
            return;
        }
        setShowMarkedQuestions(!showMarkedQuestions)
    };

    const toggleMarkQuestion = () => {
        if (markedQuestions.includes(currentQuestionIndex)) {
            setMarkedQuestions(markedQuestions.filter((index) => index !== currentQuestionIndex));
        } else {
            setMarkedQuestions([...markedQuestions, currentQuestionIndex]);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    return (
        <div className="quiz" style={{ height: markedQuestions.length > 0 && `50vh+ ${markedQuestions.length * 5}`, 'position': "relative" }}>
            <div className='show-all-questions'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button className={showAllQuestions || showMarkedQuestions ? 'hide' : ''} onClick={toggleMarkQuestion}>
                        <FaFlag
                            className={markedQuestions.includes(currentQuestionIndex) ? 'flag-icon-marked' : 'flag-icon'}
                        />
                    </button>

                    <div style={{ width: "38%" }} className={showAllQuestions || showMarkedQuestions ? 'hide' : ''}>
                        {questions?.length > 0 && (
                            <p style={{ margin: "0", textAlign: "right", width: "100%", fontWeight: "bold", fontSize: "16px" }}>Question {currentQuestionIndex + 1} of {questions.length}</p>
                        )}
                    </div>
                    <div>
                        <button className={showAllQuestions ? 'hide' : ''} onClick={toggleAllMarked}>
                            {!showMarkedQuestions ? 'Show Marked Questions' : 'Quit'}
                        </button>

                        <button className={showMarkedQuestions ? 'hide' : ''} onClick={toggleAllQuestions}>
                            {!showAllQuestions ? 'Show All Questions' : 'Quit'}
                        </button>
                    </div>
                </div>

                {showAllQuestions && (
                    <div className="marked-questions">
                        {showAllQuestions && (
                            <div className="marked-questions-list">
                                <p>Click on a question to navigate:</p>
                                <ul>
                                    {questions.map((question, index) => (
                                        <li key={index}>
                                            <button className='show-all-question-descrition' onClick={() => handleGoToQuestion(index)}>
                                                {index + 1}) {question.description} {markedQuestions.includes(index) && <FaFlag className="marked-icon" />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {markedQuestions.length > 0 && (
                    <div className="marked-questions">
                        {showMarkedQuestions && (
                            <div className="marked-questions-list">
                                <p>Click on a question to navigate:</p>
                                <ul>
                                    {markedQuestions.map((index) => (
                                        <li key={index}>
                                            <button className='show-all-question-descrition' onClick={() => handleGoToQuestionWhichIsMarked(index)}>
                                                {index + 1}) {questions[index].description}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={showAllQuestions || showMarkedQuestions ? 'hide' : ''} style={{ marginTop: "50px" }}>
                <h3>{currentQuestion?.description}</h3>
                <ul>
                    {currentQuestion?.answers?.map((option, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type={currentQuestion.type === 'singleChoice' ? 'radio' : 'checkbox'}
                                    value={option.id}
                                    checked={selectedAnswers[currentQuestionIndex].includes(option.id)}
                                    onChange={() => handleAnswerSelect(option.id)}
                                />
                                {option.description}
                            </label>
                        </li>
                    ))}
                </ul>

                <div className="navigation-buttons" style={{ "position": "absolute", bottom: "20px", width: "95%", display: "flex", justifyContent: "left" }}>
                    {currentQuestionIndex > 0 && (
                        <button onClick={handlePreviousQuestion}>Previous</button>
                    )}
                    {isLastQuestion ? (
                        <button onClick={handleSubmitQuiz} className="finish-button" style={{ backgroundColor: "green", color: "white", marginLeft: "10px" }}>Finish</button>
                    ) : (
                        <button onClick={handleNextQuestion} className="next-button" style={{ marginLeft: "10px" }}>Next</button>
                    )}
                </div>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default QuizComponent;