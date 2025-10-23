import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileImage, Clock, TrendingUp, Activity, Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import PertInputForm, { PertTask } from '@/components/Calculator/PertInputForm';

type DiagramType = 'aoa' | 'aon';

interface PertNode {
  id: string;
  name: string;
  es: number;
  ef: number;
  ls: number;
  lf: number;
  slack: number;
  isCritical: boolean;
}

export default function PertVisualization() {
  const [diagramType, setDiagramType] = useState<DiagramType>('aon');
  const [tasks, setTasks] = useState<PertTask[]>([]);
  const [pertNodes, setPertNodes] = useState<PertNode[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculatePertNetwork = (inputTasks: PertTask[]) => {
    if (inputTasks.length === 0) {
      toast({
        title: 'No Tasks',
        description: 'Please add tasks before generating the PERT diagram',
        variant: 'destructive',
      });
      return;
    }

    // Calculate ES and EF (forward pass)
    const nodes: PertNode[] = inputTasks.map((task, index) => {
      let es = 0;
      
      // If task has dependencies, ES is the maximum EF of all dependencies
      if (task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          const depTask = inputTasks.find(t => t.id === depId);
          if (depTask) {
            const depIndex = inputTasks.indexOf(depTask);
            if (depIndex < index) {
              const depNode = nodes[depIndex];
              es = Math.max(es, depNode.ef);
            }
          }
        });
      }
      
      const ef = es + task.expectedTime;
      
      return {
        id: task.id,
        name: task.taskName,
        es,
        ef,
        ls: 0,
        lf: 0,
        slack: 0,
        isCritical: false,
      };
    });

    // Calculate project duration
    const projectDuration = Math.max(...nodes.map(n => n.ef));

    // Calculate LS and LF (backward pass)
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const task = inputTasks[i];
      
      // Find all tasks that depend on this task
      const dependents = nodes.filter((n, idx) => 
        inputTasks[idx].dependencies.includes(task.id)
      );
      
      if (dependents.length === 0) {
        // If no dependents, this is an end task
        node.lf = projectDuration;
      } else {
        // LF is the minimum LS of all dependent tasks
        node.lf = Math.min(...dependents.map(d => d.ls));
      }
      
      node.ls = node.lf - task.expectedTime;
      node.slack = node.ls - node.es;
      node.isCritical = Math.abs(node.slack) < 0.01;
    }

    setPertNodes(nodes);
    setShowVisualization(true);
    
    toast({
      title: 'PERT Diagram Generated',
      description: `Network created with ${nodes.length} tasks`,
    });
  };

  const totalDuration = pertNodes.length > 0 ? Math.max(...pertNodes.map(n => n.ef)) : 0;
  const criticalPath = pertNodes.filter(n => n.isCritical).map(n => n.id);
  const variance = tasks.reduce((sum, task) => sum + task.variance, 0);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text('PERT Visualization Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Project Summary', 14, 40);
      
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Duration: ${totalDuration} days`, 14, 48);
      doc.text(`Critical Path: ${criticalPath.join(' → ')}`, 14, 54);
      doc.text(`Variance: ${variance}`, 14, 60);
      
      doc.save(`pert-visualization-${Date.now()}.pdf`);
      
      toast({
        title: 'PDF Exported',
        description: 'Your PERT visualization has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error generating the PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleExportImage = () => {
    toast({
      title: 'Exporting Image',
      description: 'Your diagram is being generated...',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">PERT Visualization</h1>
            <p className="text-muted-foreground">Project Evaluation and Review Technique</p>
          </div>
          {showVisualization && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleExportImage}>
                <FileImage className="w-4 h-4 mr-2" />
                Export Image
              </Button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <PertInputForm tasks={tasks} onTasksChange={setTasks} />

        {/* Generate PERT Button */}
        {tasks.length > 0 && !showVisualization && (
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={() => calculatePertNetwork(tasks)}
              className="gap-2"
            >
              <Network className="w-5 h-5" />
              Generate PERT Diagram
            </Button>
          </div>
        )}

        {showVisualization && tasks.length > 0 && (
          <>
            <div className="flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowVisualization(false)}
              >
                Back to Input Form
              </Button>
            </div>

            {/* Diagram Type Toggle */}
            <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
          <RadioGroup
            value={diagramType}
            onValueChange={(value) => setDiagramType(value as DiagramType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aon" id="aon" />
              <Label htmlFor="aon" className="cursor-pointer">Activity on Node (AoN)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aoa" id="aoa" />
              <Label htmlFor="aoa" className="cursor-pointer">Activity on Arrow (AoA)</Label>
            </div>
          </RadioGroup>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Diagram */}
              <Card className="lg:col-span-2 p-6 bg-card/95 backdrop-blur border-border/50">
            <h2 className="text-xl font-semibold mb-4">
              {diagramType === 'aon' ? 'Activity on Node' : 'Activity on Arrow'} Diagram
            </h2>
            <div className="relative min-h-[500px] bg-muted/20 rounded-lg p-8 overflow-auto">
              {diagramType === 'aon' ? (
                // AoN Diagram
                <div className="space-y-4">
                  {pertNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`relative inline-block mr-8 transition-all hover:scale-105 ${
                        index < pertNodes.length - 1 ? 'mb-8' : ''
                      }`}
                    >
                      <div
                        className={`
                          p-4 rounded-lg border-2 min-w-[200px] shadow-lg
                          ${node.isCritical 
                            ? 'bg-error/10 border-error shadow-error/20' 
                            : node.slack < 5 
                              ? 'bg-warning/10 border-warning shadow-warning/20'
                              : 'bg-success/10 border-success shadow-success/20'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg">{node.id}</span>
                          {node.isCritical && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium mb-3">{node.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-background/50 rounded p-1">
                            <div className="text-muted-foreground">ES: {node.es}</div>
                            <div className="text-muted-foreground">EF: {node.ef}</div>
                          </div>
                          <div className="bg-background/50 rounded p-1">
                            <div className="text-muted-foreground">LS: {node.ls}</div>
                            <div className="text-muted-foreground">LF: {node.lf}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-medium">
                          Slack: <span className={node.slack === 0 ? 'text-error' : 'text-success'}>{node.slack} days</span>
                        </div>
                      </div>
                      {index < pertNodes.length - 1 && node.isCritical && (
                        <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 text-error">
                          <div className="w-0.5 h-8 bg-error mx-auto" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // AoA Diagram
                <div className="space-y-8">
                  <div className="text-center text-muted-foreground">
                    Activity on Arrow diagram representation
                  </div>
                  {pertNodes.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-primary bg-card flex items-center justify-center font-bold">
                        {index}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`
                            relative h-16 rounded-lg flex items-center justify-center border-2
                            ${node.isCritical 
                              ? 'bg-error/10 border-error' 
                              : 'bg-muted/50 border-muted-foreground/20'
                            }
                          `}
                        >
                          <span className="font-medium">{node.name} ({node.ef - node.es} days)</span>
                          {node.isCritical && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-primary bg-card flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              </Card>

              {/* Summary Card */}
              <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Project Summary
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-card/80 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Total Duration
                  </div>
                  <div className="text-3xl font-bold text-primary">{totalDuration} days</div>
                </div>

                <div className="p-4 bg-card/80 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Critical Path
                  </div>
                  <div className="text-sm font-medium">{criticalPath.join(' → ')}</div>
                </div>

                <div className="p-4 bg-card/80 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-2">Early Start/Finish</div>
                  <div className="text-xs space-y-1">
                    {pertNodes.slice(0, 3).map(node => (
                      <div key={node.id} className="flex justify-between">
                        <span>{node.id}:</span>
                        <span className="font-medium">ES: {node.es}, EF: {node.ef}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-card/80 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-2">Late Start/Finish</div>
                  <div className="text-xs space-y-1">
                    {pertNodes.slice(0, 3).map(node => (
                      <div key={node.id} className="flex justify-between">
                        <span>{node.id}:</span>
                        <span className="font-medium">LS: {node.ls}, LF: {node.lf}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-card/80 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-1">Variance</div>
                  <div className="text-xl font-bold">{variance}</div>
                </div>
              </div>
                </Card>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/cost-summary')}
                >
                  View Detailed Cost Summary
                </Button>
              </div>
            </div>

            {/* Legend */}
            <Card className="p-4 bg-card/95 backdrop-blur border-border/50">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-error/20 border-2 border-error rounded" />
              <span>Critical Path (Slack = 0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning/20 border-2 border-warning rounded" />
              <span>Low Slack (&lt; 5 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/20 border-2 border-success rounded" />
              <span>Safe Slack (≥ 5 days)</span>
            </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
