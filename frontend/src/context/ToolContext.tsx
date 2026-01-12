import React, { createContext, useContext, useState, useEffect } from 'react';
import { toolsApi } from '../lib/api';
import type { Tool } from '../data/tools';

interface ToolContextType {
    tools: Tool[];
    loading: boolean;
    error: string | null;
    likeTool: (id: string) => Promise<void>;
    unlikeTool: (id: string) => Promise<void>;
    addComment: (id: string, text: string, username?: string) => Promise<void>;
    refreshTools: () => Promise<void>;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTools = async () => {
        try {
            setLoading(true);
            const response = await toolsApi.getAll();
            setTools(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tools');
            console.error('Error fetching tools:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    const likeTool = async (id: string) => {
        try {
            const response = await toolsApi.like(id);
            setTools(prev => prev.map(t => t.id === id ? response.data : t));
        } catch (err) {
            console.error('Error liking tool:', err);
        }
    };

    const unlikeTool = async (id: string) => {
        try {
            const response = await toolsApi.unlike(id);
            setTools(prev => prev.map(t => t.id === id ? response.data : t));
        } catch (err) {
            console.error('Error unliking tool:', err);
        }
    };

    const addComment = async (id: string, text: string, username?: string) => {
        try {
            const response = await toolsApi.addComment(id, text, username);
            setTools(prev => prev.map(t => t.id === id ? response.data : t));
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    return (
        <ToolContext.Provider value={{ tools, loading, error, likeTool, unlikeTool, addComment, refreshTools: fetchTools }}>
            {children}
        </ToolContext.Provider>
    );
};

export const useTools = () => {
    const context = useContext(ToolContext);
    if (context === undefined) {
        throw new Error('useTools must be used within a ToolProvider');
    }
    return context;
};
