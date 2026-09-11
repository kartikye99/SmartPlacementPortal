import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Square,
  Sparkles,
  MessageSquare,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowLeft,
  Bot,
  User,
  ShieldCheck,
  Radio,
  Play,
  Pause,
  Download,
} from 'lucide-react';
import { api } from '../../services/api';
import { getVoiceProvider } from '../../services/voice/voiceProvider';
import { GeminiLiveVoiceProvider } from '../../services/voice/geminiLiveProvider';
import { AudioRecorder } from '../../services/voice/audioRecorder';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export default function MockInterviewArena() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Core Session State
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction State
  const [mode, setMode] = useState('voice'); // 'voice' | 'text'
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [activeSpeechInterim, setActiveSpeechInterim] = useState('');
  const [liveVoiceAvailable, setLiveVoiceAvailable] = useState(false);
  const [liveVoiceState, setLiveVoiceState] = useState('idle');
  const [liveVoiceError, setLiveVoiceError] = useState('');

  // Audio Recording with Consent
  const [recordingConsent, setRecordingConsent] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  const audioPlayerRef = useRef(null);

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Conclude / Feedback
  const [isConcluding, setIsConcluding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Voice & Recorder References
  const voiceProviderRef = useRef(null);
  const liveVoiceProviderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Format MM:SS
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, activeSpeechInterim]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Initialize browser fallback voice and local consented recorder
  useEffect(() => {
    voiceProviderRef.current = getVoiceProvider('webspeech');
    audioRecorderRef.current = new AudioRecorder();

    return () => {
      voiceProviderRef.current?.stopSpeaking();
      voiceProviderRef.current?.stopListening();
      liveVoiceProviderRef.current?.close();
      audioRecorderRef.current?.cleanup();
    };
  }, []);

  // Fetch Interview Data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/interviews/${id}`);
        if (data.interview) {
          setInterview(data.interview);
          setTranscript(data.interview.transcript || []);
          setMode(data.interview.mode || 'voice');
          setRecordingConsent(data.interview.recordingConsentGiven ?? true);

          if (data.interview.status === 'completed' && data.interview.feedback) {
            setEvaluation(data.interview.feedback);
            setShowReportModal(true);
            setTimerActive(false);
          } else {
            setTimerActive(true);
            // Start audio recorder if consent given
            if (data.interview.recordingConsentGiven && audioRecorderRef.current.isSupported()) {
              audioRecorderRef.current.start().catch((err) => {
                console.warn('Audio recording could not start:', err.message);
              });
            }

            // Voice mode connects to Gemini Live in the dedicated effect below.
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview session');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  // Connect voice-mode sessions to the server-side Gemini Live relay.
  useEffect(() => {
    if (!interview || interview.status === 'completed' || mode !== 'voice') return undefined;

    let disposed = false;
    let fallbackStarted = false;
    const provider = new GeminiLiveVoiceProvider();
    liveVoiceProviderRef.current = provider;

    const startBrowserFallback = (message) => {
      if (disposed || fallbackStarted) return;
      fallbackStarted = true;
      setLiveVoiceAvailable(false);
      setLiveVoiceError(message || 'Gemini Live is unavailable; browser voice mode is active.');
      const opening = interview.transcript?.find((item) => item.role === 'ai')?.message;
      if (opening) {
        setAiSpeaking(true);
        voiceProviderRef.current?.speak(opening, {
          onStart: () => setAiSpeaking(true),
          onEnd: () => setAiSpeaking(false),
          onError: () => setAiSpeaking(false),
        });
      }
    };

    provider.connect(interview._id || id, {
      onStatus: (state) => {
        if (disposed) return;
        setLiveVoiceState(state);
        setAiThinking(state === 'thinking');
      },
      onListeningStart: () => { if (!disposed) setUserSpeaking(true); },
      onListeningEnd: () => { if (!disposed) setUserSpeaking(false); },
      onSpeakingStart: () => { if (!disposed) setAiSpeaking(true); },
      onSpeakingEnd: () => { if (!disposed) setAiSpeaking(false); },
      onInputTranscript: (text) => { if (!disposed) setActiveSpeechInterim(text); },
      onOutputTranscript: () => { if (!disposed) setAiThinking(false); },
      onTranscript: (nextTranscript) => {
        if (disposed) return;
        setTranscript(nextTranscript || []);
        setActiveSpeechInterim('');
        setUserInput('');
        setAiThinking(false);
      },
      onTurnComplete: () => { if (!disposed) setAiThinking(false); },
      onInterrupted: () => { if (!disposed) setAiSpeaking(false); },
      onError: (liveError) => startBrowserFallback(liveError.message),
      onClose: () => {
        if (!disposed) setLiveVoiceAvailable(false);
      },
    }).then(() => {
      if (disposed) return;
      setLiveVoiceAvailable(true);
      setLiveVoiceError('');
    }).catch((liveError) => startBrowserFallback(liveError.message));

    return () => {
      disposed = true;
      provider.close();
      if (liveVoiceProviderRef.current === provider) liveVoiceProviderRef.current = null;
    };
  }, [id, interview, mode]);

  // Browser TTS fallback when Gemini Live is unavailable
  const speakAiMessage = (text) => {
    if (voiceMuted || !voiceProviderRef.current) return;
    setAiSpeaking(true);
    voiceProviderRef.current.speak(text, {
      onStart: () => setAiSpeaking(true),
      onEnd: () => setAiSpeaking(false),
      onError: () => setAiSpeaking(false),
    });
  };

  // Toggle Gemini Live microphone, falling back to browser speech recognition.
  const toggleSpeechRecognition = async () => {
    if (liveVoiceState === 'connecting' || liveVoiceState === 'connected') return;

    if (liveVoiceAvailable && liveVoiceProviderRef.current) {
      try {
        if (userSpeaking) {
          liveVoiceProviderRef.current.stopListening();
          setUserSpeaking(false);
        } else {
          voiceProviderRef.current?.stopSpeaking();
          setAiSpeaking(false);
          setActiveSpeechInterim('');
          await liveVoiceProviderRef.current.startListening();
        }
      } catch (liveError) {
        setUserSpeaking(false);
        setLiveVoiceError(liveError.message || 'Microphone access failed.');
      }
      return;
    }

    if (userSpeaking) {
      voiceProviderRef.current?.stopListening();
      setUserSpeaking(false);
      if (activeSpeechInterim.trim()) {
        setUserInput((previous) => previous ? `${previous} ${activeSpeechInterim.trim()}` : activeSpeechInterim.trim());
        setActiveSpeechInterim('');
      }
      return;
    }

    voiceProviderRef.current?.stopSpeaking();
    setAiSpeaking(false);
    voiceProviderRef.current?.listen({
      onStart: () => {
        setUserSpeaking(true);
        setActiveSpeechInterim('');
      },
      onResult: ({ transcript: interim, isFinal }) => {
        setActiveSpeechInterim(interim);
        if (isFinal) {
          setUserInput((previous) => previous ? `${previous} ${interim.trim()}` : interim.trim());
          setActiveSpeechInterim('');
        }
      },
      onError: (speechError) => {
        console.warn('Speech Recognition Error:', speechError);
        setUserSpeaking(false);
      },
      onEnd: () => setUserSpeaking(false),
    });
  };

  // Submit Answer to Server
  const handleSendAnswer = async () => {
    const finalAnswer = (userInput + ' ' + activeSpeechInterim).trim();
    if (!finalAnswer || aiThinking) return;

    if (mode === 'voice' && liveVoiceAvailable && liveVoiceProviderRef.current) {
      if (userSpeaking) liveVoiceProviderRef.current.stopListening();
      setUserSpeaking(false);
      setActiveSpeechInterim('');
      setUserInput('');
      setAiThinking(true);
      setTranscript((previous) => [...previous, { role: 'user', message: finalAnswer, timestamp: new Date() }]);
      const sent = liveVoiceProviderRef.current.sendText(finalAnswer);
      if (!sent) {
        setAiThinking(false);
        setLiveVoiceError('The live connection is not ready. Please try again.');
      }
      return;
    }

    // Browser voice/text fallback uses the existing HTTP turn endpoint.
    voiceProviderRef.current?.stopListening();
    voiceProviderRef.current?.stopSpeaking();
    setUserSpeaking(false);
    setActiveSpeechInterim('');
    setUserInput('');
    setAiThinking(true);

    // Optimistically update transcript
    const userMsg = { role: 'user', message: finalAnswer, timestamp: new Date() };
    setTranscript((prev) => [...prev, userMsg]);

    try {
      const res = await api.post(`/interviews/${id}/message`, { message: finalAnswer });
      if (res.aiMessage) {
        const aiMsg = { role: 'ai', message: res.aiMessage, timestamp: new Date() };
        setTranscript(res.transcript || ((prev) => [...prev, aiMsg]));
        setAiThinking(false);

        // Speak AI response if in voice mode
        if (mode === 'voice') {
          speakAiMessage(res.aiMessage);
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setAiThinking(false);
      alert(err.message || 'Failed to submit response');
    }
  };

  // End Interview & Generate Feedback
  const handleEndInterview = async () => {
    setShowEndConfirm(false);
    setIsConcluding(true);
    setTimerActive(false);

    voiceProviderRef.current?.stopSpeaking();
    voiceProviderRef.current?.stopListening();
    if (liveVoiceProviderRef.current) {
      await liveVoiceProviderRef.current.close({ waitForTurn: true });
      liveVoiceProviderRef.current = null;
    }
    setAiSpeaking(false);
    setUserSpeaking(false);

    // Stop audio recording if active
    if (audioRecorderRef.current?.isRecording()) {
      try {
        const recordingData = await audioRecorderRef.current.stop();
        if (recordingData?.url) {
          setRecordedAudioUrl(recordingData.url);
        }
      } catch (recErr) {
        console.warn('Failed stopping recorder:', recErr);
      }
    }

    try {
      const res = await api.post(`/interviews/${id}/end`, {
        durationSeconds: secondsElapsed,
      });

      if (res.feedback) {
        setEvaluation(res.feedback);
        setShowReportModal(true);
      }
    } catch (err) {
      console.error('Error ending interview:', err);
      alert(err.message || 'Failed to complete interview evaluation');
    } finally {
      setIsConcluding(false);
    }
  };

  // Get most recent AI question
  const currentAiQuestion = [...transcript].reverse().find((m) => m.role === 'ai')?.message ||
    'Preparing interview environment...';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing AI Interview Stage & Audio Engine...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-950/30 border border-red-800/50 rounded-2xl text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Interview Session Error</h2>
        <p className="text-slate-300 text-sm mb-4">{error || 'Session not found'}</p>
        <Button variant="outline" onClick={() => navigate('/student/interview')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Interview Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/interview')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Exit to Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{interview.company}</h1>
              <Badge variant="indigo">{interview.category}</Badge>
              <Badge variant={mode === 'voice' ? 'purple' : 'neutral'}>
                {mode === 'voice'
                  ? liveVoiceAvailable
                    ? 'Gemini Live Voice'
                    : liveVoiceState === 'connecting' || liveVoiceState === 'connected'
                      ? 'Connecting Live Voice'
                      : 'Browser Voice Fallback'
                  : 'Text Interview'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{interview.jobTitle}</p>
          </div>
        </div>

        {/* Live Audio Status & Session Control */}
        <div className="flex items-center gap-3">
          {/* Recording Consent Pill */}
          {recordingConsent && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/60 text-xs text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REC Active (Consent Granted)</span>
            </div>
          )}

          {/* Mode Switcher */}
          <button
            onClick={() => setMode((m) => (m === 'voice' ? 'text' : 'voice'))}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            Switch to {mode === 'voice' ? 'Text Mode' : 'Voice Mode'}
          </button>

          {/* Speaker Mute/Unmute */}
          <button
            onClick={() => {
              const nextMuted = !voiceMuted;
              if (nextMuted) voiceProviderRef.current?.stopSpeaking();
              liveVoiceProviderRef.current?.setMuted(nextMuted);
              setVoiceMuted(nextMuted);
            }}
            className={`p-2 rounded-xl border transition ${
              voiceMuted
                ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={voiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Running Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-emerald-400 font-mono text-sm font-semibold tracking-wider shadow-inner">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* End Interview Button */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowEndConfirm(true)}
            disabled={isConcluding}
            className="font-semibold shadow-lg shadow-red-900/20"
          >
            <Square className="w-4 h-4 mr-1.5 fill-current" />
            End Interview
          </Button>
        </div>
      </div>

      {mode === 'voice' && liveVoiceError && (
        <div className="px-4 py-3 rounded-lg border text-xs flex items-center gap-2" style={{ background: 'var(--warning-soft)', borderColor: 'color-mix(in srgb, var(--warning) 28%, transparent)', color: 'var(--warning)' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{liveVoiceError} You can continue with browser voice recognition or switch to text mode.</span>
        </div>
      )}

      {/* Grid: Main Stage (Prompt ASCII Specification) + Transcript Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================
            DEDICATED INTERVIEW UI (Prompt-matched Centerpiece)
            ┌───────────────────────────────┐
            │       AI INTERVIEWER          │
            │                               │
            │   Question / Conversation     │
            │                               │
            │        🎤 Speaking...         │
            │                               │
            │       18:42                   │
            │                               │
            │      [ End Interview ]        │
            └───────────────────────────────┘
           ============================================================ */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[520px] card-area-interview">
            {/* Stage Header: AI INTERVIEWER + 4-STATE STATUS CHAIN */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/25 ring-1 ring-white/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  {aiSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500" />
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-wide uppercase font-display">AI Interview Room</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Senior Bar Raiser • <strong className="text-slate-200">{interview.company}</strong>
                  </p>
                </div>
              </div>

              {/* 4-State Animated Indicator: AI Ready → Listening → Thinking → Speaking */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                {/* State 1: Ready */}
                <div
                  className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                    !aiSpeaking && !userSpeaking && !aiThinking
                      ? 'bg-violet-500/20 text-violet-300 font-bold border border-violet-500/40 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>Ready</span>
                </div>

                <span className="text-slate-600 text-[10px]">→</span>

                {/* State 2: Listening */}
                <div
                  className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                    userSpeaking
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm animate-pulse'
                      : 'text-slate-500'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>Listening</span>
                </div>

                <span className="text-slate-600 text-[10px]">→</span>

                {/* State 3: Thinking */}
                <div
                  className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                    aiThinking
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Thinking</span>
                </div>

                <span className="text-slate-600 text-[10px]">→</span>

                {/* State 4: Speaking */}
                <div
                  className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
                    aiSpeaking
                      ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  <Volume2 className="w-3 h-3 animate-bounce text-pink-400" />
                  <span>Speaking</span>
                </div>
              </div>
            </div>

            {/* Stage Body: Current Active Question & Dynamic Waveform */}
            <div className="relative z-10 py-8 flex flex-col justify-center items-center text-center">
              {/* Animated Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1.5 mb-6 h-12">
                {[40, 75, 55, 90, 65, 30, 85, 45, 95, 60, 35, 70, 50].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      aiSpeaking
                        ? 'bg-gradient-to-t from-pink-500 to-purple-400 animate-pulse'
                        : userSpeaking
                        ? 'bg-gradient-to-t from-emerald-400 to-teal-300 animate-pulse'
                        : 'bg-slate-800 h-2'
                    }`}
                    style={{
                      height: aiSpeaking || userSpeaking ? `${h}%` : '8px',
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Question Text Box */}
              <div className="max-w-2xl px-4">
                <span className="text-xs font-bold tracking-widest text-pink-400 uppercase mb-2 block font-display">
                  Discussion Point
                </span>
                <p className="text-xl sm:text-2xl font-black text-white leading-relaxed tracking-tight">
                  "{currentAiQuestion}"
                </p>
              </div>

              {/* Live Transcript / Speech Interim preview */}
              {(userSpeaking || activeSpeechInterim) && (
                <div className="mt-6 max-w-xl p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-sm animate-fade-in flex items-center gap-2 shadow-lg">
                  <Mic className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                  <span className="italic font-medium">
                    "{activeSpeechInterim || 'Listening to your microphone... speak clearly'}"
                  </span>
                </div>
              )}
            </div>

            {/* Stage Footer: Glowing Microphone Trigger + Timer */}
            <div className="relative z-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Large Timer Display (18:42 style) */}
              <div className="flex items-center gap-2.5">
                <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-pink-400 font-mono text-xl font-bold tracking-widest shadow-inner">
                  {formatTime(secondsElapsed)}
                </div>
                <span className="text-xs text-slate-400 font-medium">Session Duration</span>
              </div>

              {/* Voice Action Button with Glowing Ring */}
              {mode === 'voice' ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSpeechRecognition}
                    disabled={liveVoiceState === 'connecting' || liveVoiceState === 'connected' || aiThinking}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                      userSpeaking
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                        : 'btn-interview ring-4 ring-pink-500/20 shadow-pink-500/30'
                    }`}
                  >
                    {userSpeaking ? (
                      <>
                        <Square className="w-5 h-5 fill-current animate-pulse" />
                        <span>Done Speaking</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 animate-pulse" />
                        <span>
                          {liveVoiceState === 'connecting' || liveVoiceState === 'connected'
                            ? 'Connecting Gemini Live…'
                            : liveVoiceAvailable
                              ? 'Start Live Answer'
                              : 'Speak Answer'}
                        </span>
                      </>
                    )}
                  </button>

                  {(userInput || activeSpeechInterim) && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSendAnswer}
                      disabled={aiThinking}
                      className="px-5 font-semibold"
                    >
                      <Send className="w-4 h-4 mr-1.5" />
                      Send Answer
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-medium">Text Mode Active</span>
                </div>
              )}

              {/* End Interview Trigger */}
              <button
                onClick={() => setShowEndConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold transition-colors"
              >
                Conclude & View Evaluation
              </button>
            </div>
          </div>

          {/* Interactive Answer Input Form (Supports typing, editing transcript, and instant submit) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Your Response Formulation
              </label>
              <span className="text-xs text-slate-500">Press Enter or click Send to submit</span>
            </div>

            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAnswer();
                  }
                }}
                rows={3}
                placeholder={
                  mode === 'voice'
                    ? 'Your spoken transcript will appear here in real time. You can also refine or type directly...'
                    : 'Type your comprehensive response here (supporting DSA trade-offs, architecture, or behavioral examples)...'
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {mode === 'voice' && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`p-2 rounded-lg transition ${
                      userSpeaking
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title={userSpeaking ? 'Stop listening' : 'Start microphone'}
                  >
                    {userSpeaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSendAnswer}
                  disabled={(!userInput.trim() && !activeSpeechInterim.trim()) || aiThinking}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            TRANSCRIPT & CONVERSATION TIMELINE DRAWER
           ============================================================ */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl flex flex-col h-[620px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Transcript</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {transcript.length} {transcript.length === 1 ? 'Turn' : 'Turns'}
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm custom-scrollbar">
              {transcript.map((item, idx) => {
                const isAi = item.role === 'ai';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                      {isAi ? (
                        <>
                          <Bot className="w-3 h-3 text-cyan-400" />
                          <span>Interviewer</span>
                        </>
                      ) : (
                        <>
                          <span>You</span>
                          <User className="w-3 h-3 text-indigo-400" />
                        </>
                      )}
                    </div>
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 leading-relaxed text-xs sm:text-sm ${
                        isAi
                          ? 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                          : 'bg-indigo-600/90 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {item.message}
                    </div>
                  </div>
                );
              })}

              {/* Streaming AI Thinking Indicator */}
              {aiThinking && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-900/40 border border-cyan-700 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Evaluating answer & formulating follow-up probe...</span>
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Audio Recording Consent Badge */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Privacy & Data Stored Securely
              </span>
              <span className="text-[11px] text-slate-500">{interview.category} Mock</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CONFIRMATION MODAL: END INTERVIEW
         ============================================================ */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-800/60 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Square className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Conclude Mock Interview?</h3>
            <p className="text-sm text-slate-300 mb-6">
              You have completed <strong className="text-white">{formatTime(secondsElapsed)}</strong> across{' '}
              <strong className="text-white">{transcript.filter((t) => t.role === 'user').length} answered questions</strong>.
              The AI will compile your multidimensional evaluation report immediately.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowEndConfirm(false)}>
                Continue Interview
              </Button>
              <Button variant="danger" onClick={handleEndInterview}>
                Yes, Generate Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          POST-INTERVIEW COMPREHENSIVE EVALUATION MODAL / REPORT
         ============================================================ */}
      {showReportModal && evaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="max-w-3xl w-full my-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">Interview Performance Assessment</h2>
                  <Badge variant="emerald">Completed</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {interview.company} • {interview.jobTitle} • {formatTime(interview.durationSeconds || secondsElapsed)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/student/interview')}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Hub
                </Button>
              </div>
            </div>

            {/* Audio Recording Playback (if recorded) */}
            {recordedAudioUrl && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Session Audio Recording</h4>
                    <p className="text-xs text-slate-400">Captured with user consent for self-review</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <audio
                    ref={audioPlayerRef}
                    src={recordedAudioUrl}
                    onPlay={() => setIsPlayingRecordedAudio(true)}
                    onPause={() => setIsPlayingRecordedAudio(false)}
                    onEnded={() => setIsPlayingRecordedAudio(false)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isPlayingRecordedAudio) {
                        audioPlayerRef.current?.pause();
                      } else {
                        audioPlayerRef.current?.play();
                      }
                    }}
                  >
                    {isPlayingRecordedAudio ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlayingRecordedAudio ? 'Pause' : 'Play Audio'}
                  </Button>
                  <a
                    href={recordedAudioUrl}
                    download={`interview_${interview.company}_${Date.now()}.webm`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            )}

            {/* Score Metric Cards (8-Dimension Overview) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall</span>
                <div className="text-2xl font-black text-indigo-400 mt-0.5">
                  {evaluation.overallScore}%
                </div>
                <span className="text-[10px] text-indigo-300/80">Benchmark</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Technical</span>
                <div className="text-2xl font-black text-cyan-400 mt-0.5">
                  {evaluation.technicalScore}%
                </div>
                <span className="text-[10px] text-slate-500">Concepts</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Problem Solving</span>
                <div className="text-2xl font-black text-indigo-300 mt-0.5">
                  {evaluation.problemSolvingScore || evaluation.technicalScore}%
                </div>
                <span className="text-[10px] text-slate-500">Logic</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Communication</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {evaluation.communicationScore}%
                </div>
                <span className="text-[10px] text-slate-500">Clarity</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confidence</span>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  {evaluation.confidenceScore}%
                </div>
                <span className="text-[10px] text-slate-500">Composure</span>
              </div>
            </div>

            {/* Weakness Detection Radar Preview */}
            {evaluation.weaknessAnalysis && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Detected Weaknesses & Strong Competencies
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {evaluation.weaknessAnalysis.critical?.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 font-semibold flex items-center gap-1">
                      <span>🔴 Critical:</span>
                      <strong>{c.topic}</strong>
                    </span>
                  ))}
                  {evaluation.weaknessAnalysis.needsImprovement?.map((n, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 font-semibold flex items-center gap-1">
                      <span>🟠 Improve:</span>
                      <strong>{n.topic}</strong>
                    </span>
                  ))}
                  {evaluation.weaknessAnalysis.strong?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1">
                      <span>🟢 Strong:</span>
                      <strong>{s.topic}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" />
                Interviewer Assessment Summary
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {evaluation.summary}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <Button variant="outline" onClick={() => navigate('/student/interview')}>
                Return to Hub
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                >
                  Print PDF
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/student/interview/analysis/${interview._id}`)}
                  className="shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  View Deep Analysis & Weakness Radar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
