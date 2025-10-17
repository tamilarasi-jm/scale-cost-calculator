import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/Calculator/InputPanel";
import { ModelCard } from "@/components/Calculator/ModelCard";
import { ComparisonChart } from "@/components/Calculator/ComparisonChart";
import { ComparisonTable } from "@/components/Calculator/ComparisonTable";
import { calculateAllModels, getRecommendedModel } from "@/utils/estimationModels";

type AppState = 'landing' | 'loading' | 'app';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [darkMode, setDarkMode] = useState(false);
  
  // Project parameters
  const [projectSize, setProjectSize] = useState(50);
  const [teamSize, setTeamSize] = useState(5);
  const [timeline, setTimeline] = useState(12);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Calculation results
  const [results, setResults] = useState(() => {
    const initial = calculateAllModels({
      projectSize: 50,
      teamSize: 5,
      timeline: 12,
      complexity: 'medium'
    });
    return initial;
  });
  
  const [recommendedModel, setRecommendedModel] = useState<'cocomo' | 'slim' | 'rca'>('cocomo');

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGetStarted = () => {
    setAppState('loading');
  };

  const handleLoadingComplete = () => {
    setAppState('app');
  };

  const handleCalculate = () => {
    const params = { projectSize, teamSize, timeline, complexity };
    const newResults = calculateAllModels(params);
    setResults(newResults);
    setRecommendedModel(getRecommendedModel(params));
  };

  // Auto-calculate when parameters change
  useEffect(() => {
    handleCalculate();
  }, [projectSize, teamSize, timeline, complexity]);

  if (appState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (appState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const chartData = [
    {
      name: 'COCOMO II',
      cost: results.cocomo.cost,
      effort: results.cocomo.effort,
      duration: results.cocomo.duration,
      color: 'hsl(var(--cocomo))'
    },
    {
      name: 'SLIM',
      cost: results.slim.cost,
      effort: results.slim.effort,
      duration: results.slim.duration,
      color: 'hsl(var(--slim))'
    },
    {
      name: 'RCA Price',
      cost: results.rca.cost,
      effort: results.rca.effort,
      duration: results.rca.duration,
      color: 'hsl(var(--rca))'
    }
  ];

  const tableData = [
    {
      name: 'COCOMO II',
      cost: results.cocomo.cost,
      effort: results.cocomo.effort,
      duration: results.cocomo.duration,
      risk: results.cocomo.risk
    },
    {
      name: 'SLIM',
      cost: results.slim.cost,
      effort: results.slim.effort,
      duration: results.slim.duration,
      risk: results.slim.risk
    },
    {
      name: 'RCA Price',
      cost: results.rca.cost,
      effort: results.rca.effort,
      duration: results.rca.duration,
      risk: results.rca.risk
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        darkMode={darkMode} 
        onToggleDarkMode={handleToggleDarkMode}
        results={tableData}
        projectParams={{
          size: projectSize,
          teamSize,
          timeline,
          complexity
        }}
      />
      
      <div className="flex flex-col lg:flex-row">
        <InputPanel
          projectSize={projectSize}
          teamSize={teamSize}
          timeline={timeline}
          complexity={complexity}
          onProjectSizeChange={setProjectSize}
          onTeamSizeChange={setTeamSize}
          onTimelineChange={setTimeline}
          onComplexityChange={(value) => setComplexity(value as 'low' | 'medium' | 'high')}
          onCalculate={handleCalculate}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Model Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModelCard
                name="COCOMO II"
                color="hsl(var(--cocomo))"
                cost={results.cocomo.cost}
                effort={results.cocomo.effort}
                duration={results.cocomo.duration}
                risk={results.cocomo.risk}
                isRecommended={recommendedModel === 'cocomo'}
              />
              <ModelCard
                name="SLIM"
                color="hsl(var(--slim))"
                cost={results.slim.cost}
                effort={results.slim.effort}
                duration={results.slim.duration}
                risk={results.slim.risk}
                isRecommended={recommendedModel === 'slim'}
              />
              <ModelCard
                name="RCA Price"
                color="hsl(var(--rca))"
                cost={results.rca.cost}
                effort={results.rca.effort}
                duration={results.rca.duration}
                risk={results.rca.risk}
                isRecommended={recommendedModel === 'rca'}
              />
            </div>

            {/* Comparison Chart */}
            <ComparisonChart results={chartData} />

            {/* Comparison Table */}
            <ComparisonTable results={tableData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
