
import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from '../../services/geminiService';
import { CONTACT } from '../../constants';
import { Send, User, Bot, MapPin, Phone, Mail, Loader, Linkedin, FileText, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const CommView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Bonjour. Je suis l'assistant virtuel du CV d'Eric. Posez-moi des questions sur son parcours, ses compétences ou ses disponibilités.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateResponse(userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInShare = () => {
      // On force l'URL de production pour que le partage fonctionne partout
      const productionUrl = "https://eric-doidi-cv.vercel.app/";
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productionUrl)}`;
      window.open(shareUrl, '_blank', 'width=600,height=600');
  };

  const handlePdfDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const fileName = "CV_Eric_Doidi.pdf";
    
    try {
        // Vérifier si le fichier existe avant de tenter le téléchargement
        const response = await fetch(`/${fileName}`, { method: 'HEAD' });
        
        if (response.ok) {
            // Si le fichier existe, on lance le téléchargement forcé
            const link = document.createElement('a');
            link.href = `/${fileName}`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Si le fichier n'existe pas (404), on prévient l'utilisateur
            alert(`⚠️ FICHIER MANQUANT\n\nLe fichier "${fileName}" n'a pas encore été ajouté au projet.\n\nPOUR CORRIGER :\n1. Renommez votre CV en "${fileName}"\n2. Placez-le dans le dossier racine (public) avant de déployer sur Vercel.`);
        }
    } catch (error) {
        alert("Une erreur est survenue lors de la vérification du fichier.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto md:h-[calc(100vh-12rem)]">
        
        {/* Chat Section */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl flex flex-col h-[500px] md:h-full overflow-hidden relative shadow-sm order-1 lg:order-none">
             <div className="absolute inset-0 bg-slate-50/50 z-0 pointer-events-none"></div>
             
             <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-slate-700 font-bold">ASSISTANT IA</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">EN LIGNE</span>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 bg-slate-50/30">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[80%] flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                            <div className={`p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                                msg.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                            }`}>
                                <p>{msg.text}</p>
                                <span className={`text-[10px] opacity-70 block mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <div className="shrink-0 mt-1 mx-1">
                                {msg.sender === 'user' 
                                    ? <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><User size={14} className="text-blue-600"/></div>
                                    : <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><Bot size={14} className="text-emerald-600"/></div>
                                }
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center space-x-2 shadow-sm ml-12">
                             <Loader size={14} className="animate-spin text-blue-600" />
                             <span className="text-xs text-slate-500">Analyse en cours...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
             </div>

             <div className="p-4 bg-white border-t border-slate-200 z-10">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Interroger le système..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans placeholder-slate-400 transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Send size={18} />
                    </button>
                </div>
             </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm h-auto order-2 lg:order-none">
            <div>
                <h3 className="text-lg font-bold text-slate-800 font-mono mb-6 border-b border-slate-100 pb-2">COORDONNÉES</h3>
                <div className="space-y-6">
                    <div className="flex items-start space-x-3 group cursor-pointer">
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-slate-500">
                            <MapPin size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Localisation</div>
                            <div className="text-slate-800 text-sm font-medium truncate">{CONTACT.address}</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 group cursor-pointer">
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors text-slate-500">
                            <Phone size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Téléphone</div>
                            <div className="text-slate-800 text-sm font-mono font-bold">{CONTACT.phone}</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 group cursor-pointer">
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors text-slate-500">
                            <Mail size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</div>
                            <div className="text-slate-800 text-sm font-medium truncate">{CONTACT.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                 <button 
                    onClick={handleLinkedInShare}
                    className="w-full py-3 bg-[#0077b5] hover:bg-[#006396] text-white rounded-lg font-bold font-sans shadow-md hover:shadow-lg transition-all uppercase text-sm flex items-center justify-center group"
                >
                    <Linkedin size={18} className="mr-2" />
                    <span>Partager sur LinkedIn</span>
                </button>
                
                <button 
                    onClick={handlePdfDownload}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold font-mono transition-all uppercase text-sm flex items-center justify-center border border-slate-200 cursor-pointer hover:shadow-sm"
                >
                    <FileText size={18} className="mr-2" />
                    <span>[ TÉLÉCHARGER PDF ]</span>
                </button>
                <p className="text-[10px] text-center text-slate-400">Format standard pour archivage RH</p>
            </div>
        </div>
    </div>
  );
};

export default CommView;
