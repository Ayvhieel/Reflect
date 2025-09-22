import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, ExternalLink, Copy, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Phone number copied to clipboard",
    });
  };

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "Free and confidential support 24/7",
      international: false
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Text-based crisis support",
      international: false
    },
    {
      name: "International Association for Suicide Prevention",
      phone: "Visit iasp.info/resources",
      description: "Global crisis helplines directory",
      international: true
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-crisis-foreground">
            <Shield className="w-5 h-5" />
            You're Not Alone - Crisis Resources
          </DialogTitle>
          <DialogDescription className="text-base">
            If you're having thoughts of self-harm or suicide, please reach out for help immediately. 
            You matter, and there are people who want to support you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Emergency Notice */}
          <Card className="bg-crisis-background border-crisis-border">
            <CardContent className="p-4">
              <p className="font-medium text-crisis-foreground">
                🚨 If you are in immediate danger, please call your local emergency services (911 in the US) right away.
              </p>
            </CardContent>
          </Card>

          {/* Crisis Resources */}
          <div className="space-y-3">
            {crisisResources.map((resource, index) => (
              <Card key={index} className="bg-card/80">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{resource.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-journal-primary" />
                        <span className="font-mono text-lg">{resource.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!resource.international && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(resource.phone)}
                          className="gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Support */}
          <Card className="bg-gradient-to-br from-journal-accent/10 to-journal-success/10 border-0">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Additional Support Options:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Reach out to a trusted friend, family member, or counselor</li>
                <li>• Contact your healthcare provider or therapist</li>
                <li>• Visit your nearest emergency room</li>
                <li>• Use online crisis chat services</li>
                <li>• Consider calling a local mental health crisis line</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => window.open('https://findahelpline.com', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Find Local Resources
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};