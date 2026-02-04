import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist';
import './AIChatBot.css';

// Set worker source for pdfjs-dist
// Using a CDN is the most reliable way to avoid build configuration issues in Vite/Webpack
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const AIChatBot = ({ material }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I can help you understand this material. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState('');
    const [contextLoaded, setContextLoaded] = useState(false);
    const messagesEndRef = useRef(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learnassess.onrender.com/api';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Load context when material changes
    useEffect(() => {
        const loadContext = async () => {
            if (!material) return;

            setContextLoaded(false);
            try {
                if (material.contentType === 'pdf') {
                    // Fetch PDF and extract text
                    const token = localStorage.getItem('token');
                    const pdfUrl = `${API_BASE_URL}/materials/${material.id || material._id}/pdf`;

                    const response = await fetch(pdfUrl, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) throw new Error('Failed to fetch PDF');

                    const blob = await response.blob();
                    const arrayBuffer = await blob.arrayBuffer();

                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;

                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }

                    setContext(fullText);
                } else {
                    // Use text content directly
                    setContext(material.content || '');
                }
                setContextLoaded(true);
            } catch (error) {
                console.error('Error loading material context:', error);
                setContext('Error loading context. I may not be able to answer specific questions about this document.');
            }
        };

        loadContext();
    }, [material, API_BASE_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error('Gemini API Key is missing in frontend environment variables (VITE_GEMINI_API_KEY)');
            }

            if (!contextLoaded) {
                // Wait a bit or warn? Let's just proceed, context might be empty or loading
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const truncatedContext = context.substring(0, 30000); // Limit context size

            const prompt = `
            You are a helpful AI study assistant. Use the following material content to answer the user's question.
            If the answer is not in the material, say so, but try to be helpful based on general knowledge if related.
            
            Material Content:
            ${truncatedContext}
            
            User Question: ${userMessage}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'assistant', text: text }]);
        } catch (error) {
            console.error('Chat error:', error);
            let errorMsg = "Sorry, I'm having trouble connecting right now.";
            if (error.message.includes('API Key')) {
                errorMsg = "Configuration Error: API Key missing.";
            }
            setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open Chatbot"
            >
                <MessageCircle size={24} />
            </button>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <Bot size={20} />
                            <span>AI Assistant</span>
                        </div>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-content loading">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={contextLoaded ? "Ask a question..." : "Loading document context..."}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatBot;
