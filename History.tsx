import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, created_at, emotion, crisis_flag')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setEntries(data || []);
      setLoading(false);
    };

    fetchEntries();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Entry History</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-8">Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No entries yet. Start writing!</p>
            </div>
          ) : (
            entries.map((entry: any) => (
              <Card 
                key={entry.id}
                className="cursor-pointer hover:shadow-journal transition-all duration-300"
                onClick={() => navigate(`/reflection/${entry.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                  <CardDescription>
                    {entry.content.substring(0, 200)}...
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default History;