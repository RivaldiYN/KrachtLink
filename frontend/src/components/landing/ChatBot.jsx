import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      ChatBubbleLeftRightIcon,
      XMarkIcon,
      PaperAirplaneIcon,
      UserIcon,
      ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const ChatBot = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([
            {
                  id: 1,
                  text: "Hi! Saya KrachBot, asisten virtual KrachtLink. Ada yang bisa saya bantu?",
                  sender: "bot",
                  timestamp: new Date(),
            },
      ]);
      const [inputText, setInputText] = useState("");
      const [isTyping, setIsTyping] = useState(false);
      const messagesEndRef = useRef(null);

      const quickReplies = [
            "Bagaimana cara bergabung?",
            "Apa itu KrachtLink?",
            "Bagaimana sistem pembayaran?",
            "Syarat menjadi member",
      ];

      const botResponses = {
            "bagaimana cara bergabung":
                  "Untuk bergabung dengan KrachtLink, klik tombol 'Join Sekarang' di website kami, isi formulir pendaftaran, dan tunggu verifikasi dari tim kami. Prosesnya biasanya memakan waktu 1-2 hari kerja.",
            "apa itu krachtlink":
                  "KrachtLink adalah platform yang menghubungkan brand dengan content creator untuk kampanye marketing yang efektif. Kami menyediakan sistem yang mudah untuk mengelola campaign, tracking performance, dan pembayaran otomatis.",
            "sistem pembayaran":
                  "Kami menggunakan sistem pembayaran digital yang aman. Member bisa withdraw earnings mereka melalui bank transfer, e-wallet, atau PayPal dengan minimum withdraw Rp 50,000.",
            "syarat menjadi member":
                  "Syarat menjadi member: 1) Memiliki akun social media aktif, 2) Followers minimal 1000, 3) Berusia minimal 17 tahun, 4) WNI atau berdomisili di Indonesia, 5) Memiliki rekening bank atas nama sendiri.",
            default:
                  "Maaf, saya belum memahami pertanyaan Anda. Silakan hubungi tim support kami di support@krachtlink.com untuk bantuan lebih lanjut.",
      };

      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(() => {
            scrollToBottom();
      }, [messages]);

      const handleSendMessage = async (text = inputText) => {
            if (!text.trim()) return;

            const userMessage = {
                  id: Date.now(),
                  text: text,
                  sender: "user",
                  timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInputText("");
            setIsTyping(true);

            // Simulate bot thinking time
            setTimeout(() => {
                  const response = getBotResponse(text.toLowerCase());
                  const botMessage = {
                        id: Date.now() + 1,
                        text: response,
                        sender: "bot",
                        timestamp: new Date(),
                  };

                  setMessages((prev) => [...prev, botMessage]);
                  setIsTyping(false);
            }, 1500);
      };

      const getBotResponse = (text) => {
            for (const [key, response] of Object.entries(botResponses)) {
                  if (key !== "default" && text.includes(key)) {
                        return response;
                  }
            }
            return botResponses.default;
      };

      const handleKeyPress = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
            }
      };

      return (
            <>
                  {/* Chat Button */}
                  <motion.button
                        onClick={() => setIsOpen(true)}
                        className={`fixed bottom-6 right-6 z-50 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors ${isOpen ? "hidden" : "block"
                              }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 2 }}
                  >
                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </motion.button>

                  {/* Chat Window */}
                  <AnimatePresence>
                        {isOpen && (
                              <motion.div
                                    initial={{ opacity: 0, y: 100, scale: 0.3 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 100, scale: 0.3 }}
                                    className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
                              >
                                    {/* Header */}
                                    <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                                      <ComputerDesktopIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                      <h3 className="font-semibold">KrachBot</h3>
                                                      <p className="text-xs opacity-90">
                                                            Online - Biasanya membalas dalam hitungan menit
                                                      </p>
                                                </div>
                                          </div>
                                          <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
                                          >
                                                <XMarkIcon className="w-5 h-5" />
                                          </button>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                          {messages.map((message) => (
                                                <div
                                                      key={message.id}
                                                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                                            }`}
                                                >
                                                      <div
                                                            className={`flex items-start space-x-2 max-w-xs ${message.sender === "user"
                                                                        ? "flex-row-reverse space-x-reverse"
                                                                        : ""
                                                                  }`}
                                                      >
                                                            <div
                                                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user"
                                                                              ? "bg-primary-600"
                                                                              : "bg-gray-200 dark:bg-gray-700"
                                                                        }`}
                                                            >
                                                                  {message.sender === "user" ? (
                                                                        <UserIcon className="w-5 h-5 text-white" />
                                                                  ) : (
                                                                        <ComputerDesktopIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                                  )}
                                                            </div>
                                                            <div
                                                                  className={`p-3 rounded-2xl ${message.sender === "user"
                                                                              ? "bg-primary-600 text-white"
                                                                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                                        }`}
                                                            >
                                                                  <p className="text-sm">{message.text}</p>
                                                                  <p
                                                                        className={`text-xs mt-1 ${message.sender === "user"
                                                                                    ? "text-primary-100"
                                                                                    : "text-gray-500 dark:text-gray-400"
                                                                              }`}
                                                                  >
                                                                        {message.timestamp.toLocaleTimeString([], {
                                                                              hour: "2-digit",
                                                                              minute: "2-digit",
                                                                        })}
                                                                  </p>
                                                            </div>
                                                      </div>
                                                </div>
                                          ))}

                                          {/* Typing Indicator */}
                                          {isTyping && (
                                                <div className="flex justify-start">
                                                      <div className="flex items-start space-x-2 max-w-xs">
                                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                                  <ComputerDesktopIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                                                                  <div className="flex space-x-1">
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                                                        <div
                                                                              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                                                                              style={{ animationDelay: "0.2s" }}
                                                                        ></div>
                                                                        <div
                                                                              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                                                                              style={{ animationDelay: "0.4s" }}
                                                                        ></div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          )}
                                          <div ref={messagesEndRef} />
                                    </div>

                                    {/* Quick Replies */}
                                    {messages.length === 1 && (
                                          <div className="px-4 py-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                      Pertanyaan umum:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                      {quickReplies.map((reply, index) => (
                                                            <button
                                                                  key={index}
                                                                  onClick={() => handleSendMessage(reply)}
                                                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                                                            >
                                                                  {reply}
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>
                                    )}

                                    {/* Input */}
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                          <div className="flex space-x-2">
                                                <input
                                                      type="text"
                                                      value={inputText}
                                                      onChange={(e) => setInputText(e.target.value)}
                                                      onKeyPress={handleKeyPress}
                                                      placeholder="Ketik pesan Anda..."
                                                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                />
                                                <button
                                                      onClick={() => handleSendMessage()}
                                                      disabled={!inputText.trim() || isTyping}
                                                      className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                      <PaperAirplaneIcon className="w-5 h-5" />
                                                </button>
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </>
      );
};

export default ChatBot;
