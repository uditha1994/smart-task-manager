import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import './TimeTracker.css';

const TimeTracker = ({
    task,
    isOpen,
    onClose,
    onSave
}) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [sessions, setSessions] = useState([]);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (task) {
            // Load existing time data
            const savedSessions = JSON.parse(localStorage.getItem(`time-${task.id}`) || '[]');
            setSessions(savedSessions);
            setElapsedTime(task.actualTime * 3600 || 0); // Convert hours to seconds
        }
    }, [task]);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - (elapsedTime * 1000);
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTimeRef.current) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        if (elapsedTime > 0) {
            const newSession = {
                id: Date.now(),
                startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
                endTime: new Date().toISOString(),
                duration: elapsedTime,
                date: new Date().toISOString().split('T')[0]
            };

            const updatedSessions = [...sessions, newSession];
            setSessions(updatedSessions);
            localStorage.setItem(`time-${task.id}`, JSON.stringify(updatedSessions));
        }
        setElapsedTime(0);
    };

    const handleSave = () => {
        const totalHours = sessions.reduce((total, session) => total + session.duration, 0) / 3600;
        onSave(task.id, { actualTime: totalHours });
        onClose();
    };

    const deleteSession = (sessionId) => {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);
        localStorage.setItem(`time-${task.id}`, JSON.stringify(updatedSessions));
    };

    const getTotalTime = () => {
        return sessions.reduce((total, session) => total + session.duration, 0);
    };

    if (!task) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Time Tracker"
            size="medium"
        >
            <div className="time-tracker">
                <div className="time-tracker__task">
                    <h3 className="time-tracker__task-title">{task.title}</h3>
                    {task.estimatedTime > 0 && (
                        <p className="time-tracker__estimated">
                            Estimated: {task.estimatedTime}h
                        </p>
                    )}
                </div>

                <Card className="time-tracker__timer" padding="large">
                    <div className="time-tracker__display">
                        <div className="time-tracker__time">
                            {formatTime(elapsedTime)}
                        </div>
                        <div className="time-tracker__status">
                            {isRunning ? (
                                <span className="time-tracker__status--running">
                                    <div className="time-tracker__pulse"></div>
                                    Recording...
                                </span>
                            ) : (
                                <span className="time-tracker__status--stopped">Stopped</span>
                            )}
                        </div>
                    </div>

                    <div className="time-tracker__controls">
                        {!isRunning ? (
                            <Button
                                variant="primary"
                                icon={<Play size={18} />}
                                onClick={handleStart}
                            >
                                Start
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                icon={<Pause size={18} />}
                                onClick={handlePause}
                            >
                                Pause
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            icon={<Square size={18} />}
                            onClick={handleStop}
                            disabled={elapsedTime === 0}
                        >
                            Stop
                        </Button>
                    </div>
                </Card>

                {sessions.length > 0 && (
                    <div className="time-tracker__sessions">
                        <div className="time-tracker__sessions-header">
                            <h4>Time Sessions</h4>
                            <div className="time-tracker__total">
                                Total: {formatTime(getTotalTime())}
                            </div>
                        </div>

                        <div className="time-tracker__sessions-list">
                            {sessions.map(session => (
                                <motion.div
                                    key={session.id}
                                    className="time-tracker__session"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="time-tracker__session-info">
                                        <div className="time-tracker__session-date">
                                            {new Date(session.date).toLocaleDateString()}
                                        </div>
                                        <div className="time-tracker__session-time">
                                            {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="time-tracker__session-duration">
                                        {formatTime(session.duration)}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => deleteSession(session.id)}
                                        className="time-tracker__session-delete"
                                    >
                                        ×
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="time-tracker__actions">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Time
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TimeTracker;