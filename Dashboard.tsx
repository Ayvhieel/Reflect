import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, History, Settings, TestTube, LogOut, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-journal-secondary/5 to-journal-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-journal-primary to-journal-secondary rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-journal-primary to-journal-secondary bg-clip-text text-transparent">
                Grok Journal
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.user_metadata?.display_name || user?.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Your Journal Awaits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a moment to reflect, express your thoughts, and let AI help you gain insights into your emotional well-being.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-journal hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-0"
              onClick={() => navigate('/write')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-journal-primary to-journal-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Write Entry</CardTitle>
                <CardDescription>
                  Start a new journal entry
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-journal hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-0"
              onClick={() => navigate('/history')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-journal-secondary to-journal-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">History</CardTitle>
                <CardDescription>
                  View past entries
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-journal hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-0"
              onClick={() => navigate('/settings')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-journal-accent to-journal-success rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  Manage preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-journal hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-0"
              onClick={() => navigate('/test')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-journal-warning to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Test AI</CardTitle>
                <CardDescription>
                  Debug AI responses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest journal entries and reflections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No entries yet. Start your first journal entry to see it here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;