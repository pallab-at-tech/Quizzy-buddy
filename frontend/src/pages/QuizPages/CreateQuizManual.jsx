import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CreateQuizManual = () => {
    const { data } = useOutletContext(); 

    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correct: '', marks: '' },
    ]);

    // Add new question
    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { question: '', options: ['', '', '', ''], correct: '', marks: '' },
        ]);
    };

    //  Remove question
    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    //  Handle input changes
    const handleChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    //  Handle option updates
    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
    };

    return (
        <section className="h-[calc(100vh-70px)] overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Create Quiz Manually
                </h1>

                {/* Quiz Info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
                    <p className="text-gray-700">
                        <span className="font-semibold">Host ID:</span>{' '}
                        {data?.userId || 'N/A'}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Start Time:</span>{' '}
                        {data?.quiz_start
                            ? new Date(data.quiz_start).toLocaleString()
                            : 'Not Set'}
                    </p>
                </div>

                {/* Question Blocks */}
                {questions.map((q, i) => (
                    <div
                        key={i}
                        className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 transition-all hover:shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Question {i + 1}
                            </h2>
                            {questions.length > 1 && (
                                <button
                                    onClick={() => removeQuestion(i)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Remove question"
                                >
                                    <MdDelete size={20} />
                                </button>
                            )}
                        </div>

                        {/* Question Text */}
                        <textarea
                            value={q.question}
                            onChange={(e) => handleChange(i, 'question', e.target.value)}
                            placeholder="Enter your question here..."
                            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                        />

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {q.options.map((opt, j) => (
                                <input
                                    key={j}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                                    placeholder={`Option ${j + 1}`}
                                    className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            ))}
                        </div>

                        {/* Correct Answer + Marks */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">
                                Correct Answer:
                                <select
                                    value={q.correct}
                                    onChange={(e) =>
                                        handleChange(i, 'correct', e.target.value)
                                    }
                                    className="ml-2 p-1 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select</option>
                                    {q.options.map((_, idx) => (
                                        <option key={idx} value={idx}>
                                            Option {idx + 1}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="text-sm text-gray-600">
                                Marks:
                                <input
                                    type="number"
                                    value={q.marks}
                                    onChange={(e) =>
                                        handleChange(i, 'marks', e.target.value)
                                    }
                                    min="1"
                                    placeholder="e.g. 2"
                                    className="ml-2 p-1 border border-gray-300 rounded-md w-20 outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </label>
                        </div>
                    </div>
                ))}

                {/* Add Question Button */}
                <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                    <FaPlusCircle size={18} /> Add Question
                </button>
            </div>
        </section>
    );
};

export default CreateQuizManual;
