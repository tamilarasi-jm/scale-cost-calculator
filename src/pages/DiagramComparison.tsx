import React, { useState, useRef } from 'react';
import { Info, Download, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AOADiagram } from '@/components/DiagramComparison/AOADiagram';
import { AONDiagram, AONActivity } from '@/components/DiagramComparison/AONDiagram';
import { ComparisonModal } from '@/components/DiagramComparison/ComparisonModal';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'both' | 'aoa' | 'aon';

export default function DiagramComparison() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<AONActivity | null>(null);
  const { toast } = useToast();

  const aoaDiagramRef = useRef<HTMLDivElement>(null);
  const aonDiagramRef = useRef<HTMLDivElement>(null);

  const [aonActivities, setAonActivities] = useState<AONActivity[]>([
    { id: 'A', label: 'A', description: 'Start', duration: 3, es: 0, ef: 3, ls: 0, lf: 3, float: 0, x: 50, y: 50 },
    { id: 'B', label: 'B', description: 'Design', duration: 4, es: 3, ef: 7, ls: 3, lf: 7, float: 0, x: 180, y: 20 },
    { id: 'C', label: 'C', description: 'Plan', duration: 3, es: 3, ef: 6, ls: 5, lf: 8, float: 2, x: 180, y: 100 },
    { id: 'D', label: 'D', description: 'Build', duration: 5, es: 7, ef: 12, ls: 7, lf: 12, float: 0, x: 310, y: 20 },
    { id: 'E', label: 'E', description: 'Review', duration: 4, es: 6, ef: 10, ls: 8, lf: 12, float: 2, x: 310, y: 100 },
    { id: 'F', label: 'F', description: 'Deploy', duration: 2, es: 12, ef: 14, ls: 12, lf: 14, float: 0, x: 440, y: 60 },
  ]);

  const [editForm, setEditForm] = useState<AONActivity | null>(null);

  const handleActivityClick = (activity: AONActivity) => {
    setSelectedActivity(activity);
    setEditForm({ ...activity });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setAonActivities(prev =>
        prev.map(a => (a.id === editForm.id ? editForm : a))
      );
      toast({
        title: "Activity Updated",
        description: `Activity ${editForm.label} has been updated successfully.`,
      });
      setSelectedActivity(null);
      setEditForm(null);
    }
  };

  const handleExport = async (type: 'aoa' | 'aon' | 'both') => {
    try {
      const exportDiagram = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
        if (!ref.current) return;
        
        const svgElement = ref.current.querySelector('svg');
        if (!svgElement) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = svgElement.clientWidth * 2;
          canvas.height = svgElement.clientHeight * 2;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob(blob => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `${name}-diagram.png`;
              link.href = URL.createObjectURL(blob);
              link.click();
              URL.revokeObjectURL(link.href);
            }
          });
          URL.revokeObjectURL(url);
        };
        img.src = url;
      };

      if (type === 'both' || type === 'aoa') {
        await exportDiagram(aoaDiagramRef, 'aoa');
      }
      if (type === 'both' || type === 'aon') {
        await exportDiagram(aonDiagramRef, 'aon');
      }

      toast({
        title: "Export Successful",
        description: `Diagram(s) exported as PNG successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the diagram.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold gradient-text">
              AOA vs AON Network Diagram Comparison
            </CardTitle>
            <p className="text-muted-foreground">
              Interactive visual comparison of Activity on Arrow (AOA) and Activity on Node (AON) network diagrams
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={viewMode === 'both' ? 'default' : 'outline'}
                onClick={() => setViewMode('both')}
                className={viewMode === 'both' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Both Diagrams
              </Button>
              <Button
                variant={viewMode === 'aoa' ? 'default' : 'outline'}
                onClick={() => setViewMode('aoa')}
                className={viewMode === 'aoa' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                AOA Only
              </Button>
              <Button
                variant={viewMode === 'aon' ? 'default' : 'outline'}
                onClick={() => setViewMode('aon')}
                className={viewMode === 'aon' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                AON Only
              </Button>
              
              <div className="ml-auto flex gap-2">
                {viewMode === 'aon' && (
                  <Button
                    variant={isEditMode ? 'default' : 'outline'}
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      if (isEditMode) {
                        setSelectedActivity(null);
                        setEditForm(null);
                      }
                    }}
                    className={isEditMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
                  >
                    {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleExport(viewMode === 'both' ? 'both' : viewMode)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Info className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>

            {isEditMode && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>Edit Mode Active:</strong> Click on any AON activity box to edit its properties
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagrams Display */}
        <div className={`grid gap-6 ${viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {(viewMode === 'both' || viewMode === 'aoa') && (
            <Card ref={aoaDiagramRef}>
              <CardHeader>
                <CardTitle className="text-blue-900">AOA (Activity on Arrow)</CardTitle>
                <p className="text-sm text-muted-foreground">Event-based network diagram with activities on arrows</p>
              </CardHeader>
              <CardContent>
                <AOADiagram />
              </CardContent>
            </Card>
          )}

          {(viewMode === 'both' || viewMode === 'aon') && (
            <Card ref={aonDiagramRef}>
              <CardHeader>
                <CardTitle className="text-green-900">AON (Activity on Node)</CardTitle>
                <p className="text-sm text-muted-foreground">Activity-based network diagram with activities in boxes</p>
              </CardHeader>
              <CardContent>
                <AONDiagram
                  activities={aonActivities}
                  isEditMode={isEditMode}
                  onActivityClick={handleActivityClick}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Panel */}
        {selectedActivity && editForm && (
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-orange-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-900">Edit Activity: {selectedActivity.label}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedActivity(null);
                    setEditForm(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={editForm.label}
                    onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editForm.duration}
                    onChange={e => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="es">ES</Label>
                  <Input
                    id="es"
                    type="number"
                    value={editForm.es}
                    onChange={e => setEditForm({ ...editForm, es: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="ef">EF</Label>
                  <Input
                    id="ef"
                    type="number"
                    value={editForm.ef}
                    onChange={e => setEditForm({ ...editForm, ef: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="ls">LS</Label>
                  <Input
                    id="ls"
                    type="number"
                    value={editForm.ls}
                    onChange={e => setEditForm({ ...editForm, ls: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="lf">LF</Label>
                  <Input
                    id="lf"
                    type="number"
                    value={editForm.lf}
                    onChange={e => setEditForm({ ...editForm, lf: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="float">Float</Label>
                  <Input
                    id="float"
                    type="number"
                    value={editForm.float}
                    onChange={e => setEditForm({ ...editForm, float: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveEdit} className="bg-orange-600 hover:bg-orange-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Modal */}
      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
