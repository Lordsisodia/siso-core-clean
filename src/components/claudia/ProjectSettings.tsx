/**
 * ProjectSettings component for managing project-specific hooks configuration
 */

import React, { useState, useEffect } from 'react';
import { HooksEditor } from '@/components/HooksEditor';
import { api } from '@/lib/api';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Settings,
  FolderOpen,
  GitBranch,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import type { Project } from '@/lib/api';

interface ProjectSettingsProps {
  project: Project;
  onBack: () => void;
  className?: string;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  project,
  onBack,
  className
}) => {
  const [activeTab, setActiveTab] = useState('project');
  const { toast } = useToast();
  
  // Other hooks settings
  const [gitIgnoreLocal, setGitIgnoreLocal] = useState(true);

  useEffect(() => {
    checkGitIgnore();
  }, [project]);

  const checkGitIgnore = async () => {
    try {
      // Check if .claude/settings.local.json is in .gitignore
      const gitignorePath = `${project.path}/.gitignore`;
      const gitignoreContent = await api.readClaudeMdFile(gitignorePath);
      setGitIgnoreLocal(gitignoreContent.includes('.claude/settings.local.json'));
    } catch {
      // .gitignore might not exist
      setGitIgnoreLocal(false);
    }
  };

  const addToGitIgnore = async () => {
    try {
      const gitignorePath = `${project.path}/.gitignore`;
      let content = '';
      
      try {
        content = await api.readClaudeMdFile(gitignorePath);
      } catch {
        // File doesn't exist, create it
      }
      
      if (!content.includes('.claude/settings.local.json')) {
        content += '\n# Claude local settings (machine-specific)\n.claude/settings.local.json\n';
        await api.saveClaudeMdFile(gitignorePath, content);
        setGitIgnoreLocal(true);
        toast({
          title: "Success",
          description: "Added to .gitignore"
        });
      }
    } catch (err) {
      console.error('Failed to update .gitignore:', err);
      toast({
        title: "Error",
        description: "Failed to update .gitignore",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Hooks</h2>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span className="font-mono">{project.path}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="project" className="gap-2">
                <GitBranch className="h-4 w-4" />
                Project Hooks
              </TabsTrigger>
              <TabsTrigger value="local" className="gap-2">
                <Shield className="h-4 w-4" />
                Local Hooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="project" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Project Hooks</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These hooks apply to all users working on this project. They are stored in
                      <code className="mx-1 px-2 py-1 bg-muted rounded text-xs">.claude/settings.json</code>
                      and should be committed to version control.
                    </p>
                  </div>
                  
                  <HooksEditor
                    projectPath={project.path}
                    scope="project"
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="local" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Local Hooks</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These hooks only apply to your machine. They are stored in
                      <code className="mx-1 px-2 py-1 bg-muted rounded text-xs">.claude/settings.local.json</code>
                      and should NOT be committed to version control.
                    </p>
                    
                    {!gitIgnoreLocal && (
                      <div className="flex items-center gap-4 p-3 bg-yellow-500/10 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm text-yellow-600">
                            Local settings file is not in .gitignore
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={addToGitIgnore}
                        >
                          Add to .gitignore
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <HooksEditor
                    projectPath={project.path}
                    scope="local"
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
}; 
