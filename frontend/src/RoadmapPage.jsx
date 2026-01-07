import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Compass,
    Target,
    Briefcase,
    TrendingUp,
    CheckCircle,
    Circle,
    AlertTriangle,
    RefreshCw,
    ChevronRight,
    Calendar,
    Lock
} from 'lucide-react';
import { getRoadmap, generateRoadmap, toggleRoadmapTopic } from './api';

const RoadmapPage = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [selection, setSelection] = useState({
        targetRole: 'Full-Stack',
        experienceLevel: 'Fresher'
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            setLoading(true);
            const data = await getRoadmap(token);
            setRoadmap(data);
            setError('');
        } catch (err) {
            if (err.message.includes('No active roadmap found')) {
                setRoadmap(null);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            setGenerating(true);
            setError('');
            const data = await generateRoadmap(token, selection);
            setRoadmap(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleToggleTopic = async (weekIndex, topicId) => {
        try {
            const data = await toggleRoadmapTopic(token, { weekIndex, topicId });
            setRoadmap(data);
        } catch (err) {
            setError('Failed to update progress');
        }
    };

    const calculateProgress = () => {
        if (!roadmap) return 0;
        const allTopics = roadmap.weeklyRoadmap.flatMap(w => w.topics);
        const completed = allTopics.filter(t => t.completed).length;
        return Math.round((completed / allTopics.length) * 100);
    };

    if (loading) {
        return (
            <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '16px', color: 'white' }}>
                        <Compass size={32} />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0 }}>AI Interview Roadmap</h1>
                        <p style={{ margin: 0 }}>Step-by-step personalized prep plan.</p>
                    </div>
                </div>

                {!roadmap && !generating ? (
                    <SelectionView
                        selection={selection}
                        setSelection={setSelection}
                        handleGenerate={handleGenerate}
                        error={error}
                    />
                ) : generating ? (
                    <GeneratingView />
                ) : (
                    <RoadmapView
                        roadmap={roadmap}
                        progress={calculateProgress()}
                        handleToggleTopic={handleToggleTopic}
                        handleRegenerate={() => setRoadmap(null)}
                    />
                )}
            </motion.div>
        </div>
    );
};

const SelectionView = ({ selection, setSelection, handleGenerate, error }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: '500px', margin: '2rem auto' }}
    >
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Set Your Target</h3>
            <form onSubmit={handleGenerate}>
                <div className="auth-input-group">
                    <label><Target size={14} /> Target Role</label>
                    <select
                        value={selection.targetRole}
                        onChange={e => setSelection({ ...selection, targetRole: e.target.value })}
                    >
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Full-Stack</option>
                        <option>AIML</option>
                    </select>
                </div>
                <div className="auth-input-group">
                    <label><Briefcase size={14} /> Experience Level</label>
                    <select
                        value={selection.experienceLevel}
                        onChange={e => setSelection({ ...selection, experienceLevel: e.target.value })}
                    >
                        <option>Fresher</option>
                        <option>1–3 yrs</option>
                        <option>3+ yrs</option>
                    </select>
                </div>
                {error && <p style={{ color: '#f87171', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                    Generate My Roadmap 🚀
                </button>
            </form>
        </div>
    </motion.div>
);

const GeneratingView = () => (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--primary)' }}
        >
            <RefreshCw size={48} />
        </motion.div>
        <h2>AI is crafting your path...</h2>
        <p>Analyzing history, identifying weak spots, and building your schedule.</p>
    </div>
);

const RoadmapView = ({ roadmap, progress, handleToggleTopic, handleRegenerate }) => (
    <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <TrendingUp size={16} /> Readiness Score
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{roadmap.readinessScore}%</div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: 'var(--secondary)' }}
                    />
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{progress}% of topics completed</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-pink)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={16} /> Focus Areas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {roadmap.weakAreas.map((area, i) => (
                        <span key={i} style={{ padding: '4px 12px', background: 'rgba(244, 114, 182, 0.1)', color: 'var(--accent-pink)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                            {area}
                        </span>
                    ))}
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: 'var(--text-muted)' }}>AI prioritized these based on your quiz fails.</p>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Weekly Plan</h2>
            <button
                onClick={handleRegenerate}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem' }}
            >
                <RefreshCw size={14} /> Regenerate
            </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {roadmap.weeklyRoadmap.map((week, wIdx) => (
                <motion.div
                    key={wIdx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: wIdx * 0.1 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>
                        <Calendar size={18} className="text-gradient" /> Week {week.week}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {week.topics.map((topic, tIdx) => (
                            <div
                                key={topic._id || tIdx}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)',
                                    position: 'relative',
                                    opacity: topic.completed ? 0.6 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{topic.title}</div>
                                    <button
                                        onClick={() => handleToggleTopic(wIdx, topic._id)}
                                        style={{ background: 'transparent', padding: 0, boxShadow: 'none', color: topic.completed ? 'var(--accent-lime)' : 'var(--text-muted)' }}
                                    >
                                        {topic.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>{topic.description}</p>
                                <div style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background: topic.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: topic.priority === 'High' ? '#ef4444' : 'var(--text-muted)'
                                }}>
                                    {topic.priority} Priority
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export default RoadmapPage;
