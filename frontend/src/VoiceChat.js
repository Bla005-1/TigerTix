import React, { useState, useContext } from 'react';
import './VoiceChat.css';
import { AuthContext } from './AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
}
/**
 * VoiceChat component
 * Handles speech input/output and interaction with the LLM microservice
 */
function VoiceChat({buyTicket, setStatusMessage}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [llmResponseText, setLlmResponseText] = useState('');
  const [confirmationPending, setConfirmationPending] = useState(false);

  const startRecording = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.05);
      osc.onended = () => ctx.close();
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('SpeechRecognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      try {
        const text = Array.from(e.results)
          .map((r) => r[0]?.transcript || '')
          .join(' ')
          .trim();
        if (text) setTranscript(text);
      } catch (err) {
        console.error('Recognition result handling failed', err);
        setStatusMessage('SpeechRecognition error')
      }
    };
    recognition.onerror = (e) => {
      console.error('SpeechRecognition error', e);
    };
    window.__voiceRecognition = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const recognition = window.__voiceRecognition;
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        try {
          if (typeof recognition.abort === 'function') recognition.abort();
        } catch (_) {}
      }
      window.__voiceRecognition = null;
    }
    setIsRecording(false);
    handleRecognitionResult(transcript)
  };

  const handleRecognitionResult = async (text) => {
    const payload = (text || '').trim();
    if (!payload) return;
    try {
      const { token } = useAuth;
      const res = await fetch('http://localhost:8001/api/llm/parse', {
        method: 'POST',
        body: payload,
        headers: {"Authorization": `Bearer ${token}`}
      });
      if (!res.ok) throw new Error(`LLM parse failed: ${res.status}`);
      const obj = await res.json();
      setStatusMessage(`${JSON.stringify(obj)}`)
      const parsed = {
        event_id: obj.data.event_id,
        event: obj.data.event,
        tickets: typeof obj.data.tickets === 'string' ? parseInt(obj.data.tickets, 10) || 1 : (obj.data.tickets || 1),
      };
      setLlmResponse(parsed);
      const msg = `Confirm booking for ${parsed.tickets} tickets to ${parsed.event}?`;
      setLlmResponseText(msg)
      setConfirmationPending(true);
      speak(msg)
    } catch (err) {
      console.error('Error contacting LLM service', err);
      setStatusMessage('Server error. Please try again.');
    }
  };

  const confirmBooking = async () => {
    try {
      const eventID = llmResponse?.event_id;
      const eventName = llmResponse?.event;
      const ticketsRequested = Number(llmResponse?.tickets) || 1;
      for (let i = 0; i < ticketsRequested; i++) {
        buyTicket(eventID, eventName, false);
      }
      setStatusMessage(`${ticketsRequested} ticket${ticketsRequested > 1 ? 's' : ''} purchased for: ${eventName}`);
      setConfirmationPending(false);
      setTranscript('');
      setLlmResponse('');
      setLlmResponseText('');
    } catch (err) {
      console.error(err);
      setStatusMessage('Server error. Please try again.');
    }
  };

  const speak = (text) => {
    try {
      const synth = window && window.speechSynthesis;
      if (!synth || !text) return;

      if (synth.speaking) {
        synth.cancel();
      }

      const utter = new SpeechSynthesisUtterance(String(text));
      utter.lang = 'en-US';
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      const voices = synth.getVoices ? synth.getVoices() : [];
      const preferred = voices.find(v => v.lang === 'en-US')
        || voices.find(v => (v.lang || '').toLowerCase().startsWith('en'))
        || voices[0];
      if (preferred) utter.voice = preferred;
      synth.speak(utter);

    } catch (err) {
      console.error('SpeechSynthesis error', err);
    }
  };

  return (
    <div className="voice-chat" aria-label="Voice Assistant">
      <div className="transcript" aria-live="polite">
        {transcript || 'HI! Press record and start speaking...'}
      </div>
      {confirmationPending && (
        <div className="confirmation">
          {llmResponseText}
          <div className="confirmation-controls">
          <button onClick={confirmBooking} aria-label={llmResponseText}>Confirm</button>
          <button onClick={() => setConfirmationPending(false)} aria-label="Cancel booking request">Cancel</button>
          </div>
        </div>
      )}
      <div className="controls">
        {!isRecording ? (
          <button onClick={startRecording} aria-label="Start recording">
            Record
          </button>
        ) : (
          <button onClick={stopRecording} aria-label="Stop recording">
            Stop
          </button>
        )}
      </div>

      
    </div>
  );
}

export default VoiceChat;
