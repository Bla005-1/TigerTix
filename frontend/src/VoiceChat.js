// frontend/src/components/VoiceChat.js
import React, { useState } from 'react';
import './VoiceChat.css';
/**
 * VoiceChat component
 * Handles speech input/output and interaction with the LLM microservice.
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

  // --- Step 3: Handle speech recognition result ---
  const handleRecognitionResult = async (text) => {
    const payload = (text || '').trim();
    if (!payload) return;
    try {
      const res = await fetch('http://localhost:8001/api/llm/parse', {
        method: 'POST',
        body: payload,
      });
      if (!res.ok) throw new Error(`LLM parse failed: ${res.status}`);
      const data = await res.json();
      const parsed = {
        event_id: data.event_id,
        event: data.event,
        tickets: typeof data.tickets === 'string' ? parseInt(data.tickets, 10) || 1 : (data.tickets || 1),
      };
      setLlmResponse(parsed);
      setLlmResponseText(`Confirm booking for ${llmResponse.tickets} tickets to ${llmResponse.event}?`)
      setConfirmationPending(true);
      speak(llmResponseText)
    } catch (err) {
      console.error('Error contacting LLM service', err);
      setStatusMessage('Server error. Please try again.');
    }
  };

  // --- Step 4: Confirm booking ---
  const confirmBooking = async () => {
    try {
      const eventID = llmResponse?.event_id;
      const eventName = llmResponse?.event;
      const ticketsRequested = Number(llmResponse?.tickets) || 1;
      // TODO: Signal the backend to book 
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
      utter.rate = 1.0;   // natural pace for clarity
      utter.pitch = 1.0;  // neutral tone
      utter.volume = 1.0; // full volume, user controls system volume

      const speakWithBestVoice = () => {
        const voices = synth.getVoices ? synth.getVoices() : [];
        const preferred = voices.find(v => v.lang === 'en-US')
          || voices.find(v => (v.lang || '').toLowerCase().startsWith('en'))
          || voices[0];
        if (preferred) utter.voice = preferred;
        synth.speak(utter);
      };

      const voices = synth.getVoices ? synth.getVoices() : [];
      if (!voices || voices.length === 0) {
        const once = () => {
          synth.removeEventListener('voiceschanged', once);
          try { speakWithBestVoice(); } catch (_) { synth.speak(utter); }
        };
        synth.addEventListener('voiceschanged', once);
        if (synth.getVoices) synth.getVoices();
        synth.speak(utter);
      } else {
        speakWithBestVoice();
      }
    } catch (err) {
      console.error('SpeechSynthesis error', err);
    }
  };

  return (
    <div className="voice-chat" aria-label="Voice Assistant">
      {/* Transcript display */}
      <div className="transcript" aria-live="polite">
        {transcript || 'Press record and start speaking...'}
      </div>
      {/* Confirmation UI */}
      {confirmationPending && (
        <div className="confirmation">
          {llmResponseText}
          <div className="confirmation-controls">
          <button onClick={confirmBooking}>Confirm</button>
          <button onClick={() => setConfirmationPending(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/* Control buttons */}
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
