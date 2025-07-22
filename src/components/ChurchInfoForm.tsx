import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Tag } from 'lucide-react';

interface ChurchInfoFormProps {
  churchLocation: string;
  setChurchLocation: (location: string) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  isProcessing?: boolean;
}

export const ChurchInfoForm: React.FC<ChurchInfoFormProps> = ({
  churchLocation,
  setChurchLocation,
  keywords,
  setKeywords,
  isProcessing
}) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-church-gold/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          Church Information
        </CardTitle>
        <CardDescription>
          Provide context to help AI generate accurate, location-specific alt tags
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="church-location" className="text-sm font-medium">
            Church Location *
          </Label>
          <Input
            id="church-location"
            type="text"
            value={churchLocation}
            onChange={(e) => setChurchLocation(e.target.value)}
            placeholder="e.g., First Baptist Church, Springfield, Illinois"
            className="transition-all duration-200"
            disabled={isProcessing}
            required
          />
          <p className="text-xs text-muted-foreground">
            Be specific with church name, city, and state for better alt-tag accuracy
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            SEO Keywords
          </Label>
          <Textarea
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., community worship, Sunday service, church fellowship, baptism, youth ministry"
            className="min-h-20 resize-none transition-all duration-200"
            disabled={isProcessing}
          />
          <p className="text-xs text-muted-foreground">
            Enter relevant keywords separated by commas to optimize for search engines
          </p>
        </div>
      </CardContent>
    </Card>
  );
};