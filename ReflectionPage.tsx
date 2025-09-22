import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, AlertTriangle, Calendar, Brain, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CrisisModal } from '@/components/CrisisModal';

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  themes: any;
  emotion: any;
  reflection: string;
  evidence: any;
  crisis_flag: boolean;
  confidence: number;
  language: string;
  status: string;
}

const ReflectionPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!entryId || !user) return;

    const fetchEntry = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', entryId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching entry:', error);
          navigate('/');
          return;
        }

        setEntry(data);
        
        // Show crisis modal if crisis flag is set
        if (data.crisis_flag) {
          setShowCrisisModal(true);
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId, user, navigate]);

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      happy: 'bg-emotion-happy',
      sad: 'bg-emotion-sad',
      anxious: 'bg-emotion-anxious',
      calm: 'bg-emotion-calm',
      angry: 'bg-emotion-angry',
    };
    return colorMap[emotion?.toLowerCase()] || 'bg-muted';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-journal-primary to-journal-secondary rounded-2xl flex items-center justify-center animate-pulse mb-4 mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your reflection...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Entry not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

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
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">AI Reflection</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Entry Header */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-journal">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                {formatDate(entry.created_at)}
              </div>
              <CardTitle className="text-2xl">Your Journal Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Warning */}
          {entry.crisis_flag && (
            <Card className="bg-crisis-background border-crisis-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-crisis-foreground" />
                  <CardTitle className="text-crisis-foreground">Safety Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-crisis-foreground font-medium">
                  {entry.reflection}
                </p>
                <Button 
                  onClick={() => setShowCrisisModal(true)}
                  className="mt-4 bg-crisis-foreground text-crisis-background hover:opacity-90"
                >
                  View Resources
                </Button>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {!entry.crisis_flag && (
            <>
              {/* AI Reflection */}
              <Card className="bg-gradient-to-br from-journal-accent/10 to-journal-success/10 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-journal-accent" />
                    AI Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">
                    {entry.reflection}
                  </p>
                </CardContent>
              </Card>

              {/* Emotion & Themes */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-journal-primary" />
                      Detected Emotion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {entry.emotion?.label ? (
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getEmotionColor(entry.emotion.label)}`} />
                        <span className="text-lg font-medium capitalize">
                          {entry.emotion.label}
                        </span>
                        <Badge variant="secondary">
                          {Math.round(entry.emotion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No emotion detected</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Key Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {entry.themes?.length > 0 ? (
                      <div className="space-y-3">
                        {entry.themes.map((theme, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="font-medium capitalize">{theme.name}</span>
                            <Badge variant="outline">
                              {Math.round(theme.confidence * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No themes identified</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Evidence */}
              {entry.evidence?.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Supporting Evidence</CardTitle>
                    <CardDescription>
                      Key phrases from your entry that support the analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {entry.evidence.map((evidence, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg">
                          <span className="italic">"{evidence}"</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/write')} className="gap-2">
              Write Another Entry
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')} className="gap-2">
              View All Entries
            </Button>
          </div>
        </div>
      </main>

      {/* Crisis Modal */}
      <CrisisModal 
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
      />
    </div>
  );
};

export default ReflectionPage;