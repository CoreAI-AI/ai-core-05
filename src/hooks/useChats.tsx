import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
  images?: any;
}

const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);

const getStorageKey = (userId: string) => `coreai_chats_${userId}`;
const getMessagesKey = (userId: string) => `coreai_messages_${userId}`;

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

export const useChats = (userId: string | undefined) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);

  // Load chats from localStorage
  useEffect(() => {
    if (!userId) return;
    const stored = loadFromStorage<Chat[]>(getStorageKey(userId), []);
    setChats(stored);
    const storedMsgs = loadFromStorage<Record<string, Message[]>>(getMessagesKey(userId), {});
    setAllMessages(storedMsgs);
  }, [userId]);

  // Save chats whenever they change
  useEffect(() => {
    if (!userId) return;
    saveToStorage(getStorageKey(userId), chats);
  }, [chats, userId]);

  // Save messages whenever they change
  useEffect(() => {
    if (!userId) return;
    saveToStorage(getMessagesKey(userId), allMessages);
  }, [allMessages, userId]);

  const createChat = async (title: string): Promise<Chat | null> => {
    if (!userId) return null;
    const newChat: Chat = {
      id: generateId(),
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setMessages([]);
    return newChat;
  };

  const addMessage = async (chatId: string, content: string, isUser: boolean, images?: any[]): Promise<Message | null> => {
    const newMessage: Message = {
      id: generateId(),
      chat_id: chatId,
      content,
      is_user: isUser,
      created_at: new Date().toISOString(),
      ...(images && images.length > 0 ? { images } : {}),
    };
    setMessages(prev => [...prev, newMessage]);
    setAllMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));
    // Update chat timestamp
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, updated_at: new Date().toISOString() } : c));
    return newMessage;
  };

  const updateMessage = async (messageId: string, content: string, images?: any[]) => {
    const updater = (msgs: Message[]) =>
      msgs.map(msg =>
        msg.id === messageId
          ? { ...msg, content, ...(images ? { images } : {}) }
          : msg
      );
    setMessages(updater);
    setAllMessages(prev => {
      const updated = { ...prev };
      for (const chatId of Object.keys(updated)) {
        updated[chatId] = updater(updated[chatId]);
      }
      return updated;
    });
  };

  const deleteMessage = async (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setAllMessages(prev => {
      const updated = { ...prev };
      for (const chatId of Object.keys(updated)) {
        updated[chatId] = updated[chatId].filter(msg => msg.id !== messageId);
      }
      return updated;
    });
  };

  const startNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };

  const selectChat = async (chat: Chat) => {
    setCurrentChat(chat);
    setMessages(allMessages[chat.id] || []);
  };

  const deleteChat = async (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setAllMessages(prev => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
    toast.success('Chat deleted successfully');
  };

  const loadChats = async () => {};

  return {
    chats,
    currentChat,
    messages,
    loading,
    createChat,
    addMessage,
    updateMessage,
    deleteMessage,
    startNewChat,
    selectChat,
    loadChats,
    deleteChat,
  };
};
