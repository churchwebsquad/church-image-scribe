import React, { useState } from 'react';
import { PhotoDropzone } from '@/components/PhotoDropzone';
import { ChurchInfoForm } from '@/components/ChurchInfoForm';
import { PhotoCard, PhotoData } from '@/components/PhotoCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Church, CheckCircle } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [churchLocation, setChurchLocation] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Simulated AI alt-tag generation
  const generateAltTag = async (file: File, location: string, keywords: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const imageType = file.name.toLowerCase().includes('service') ? 'worship service' :
                     file.name.toLowerCase().includes('baptism') ? 'baptism ceremony' :
                     file.name.toLowerCase().includes('youth') ? 'youth ministry' :
                     file.name.toLowerCase().includes('choir') ? 'choir performance' :
                     'church community gathering';
    
    const locationPart = location ? ` at ${location}` : '';
    const keywordPart = keywords ? ` focusing on ${keywords.split(',')[0].trim()}` : '';
    
    return `${imageType}${locationPart}${keywordPart}, showing community fellowship and spiritual worship`;
  };

  const handleFilesUploaded = (files: File[]) => {
    const newPhotos = files.map(file => ({
      file,
      originalAlt: '',
      isProcessing: false,
      isApproved: false
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
    toast({
      title: "Photos Uploaded",
      description: `${files.length} photo${files.length !== 1 ? 's' : ''} added successfully`,
    });
  };

  const processAllPhotos = async () => {
    if (!churchLocation.trim()) {
      toast({
        title: "Church Location Required",
        description: "Please enter your church location before processing photos",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Mark all photos as processing
    setPhotos(prev => prev.map(photo => ({ ...photo, isProcessing: true })));

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        try {
          const altTag = await generateAltTag(photo.file, churchLocation, keywords);
          
          setPhotos(prev => prev.map(p => 
            p.file === photo.file 
              ? { ...p, aiGeneratedAlt: altTag, isProcessing: false }
              : p
          ));
          
          setProcessingProgress(((i + 1) / photos.length) * 100);
          
          toast({
            title: "Alt Tag Generated",
            description: `Generated alt tag for ${photo.file.name}`,
          });
        } catch (error) {
          setPhotos(prev => prev.map(p => 
            p.file === photo.file 
              ? { ...p, isProcessing: false }
              : p
          ));
          
          toast({
            title: "Generation Failed",
            description: `Failed to generate alt tag for ${photo.file.name}`,
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Processing Complete",
        description: `Generated alt tags for all ${photos.length} photos`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAltUpdate = (file: File, newAlt: string) => {
    setPhotos(prev => prev.map(photo =>
      photo.file === file ? { ...photo, aiGeneratedAlt: newAlt } : photo
    ));
    toast({
      title: "Alt Tag Updated",
      description: "Successfully updated the alt tag",
    });
  };

  const handleApprove = (file: File) => {
    setPhotos(prev => prev.map(photo =>
      photo.file === file ? { ...photo, isApproved: true } : photo
    ));
    toast({
      title: "Alt Tag Approved",
      description: "Alt tag approved and ready for use",
    });
  };

  const exportResults = () => {
    const approvedPhotos = photos.filter(photo => photo.isApproved);
    const results = approvedPhotos.map(photo => ({
      filename: photo.file.name,
      altTag: photo.aiGeneratedAlt
    }));
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `church-alt-tags-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `Exported ${approvedPhotos.length} approved alt tags`,
    });
  };

  const approvedCount = photos.filter(photo => photo.isApproved).length;
  const processedCount = photos.filter(photo => photo.aiGeneratedAlt && !photo.isProcessing).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-church-gold/5 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-church-gold flex items-center justify-center">
                <Church className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-church-gold bg-clip-text text-transparent">
                Church Photo Alt-Tag Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your church photos and let AI generate accurate, SEO-optimized alt tags 
              for your website in seconds
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Church Info Form */}
        <ChurchInfoForm
          churchLocation={churchLocation}
          setChurchLocation={setChurchLocation}
          keywords={keywords}
          setKeywords={setKeywords}
          isProcessing={isProcessing}
        />

        {/* Photo Upload */}
        <PhotoDropzone 
          onFilesUploaded={handleFilesUploaded}
          isProcessing={isProcessing}
        />

        {/* Processing Controls */}
        {photos.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Processing
              </CardTitle>
              <CardDescription>
                Generate alt tags for all uploaded photos using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  onClick={processAllPhotos}
                  disabled={isProcessing || processedCount === photos.length}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Generate Alt Tags'}
                </Button>
                
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {processedCount} of {photos.length} processed • {approvedCount} approved
                  </div>
                  {isProcessing && (
                    <Progress value={processingProgress} className="w-full max-w-md" />
                  )}
                </div>

                {approvedCount > 0 && (
                  <Button 
                    onClick={exportResults}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Results
                  </Button>
                )}
              </div>
              
              {approvedCount === photos.length && photos.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">All photos processed and approved!</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <PhotoCard
                  key={`${photo.file.name}-${index}`}
                  photo={photo}
                  onAltUpdate={handleAltUpdate}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Church className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground">
              Fill in your church information above and upload some photos to begin generating alt tags
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
