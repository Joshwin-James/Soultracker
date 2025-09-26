
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sun, Zap, Waves, CloudRain, Frown, Volume2, Mic, Video, VolumeX, MicOff, VideoOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage, Emotion } from '../types';
import { detectEmotion, getSoulResponse, logEmotion, updateUserPoints, saveChatMessage } from '../services/mockApi';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// SpeechRecognition might not exist on all window objects, handle vendor prefixes
// Fix: Cast `window` to `any` to access non-standard SpeechRecognition property.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;


const SoulAvatar: React.FC<{ currentEmotion: Emotion }> = ({ currentEmotion }) => {
    const emotionMap: Record<Emotion, React.ReactNode> = {
        [Emotion.Joy]: <Sun className="w-5 h-5 text-yellow-400" />,
        [Emotion.Calm]: <Waves className="w-5 h-5 text-blue-400" />,
        [Emotion.Anxiety]: <Zap className="w-5 h-5 text-purple-400" />,
        [Emotion.Frustration]: <Frown className="w-5 h-5 text-orange-400" />,
        [Emotion.Sadness]: <CloudRain className="w-5 h-5 text-gray-400" />,
        [Emotion.Neutral]: <></>,
    };

    return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-purple-300 to-calm-blue-300 flex items-center justify-center shadow-md relative shrink-0">
            <span className="text-2xl">✨</span>
            <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow animate-ping-short">
                {emotionMap[currentEmotion]}
            </div>
        </div>
    );
};

const MessageBubble: React.FC<{ message: ChatMessage; onBoosterComplete: (boosterId: string, points: number) => void }> = ({ message, onBoosterComplete }) => {
    const isSoul = message.sender === 'soul';

    const handleComplete = () => {
        if (message.moodBooster) {
            onBoosterComplete(message.moodBooster.id, 10);
        }
    };
    
    return (
        <div className={`flex items-end gap-3 my-2 ${isSoul ? 'justify-start' : 'justify-end'}`}>
            {isSoul && <SoulAvatar currentEmotion={message.emotion || Emotion.Neutral} />}
            <div className={`max-w-xs md:max-w-md p-3 text-sm md:text-base ${isSoul 
                ? 'bg-white shadow text-gray-800 rounded-r-2xl rounded-tl-lg' 
                : 'bg-warm-purple-500 text-white rounded-l-2xl rounded-tr-lg'
            }`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.moodBooster && !message.moodBooster.completed && (
                    <div className="mt-2 pt-2 border-t border-warm-purple-300">
                        <p className={`text-xs font-semibold mb-2 ${isSoul ? 'text-warm-purple-700' : 'text-warm-purple-100'}`}>✨ Mood Booster</p>
                        <p className="text-sm italic mb-3">{message.moodBooster.text}</p>
                        <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600 text-xs py-1 px-3 w-auto">Mark as Complete (+10 pts)</Button>
                    </div>
                )}
            </div>
        </div>
    );
};


const ChatPage: React.FC = () => {
    const { user, setUser } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSoulTyping, setIsSoulTyping] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [recognition, setRecognition] = useState<any | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
       if (user?.chatHistory) {
            if (user.chatHistory.length === 0) {
                 setMessages([{ id: 1, sender: 'soul', text: "Hello! I'm Soul. How are you feeling today? 😊", emotion: Emotion.Neutral }]);
            } else {
                setMessages(user.chatHistory);
            }
       }
    }, [user?.id]);

    useEffect(scrollToBottom, [messages]);
    
    // --- Feature Effects ---

    // Initialize Speech Recognition
    useEffect(() => {
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            return;
        }
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        rec.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        rec.onend = () => {
            setIsListening(false);
        }
        setRecognition(rec);
    }, []);

    // Text-to-Speech Effect
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (isTtsEnabled && lastMessage?.sender === 'soul' && lastMessage.text) {
            const utterance = new SpeechSynthesisUtterance(lastMessage.text);
            speechSynthesis.cancel(); // Stop any previous speech
            speechSynthesis.speak(utterance);
        }
    }, [messages, isTtsEnabled]);
    
    // Camera Effect
    useEffect(() => {
        const manageCamera = async () => {
            if (isCameraEnabled) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera access denied:", err);
                    alert("Camera access was denied. Please enable it in your browser settings to use this feature.");
                    setIsCameraEnabled(false);
                }
            } else {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }
                }
            }
        };
        manageCamera();

        return () => { // Cleanup on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraEnabled]);

    // --- Handlers ---
    const handleListen = () => {
        if (!recognition) return;
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const captureFrame = (): string | undefined => {
        if (!isCameraEnabled || !videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
            return undefined;
        }
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.8);
        }
        return undefined;
    };

    const handleSend = async () => {
        if (input.trim() === '' || !user || isSoulTyping) return;

        const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        saveChatMessage(user.id, userMessage); // Persist user message

        const emotion = detectEmotion(input);
        if (emotion !== Emotion.Neutral) {
            logEmotion(user.id, emotion); // This is async but we don't need to wait
        }
        
        const currentInput = input;
        setInput('');
        setIsSoulTyping(true);

        const imageBase64 = captureFrame();

        const soulResponse = await getSoulResponse(user.id, currentInput, imageBase64);
        const soulMessage: ChatMessage = { id: Date.now() + 1, ...soulResponse };
        
        setMessages(prev => [...prev, soulMessage]);
        const updatedUser = await saveChatMessage(user.id, soulMessage); // Persist soul message
        setUser(updatedUser); // Update user context with latest history
        setIsSoulTyping(false);
    };
    
    const handleBoosterComplete = async (boosterId: string, points: number) => {
        if (!user) return;
        
        const updatedMessages = messages.map(msg => 
            msg.moodBooster?.id === boosterId 
            ? { ...msg, moodBooster: { ...msg.moodBooster, completed: true } } 
            : msg
        );
        setMessages(updatedMessages);

        // Update the history in the database
        if (user) {
            user.chatHistory = updatedMessages;
            // The points will be added, and this will also save the updated user object
            const updatedUserWithPoints = await updateUserPoints(user.id, user.userPoints + points);
            setUser(updatedUserWithPoints);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] bg-white rounded-lg shadow-xl relative">
            {isCameraEnabled && (
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg z-10 animate-fade-in">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>

            <div className="flex-1 p-4 overflow-y-auto bg-calm-blue-50">
                 {messages.map((msg) => <MessageBubble key={msg.id} message={msg} onBoosterComplete={handleBoosterComplete}/>)}
                 {isSoulTyping && (
                    <div className="flex items-end gap-3 my-2 justify-start">
                        <SoulAvatar currentEmotion={Emotion.Neutral} />
                        <div className="max-w-xs md:max-w-md p-3 rounded-r-2xl rounded-tl-lg bg-white shadow">
                            <Spinner />
                        </div>
                    </div>
                 )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                    <button onClick={() => setIsTtsEnabled(p => !p)} title={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"} className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${isTtsEnabled ? 'text-warm-purple-600' : 'text-gray-500'}`}>
                        {isTtsEnabled ? <Volume2 /> : <VolumeX />}
                    </button>
                    {SpeechRecognition && (
                        <button onClick={handleListen} title={isListening ? "Stop Listening" : "Start Listening"} className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                            {isListening ? <MicOff /> : <Mic />}
                        </button>
                    )}
                    <button onClick={() => setIsCameraEnabled(p => !p)} title={isCameraEnabled ? "Disable Camera" : "Enable Camera"} className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${isCameraEnabled ? 'text-warm-purple-600' : 'text-gray-500'}`}>
                        {isCameraEnabled ? <Video /> : <VideoOff />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tell me what's on your mind..."
                        className="w-full p-3 pr-12 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-warm-purple-400"
                        disabled={isSoulTyping}
                    />
                    <button onClick={handleSend} disabled={isSoulTyping || input.trim() === ''} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 my-auto mr-1 rounded-full bg-warm-purple-500 hover:bg-warm-purple-600 text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;