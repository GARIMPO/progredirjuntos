import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { ProfileData } from "@/types";
import { Send, Edit2, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MessagePanelProps {
  sender: ProfileData;
  receiver: ProfileData;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ sender, receiver }) => {
  const { messages, sendMessage, updateMessage, deleteMessage } = useAppContext();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const relevantMessages = messages.filter(
    (msg) => msg.receiverId === receiver.id
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage({
        content: newMessage,
        senderId: sender.id,
        receiverId: receiver.id
      });
      setNewMessage("");
    }
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage({ id: messageId, content: currentContent });
  };

  const handleSaveEdit = async () => {
    if (editingMessage) {
      await updateMessage(editingMessage.id, { content: editingMessage.content });
      setEditingMessage(null);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    }
  };

  return (
    <>
      <Card className="w-full animate-fade-in mb-6">
        <CardHeader>
          <CardTitle className="text-center">Mensagens para {receiver.name}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-60 overflow-y-auto space-y-3">
          {relevantMessages.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma mensagem ainda. Seja o primeiro a escrever!</p>
          ) : (
            relevantMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === sender.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg relative group ${
                    msg.senderId === sender.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {editingMessage?.id === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={editingMessage.content}
                        onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                        className="bg-background text-foreground"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingMessage(null)}>
                          <X size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                          <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{msg.content}</p>
                      <span className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.senderId === sender.id && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleEditMessage(msg.id, msg.content)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDeleteMessage(msg.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="resize-none flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-primary">
            <Send size={18} />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessagePanel;
