import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Loader2, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WriteEntry = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    
    try {
      // First, create the journal entry
      const { data: entry, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: content.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Then send to AI for analysis
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-journal', {
        body: {
          content: content.trim(),
          entryId: entry.id
        }
      });

      if (analysisError) {
        console.error('AI analysis failed:', analysisError);
        toast({
          title: "Entry saved",
          description: "Your entry was saved, but AI analysis failed. You can retry later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Entry saved",
          description: "Your journal entry has been analyzed and saved successfully.",
        });
      }

      // Navigate to reflection page
      navigate(`/reflection/${entry.id}`);

    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
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
            <div className="w-8 h-8 bg-gradient-to-br from-journal-primary to-journal-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">Write New Entry</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-journal">
            <CardHeader>
              <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
              <CardDescription>
                Take your time to express your thoughts and emotions. Your entries are completely private and secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Textarea
                    id="content_input"
                    placeholder="Start writing about your day, your thoughts, or anything on your mind..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] text-base leading-relaxed bg-background/50 border-0 focus:ring-2 focus:ring-journal-primary/20 resize-none"
                    required
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{content.length} characters</span>
                    <span>AI analysis will be performed after saving</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    id="btn_submit"
                    type="submit" 
                    className="bg-gradient-to-r from-journal-primary to-journal-secondary hover:shadow-journal transition-all duration-300 gap-2"
                    disabled={loading || !content.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Save & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card className="mt-6 bg-gradient-to-br from-journal-accent/10 to-journal-success/10 border-0">
            <CardHeader>
              <CardTitle className="text-lg">Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Write freely without worrying about grammar or structure</li>
                <li>• Include specific details about your experiences and emotions</li>
                <li>• Don't censor yourself - this is your private space</li>
                <li>• Try to identify what triggered certain feelings</li>
                <li>• Consider what you're grateful for or what went well</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WriteEntry;