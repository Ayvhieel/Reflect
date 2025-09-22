import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TestTube, Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TestGroq = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTest = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-journal', {
        body: {
          content: input.trim(),
          isTest: true
        }
      });

      if (error) {
        throw error;
      }

      setOutput(JSON.stringify(data.raw_response || data, null, 2));
      
      toast({
        title: "Test completed",
        description: "AI response received successfully",
      });

    } catch (error) {
      console.error('Test failed:', error);
      setOutput(`Error: ${error.message}`);
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-journal-warning to-orange-500 rounded-lg flex items-center justify-center">
              <TestTube className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">Test Groq AI</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-journal">
            <CardHeader>
              <CardTitle className="text-2xl">Debug AI Responses</CardTitle>
              <CardDescription>
                Test the Groq AI analysis with sample journal entries. This shows the raw JSON response for debugging purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="test_input" className="text-sm font-medium">
                  Test Input
                </label>
                <Textarea
                  id="test_input"
                  placeholder="Enter a sample journal entry to test AI analysis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px] bg-background/50 border-0 focus:ring-2 focus:ring-journal-primary/20"
                />
              </div>

              <Button 
                id="test_btn"
                onClick={handleTest}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-journal-warning to-orange-500 hover:shadow-journal transition-all duration-300 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    Test AI Analysis
                  </>
                )}
              </Button>

              {output && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Raw AI Response
                  </label>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                    {output}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Inputs */}
          <Card className="bg-gradient-to-br from-journal-accent/10 to-journal-success/10 border-0">
            <CardHeader>
              <CardTitle className="text-lg">Sample Test Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Positive Entry:</h4>
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded">
                    "Had an amazing day at work today! Successfully completed the big project I've been working on for weeks. Feeling really proud and accomplished. My team was so supportive throughout the process."
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Anxious Entry:</h4>
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded">
                    "I can't stop worrying about the presentation tomorrow. My heart is racing and I keep thinking about all the things that could go wrong. Haven't been sleeping well because of the stress."
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Crisis Test (for safety features):</h4>
                  <p className="text-sm text-muted-foreground bg-crisis-background p-3 rounded border border-crisis-border">
                    "I don't want to be here anymore. Everything feels hopeless and I don't see the point in continuing."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestGroq;