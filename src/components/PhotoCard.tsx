import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, Edit3, Loader2, Sparkles } from 'lucide-react';

export interface PhotoData {
  file: File;
  originalAlt?: string;
  aiGeneratedAlt?: string;
  isProcessing?: boolean;
  isApproved?: boolean;
}

interface PhotoCardProps {
  photo: PhotoData;
  onAltUpdate: (file: File, newAlt: string) => void;
  onApprove: (file: File) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ 
  photo, 
  onAltUpdate, 
  onApprove 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlt, setEditedAlt] = useState(photo.aiGeneratedAlt || '');

  const handleSaveEdit = () => {
    onAltUpdate(photo.file, editedAlt);
    setIsEditing(false);
  };

  const handleApprove = () => {
    onApprove(photo.file);
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={URL.createObjectURL(photo.file)}
          alt={photo.aiGeneratedAlt || photo.file.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm truncate pr-2">
            {photo.file.name}
          </h4>
          <div className="flex gap-1">
            {photo.isProcessing && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Processing
              </Badge>
            )}
            {photo.aiGeneratedAlt && !photo.isProcessing && (
              <Badge className="text-xs bg-gradient-to-r from-primary to-church-gold">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            )}
            {photo.isApproved && (
              <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Alt Tag:</label>
          
          {photo.isProcessing ? (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Generating alt tag...
              </span>
            </div>
          ) : isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedAlt}
                onChange={(e) => setEditedAlt(e.target.value)}
                className="min-h-20 text-sm resize-none"
                placeholder="Edit the alt tag..."
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md min-h-16">
                <p className="text-sm">
                  {photo.aiGeneratedAlt || 'No alt tag generated yet'}
                </p>
              </div>
              
              {photo.aiGeneratedAlt && !photo.isApproved && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleApprove}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-3 h-3" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};