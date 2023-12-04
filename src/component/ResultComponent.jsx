import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../style/ResultComponent.css';
import { addSeperateNumber } from '../util/addSeperateNumber';
import { formatDate, formatDateTime } from '../util/formatDateTime';

const ResultComponent = ({ results, percentage, duration, quizStartTime, quizEndTime, isLoadingResult, isLoadingResultPerctenge }) => {
    const [selectedTab, setSelectedTab] = useState('All');

    const renderResult = (filteredResults) => {
        return filteredResults.map((result, index) => {
            const questionIndex = results.findIndex(res => res === result) + 1; // Gerçek soru indexini bulmak
            const questionHeader = `Question ${questionIndex} of ${results.length}`;

            return (
                <div className="question-container" key={index}>
                    <h3 className="question-header">{questionHeader}</h3>
                    <h4 className="question">{result.question}</h4>
                    <ul className="options-list">
                        {result.questionAnswers.answer.map((answer, i) => {
                            const isUserAnswer = result.userAnswers.includes(result.questionAnswers.id[i]);
                            const isCorrectAnswer = result.correctAnswers.includes(result.questionAnswers.id[i]);
                            const inputType = result.questionType === 'singleChoice' ? 'radio' : 'checkbox';
                            const isChecked = isUserAnswer ? 'checked' : '';
                            const icon = isUserAnswer && !isCorrectAnswer ? (
                                <FontAwesomeIcon icon={faTimes} className="icon incorrect" />
                            ) : (
                                isCorrectAnswer && <FontAwesomeIcon icon={faCheck} className="icon correct" />
                            );

                            return (
                                <li key={result.questionAnswers.id[i]} className={`option ${isUserAnswer ? 'user-answer' : ''}`}>
                                    <label className="option-label">
                                        <input
                                            type={inputType}
                                            value={result.questionAnswers.id[i]}
                                            checked={isChecked}
                                            readOnly
                                            className="answer-input"
                                        />
                                        <span className="answer-text">{answer}</span>
                                    </label>
                                    {icon}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        });
    };

    const filterResults = () => {
        if (selectedTab === 'Correct') {
            return results?.filter(result => {
                const answeredCorrectly = result.userAnswers.every(answerId => result.correctAnswers.includes(answerId));
                return answeredCorrectly && result.userAnswers.length === result.correctAnswers.length;
            });
        } else if (selectedTab === 'Wrong') {
            return results?.filter(result => {
                const answeredWrong = result.userAnswers.some(answerId => !result.correctAnswers.includes(answerId));
                return answeredWrong;
            });
        }
        return results;
    };

    const handleTabChange = tab => {
        setSelectedTab(tab);
    };

    const tabCounts = {
        All: results.length,
        Correct: results?.filter(result => {
            const answeredCorrectly = result.userAnswers.every(answerId => result.correctAnswers.includes(answerId));
            return answeredCorrectly && result.userAnswers.length === result.correctAnswers.length;
        }).length,
        Wrong: results?.filter(result => {
            const answeredWrong = result.userAnswers.some(answerId => !result.correctAnswers.includes(answerId));
            return answeredWrong;
        }).length
    };

    return (
        <div className="result-container">
            {isLoadingResult ?? isLoadingResultPerctenge ? (
                <div className="overlay">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <div className="result-summary">
                        <h1 className="summary-title">Scrum</h1>
                        <br />
                        <div className="summary-details">
                            <div className="summary-item">
                                <p className="summary-label">Percentage</p>
                                <p className="summary-value">{addSeperateNumber(percentage)}%</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Duration</p>
                                <p className="summary-value">{duration}</p>
                            </div>
                            {/* <div className="summary-item">
                                <p className="summary-label">Date started</p>
                                <p className="summary-value">{formatDateTime(quizStartTime)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Date finished</p>
                                <p className="summary-value">{formatDateTime(quizEndTime)}</p>
                            </div> */}
                        </div>
                        <div className="feedback">
                            <h2 className="feedback-header">Feedback</h2>
                            <p>Thank you for taking the Nexus™ Open assessment.</p>
                            <p>For further improvement, review The Nexus Guide on Scrum.org and retake this assessment.</p>
                            <p className="thank-you">Scrum on! Ken Schwaber</p>
                        </div>
                    </div>

                    <hr />
                    <div className="tab-buttons">
                        <button className={selectedTab === 'All' ? 'tab-button active' : 'tab-button'} onClick={() => handleTabChange('All')}>All ({tabCounts.All})</button>
                        <button className={selectedTab === 'Correct' ? 'tab-button active' : 'tab-button'} onClick={() => handleTabChange('Correct')}>Correct ({tabCounts.Correct})</button>
                        <button className={selectedTab === 'Wrong' ? 'tab-button active' : 'tab-button'} onClick={() => handleTabChange('Wrong')}>Wrong ({tabCounts.Wrong})</button>
                    </div>
                    {results.length > 0 ? renderResult(filterResults()) : <div>No results available</div>}
                </>
            )}
        </div>
    );
};

export default ResultComponent;