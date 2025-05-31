"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";

import { useGetMessages } from "../api/use-get-messages";
import { useSendMessage } from "../api/use-send-message";
import { useGetChatRoom } from "../api/use-get-chat-room";
import { useCreateChatRoom } from "../api/use-create-chat-room";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatRoomProps {
  projectId: string;
  workspaceId: string;
  projectName: string;
}

interface MessageData {
  $id: string;
  authorName: string;
  content: string;
  createdAt?: string;
  $createdAt?: string;
}

export const ChatRoom = ({ projectId, workspaceId, projectName }: ChatRoomProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: room } = useGetChatRoom({ projectId });
  const { data: messagesData, isLoading } = useGetMessages({ projectId });
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: createRoom } = useCreateChatRoom();

  const messages = messagesData?.documents || [];

  // Create room if it doesn't exist
  useEffect(() => {
    if (room === null) {
      createRoom({
        json: {
          projectId,
          workspaceId,
          name: `${projectName} Chat`,
          description: `Chat room for ${projectName} project`,
        }
      });
    }
  }, [room, createRoom, projectId, workspaceId, projectName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!message.trim() || isSending) return;

    sendMessage({
      json: {
        content: message.trim(),
        projectId,
      }
    }, {
      onSuccess: () => {
        setMessage("");
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden h-full">
        <Card className="h-full border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-card/60 to-card/40">
            <CardTitle className="flex items-center gap-3">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full animate-pulse" />
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Loading Chat...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-2 h-2 bg-green-400/60 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-full max-h-[480px]">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/3 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/3 to-transparent rounded-full blur-3xl" />
      
      <Card className="h-full border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm shadow-sm relative flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-border/30 bg-gradient-to-r from-card/60 to-card/40 flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="w-0.5 h-4 bg-gradient-to-b from-green-400 to-blue-400 rounded-full animate-pulse" />
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{projectName}</span>
            <span className="text-xs text-muted-foreground/60 font-normal">Team Chat</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4 min-h-[220px] max-h-[320px]">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-border/20">
                      <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full animate-ping" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Welcome to the team chat!</h3>
                  <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
                    This is the beginning of your team's conversation in <span className="font-medium text-foreground">{projectName}</span>
                  </p>
                </div>
              ) : (
                messages.map((msg: any, index: number) => {
                  const isFirst = index === 0 || messages[index - 1]?.authorName !== msg.authorName;
                  const isLast = index === messages.length - 1 || messages[index + 1]?.authorName !== msg.authorName;
                  
                  return (
                    <div key={msg.$id} className={`flex gap-3 group ${!isFirst ? 'mt-1' : ''}`}>
                      {isFirst ? (
                        <Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border/20 transition-all duration-200 group-hover:ring-border/30">
                          <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-100/50 to-purple-100/50 text-foreground border border-border/10">
                            {msg.authorName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        {isFirst && (
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-foreground">
                              {msg.authorName || 'Unknown User'}
                            </span>
                            <span className="text-xs text-muted-foreground/60 font-normal">
                              {format(new Date(msg.createdAt || msg.$createdAt || new Date()), "MMM d, h:mm a")}
                            </span>
                          </div>
                        )}
                        
                        <div className={`relative ${isLast ? 'mb-3' : ''}`}>
                          <div className="bg-gradient-to-r from-background/60 to-background/40 backdrop-blur-sm border border-border/20 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-border/30">
                            <div className="text-sm text-foreground leading-relaxed break-words">
                              {msg.content}
                            </div>
                          </div>
                          
                          {/* Message connector */}
                          {!isLast && (
                            <div className="absolute -bottom-1 left-4 w-0.5 h-3 bg-gradient-to-b from-border/20 to-transparent" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border/30 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm p-4 flex-shrink-0">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                  className="resize-none border-border/20 bg-background/30 backdrop-blur-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all duration-200 placeholder:text-muted-foreground/50"
                />
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isSending}
                size="sm"
                className="h-12 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isSending && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground/60">
                <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
                Sending message...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 