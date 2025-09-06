import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Trash2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechErrorCount, setSpeechErrorCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true); // New state for voice output
  const messagesEndRef = useRef(null);
  const historySidebarRef = useRef(null);
  const recognitionRef = useRef(null);

  const apiKey = 'AIzaSyAjanHINMiM1_B4PA6LxdKmfO5tJqqG-hA';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 3;

  // Generate a 1-2 word summary from the first user message
  const generateSummary = (messages) => {
    const userMessage = messages.find((msg) => msg.role === 'user')?.text || '';
    if (!userMessage) return 'Chat Session';
    const words = userMessage.split(/\s+/).filter((word) => word.length > 2);
    return words.slice(0, 2).join(' ') || 'Chat Session';
  };

  // Format date as "Today", "Yesterday", or "MMM d"
  const formatRelativeDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
        setSpeechErrorCount(0);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechErrorCount((prev) => prev + 1);

        let errorMessage = 'Failed to recognize speech. Please try again.';
        if (event.error === 'network') {
          errorMessage =
            speechErrorCount + 1 >= MAX_RETRIES
              ? 'Persistent network issue with speech recognition. Please check your internet connection, try a different network, or use Chrome. Alternatively, use text input.'
              : 'Network issue with speech recognition. Retrying...';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
        }
        setMessages((prev) => [...prev, { role: 'system', text: errorMessage }]);

        if (event.error === 'network' && speechErrorCount + 1 < MAX_RETRIES) {
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              setMessages((prev) => [...prev, { role: 'system', text: 'Retrying speech recognition...' }]);
              recognitionRef.current.start();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Speech recognition is not supported in this browser. Please use text input.' },
      ]);
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speechErrorCount, isListening]);

  // Load chat history and current session from local storage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChatHistory(storedHistory);
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([]);
  }, []);

  // Save messages to chat history
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      const scrollPosition = historySidebarRef.current?.scrollTop || 0;
      setChatHistory((prev) => {
        const updatedHistory = prev.filter((session) => session.id !== currentSessionId);
        const newSession = { id: currentSessionId, messages, timestamp: new Date().toISOString() };
        const newHistory = [...updatedHistory, newSession];
        localStorage.setItem('chatHistory', JSON.stringify(newHistory));
        return newHistory;
      });
      setTimeout(() => {
        if (historySidebarRef.current) {
          historySidebarRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
    scrollToBottom();
  }, [messages, currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      await startVoiceInput();
    }
  };

  const startVoiceInput = async () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Speech recognition is not supported in this browser.' },
      ]);
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      if (permissionStatus.state === 'denied') {
        setMessages((prev) => [
          ...prev,
          { role: 'system', text: 'Microphone access denied. Please allow microphone access in your browser settings.' },
        ]);
        return;
      }

      if (permissionStatus.state === 'prompt') {
        setMessages((prev) => [...prev, { role: 'system', text: 'Requesting microphone access...' }]);
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setMessages((prev) => [...prev, { role: 'system', text: 'Listening...' }]);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Microphone permission error:', error);
      setIsListening(false);
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Failed to access microphone. Please check permissions or use text input.' },
      ]);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceOutput = () => {
    setIsVoiceOutputEnabled((prev) => !prev);
    if (isVoiceOutputEnabled) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) {
      setIsListening(false);
      return;
    }

    const userMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful campus assistant for a university platform. Provide concise and relevant answers about campus life, courses, events, or student resources. User query: ${text}`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const botText = data.candidates[0].content.parts[0].text;
      const botMessage = { role: 'bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);

      if (isVoiceOutputEnabled) {
        const utterance = new SpeechSynthesisUtterance(botText);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = { role: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsListening(false);
    }
  };

  const startNewChat = () => {
    const scrollPosition = historySidebarRef.current?.scrollTop || 0;
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    setIsSidebarOpen(false);
    setTimeout(() => {
      if (historySidebarRef.current) {
        historySidebarRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  };

  const loadChatSession = (sessionId) => {
    const scrollPosition = historySidebarRef.current?.scrollTop || 0;
    const session = chatHistory.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setIsSidebarOpen(false);
      setTimeout(() => {
        if (historySidebarRef.current) {
          historySidebarRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  };

  const deleteChatSession = (sessionId) => {
    const scrollPosition = historySidebarRef.current?.scrollTop || 0;
    setChatHistory((prev) => {
      const updatedHistory = prev.filter((session) => session.id !== sessionId);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    if (sessionId === currentSessionId) {
      startNewChat();
    } else {
      setTimeout(() => {
        if (historySidebarRef.current) {
          historySidebarRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-full mx-auto min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Campus Assistant Chatbot</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleSidebar}
            className="md:hidden px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {isSidebarOpen ? 'Hide History' : 'Show History'}
          </button>
          <button
            onClick={startNewChat}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        {/* Chat History Sidebar */}
        <div
          ref={historySidebarRef}
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-80 bg-gray-50 rounded-lg p-4 max-h-[70vh] md:max-h-[80vh] overflow-y-auto overflow-x-hidden transition-all duration-300`}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Chat History</h3>
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No chat history yet.</p>
          ) : (
            chatHistory
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer ${
                    session.id === currentSessionId ? 'bg-orange-100' : 'hover:bg-gray-200'
                  }`}
                >
                  <div
                    onClick={() => loadChatSession(session.id)}
                    className="flex items-center space-x-2 flex-1 min-w-0"
                  >
                    <MessageCircle size={16} className="text-orange-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700 truncate">
                      {generateSummary(session.messages)} - {formatRelativeDate(session.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteChatSession(session.id)}
                    className="p-1 text-red-500 hover:text-red-600 flex-shrink-0"
                    aria-label="Delete chat session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
          )}
        </div>
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : msg.role === 'system' ? 'text-center' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-2 sm:p-3 rounded-lg max-w-[80%] sm:max-w-[70%] ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : msg.role === 'system'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-800'
                  } text-sm sm:text-base`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block p-2 sm:p-3 rounded-lg bg-gray-200 text-gray-800 text-sm sm:text-base">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about campus life, courses, events... or use voice input"
                className="w-full p-3 sm:p-4 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 text-sm sm:text-base"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 ${isListening ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'} disabled:opacity-50`}
                  disabled={isLoading}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                  onClick={toggleVoiceOutput}
                  className={`p-2 ${isVoiceOutputEnabled ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-600'}`}
                  aria-label={isVoiceOutputEnabled ? 'Disable voice output' : 'Enable voice output'}
                >
                  {isVoiceOutputEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 sm:px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;