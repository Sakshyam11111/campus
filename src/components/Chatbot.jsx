import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Trash2, Mic, MicOff } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechErrorCount, setSpeechErrorCount] = useState(0);
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
        setSpeechErrorCount(0); // Reset error count on success
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

        // Retry on network error if under max retries
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
      // Check microphone permission
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

      // Request microphone access
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

      // Speak the response
      const utterance = new SpeechSynthesisUtterance(botText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-8xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Campus Assistant Chatbot</h2>
        <button
          onClick={startNewChat}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          New Chat
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Chat History Sidebar */}
        <div ref={historySidebarRef} className="w-full md:w-1/4 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto overflow-x-hidden">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat History</h3>
          {chatHistory.length === 0 ? (
            <p className="text-gray-500">No chat history yet.</p>
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
                    <MessageCircle size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-700 truncate">
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
        <div className="flex-1">
          <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : msg.role === 'system' ? 'text-center' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : msg.role === 'system'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
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
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                onClick={toggleVoiceInput}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${
                  isListening ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'
                } disabled:opacity-50`}
                disabled={isLoading}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
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