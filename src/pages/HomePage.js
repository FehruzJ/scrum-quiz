import React, { useEffect, useState } from 'react';
import makeApiRequest from '../api/makeApiRequest';
import TimerComponent from '../component/TimerComponent';
import QuizComponent from '../component/QuizComponent';
import ResultComponent from '../component/ResultComponent';
import '../style/HomePage.css';

const HomePage = () => {
    const [questions, setQuestions] = useState([]);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [result, setResult] = useState([]);
    const [percentage, setPercentage] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingResult, setIsLoadingResult] = useState(true);
    const [isLoadingResultPerctenge, setIsLoadingResultPerctenge] = useState(true);

    const [quizStartTime, setQuizStartTime] = useState(new Date);
    const [quizEndTime, setQuizEndTime] = useState(null);
    const [duration, setDuration] = useState('00:00:00');
    const [resetTimer, setResetTimer] = useState(false); // Y

    useEffect(() => {
        makeApiRequest('https://quiz-406810.df.r.appspot.com/question/read-info', 'GET')
            .then(response => {
                setQuestions(response.data);
                setIsLoading(false); // Veri geldiğinde bekleme durumu kapatılır
            })
            .catch(error => {
                setIsLoading(false); // Hata durumunda da bekleme durumu kapatılır
            });
    }, []);

    const totalTime = 200;

    const handleAnswerSubmit = (selectedAnswer) => {
        fetch('https://quiz-406810.df.r.appspot.com/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAnswer),
        })
            .then(response => response.json())
            .then(data => {
                setIsLoadingResult(false)
                setResult(data);
                // console.log(data)
            })
            .catch(error => {
                setIsLoadingResult(false)
                console.error('Error:', error);
            });

        fetch('https://quiz-406810.df.r.appspot.com/result/percentage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAnswer),
        })
            .then(response => response.json())
            .then(data => {
                setIsLoadingResultPerctenge(false)
                setPercentage(data);
                // console.log(data)
            })
            .catch(error => {
                false();
                console.error('Error:', error);
                setIsLoadingResultPerctenge(false)
            });

        setIsQuizFinished(true);
        setResetTimer(true);

        const currentTime = new Date();
        setQuizEndTime(currentTime);

        if (quizStartTime) {
            const diffInSeconds = Math.floor((currentTime - quizStartTime) / 1000);
            const formattedDuration = formatDuration(diffInSeconds);
            setDuration(formattedDuration);
        }

        if (!isQuizFinished) {
            localStorage.removeItem('selectedAnswers');
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('markedQuestions');
            localStorage.removeItem('timeLeft');
        }
    };

    const handleTimeOut = () => {
        const questionAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
        const answersToSubmit = questionAnswers?.map((answers, index) => ({
            question: questions[index],
            answers: answers,
        }));

        // Yalnızca quiz bitmediyse ve cevaplar varsa gönder
        if (!isQuizFinished && answersToSubmit && answersToSubmit.length > 0) {
            setIsQuizFinished(true); // Önce işaretle, tekrar çağrılmasını engellemek için
            handleAnswerSubmit(answersToSubmit);
        }
    };

    function formatDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <div className="App" style={styles.container}>
            <div style={styles.content}>
                <TimerComponent
                    totalTime={totalTime}
                    handleTimeOut={handleTimeOut}
                    handleResetTime={resetTimer}
                />
                {isLoading ? (
                    <div className="overlay">
                        <div className="spinner"></div>
                    </div>
                ) : questions?.length > 0 && !isQuizFinished ? (
                    <QuizComponent
                        questions={questions}
                        handleAnswerSubmit={handleAnswerSubmit}
                    />
                ) : (
                    <div>
                        {isQuizFinished ? (
                            <ResultComponent
                                results={result}
                                percentage={percentage}
                                duration={duration}
                                quizStartTime={quizStartTime}
                                quizEndTime={quizEndTime}
                                isLoadingResult={isLoadingResult}
                                isLoadingResultPerctenge={isLoadingResultPerctenge}
                            />
                        ) : (
                            <div style={styles.loading}>Loading...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
    },
    content: {
    },

};

export default HomePage;
