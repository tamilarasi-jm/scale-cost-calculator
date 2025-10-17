import { ArrowLeft, Calculator, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  const models = [
    {
      name: "COCOMO II",
      icon: <Calculator className="w-12 h-12" />,
      color: "hsl(var(--cocomo))",
      fullName: "Constructive Cost Model II",
      bestFor: "Enterprise & Large-Scale Projects",
      description: "COCOMO II is an industry-standard model developed by Barry Boehm for estimating effort, schedule, and cost in software development projects. It's particularly effective for large-scale enterprise applications.",
      keyFactors: [
        "Project Size (KLOC - thousands of lines of code)",
        "Product Complexity",
        "Team Experience & Capability",
        "Development Environment",
        "Required Reliability"
      ],
      formula: "Effort = a × (KLOC)^b × EAF",
      whenToUse: [
        "Large enterprise software projects (>50 KLOC)",
        "When detailed project documentation exists",
        "Traditional waterfall or hybrid methodologies",
        "Projects requiring high reliability and formal processes"
      ]
    },
    {
      name: "SLIM",
      icon: <TrendingUp className="w-12 h-12" />,
      color: "hsl(var(--slim))",
      fullName: "Software Lifecycle Management",
      bestFor: "Agile & Iterative Development",
      description: "SLIM focuses on optimal resource allocation and is particularly suited for agile and iterative development environments. It emphasizes team productivity and efficiency metrics.",
      keyFactors: [
        "Productivity Index based on team size",
        "Optimal Team Size calculation",
        "Technology Complexity Factor",
        "Development Environment Maturity",
        "Team Efficiency Metrics"
      ],
      formula: "Effort = (KLOC × 1000) / Productivity Factor",
      whenToUse: [
        "Agile and iterative development projects",
        "When team size optimization is critical",
        "Continuous delivery environments",
        "Projects with flexible scope and timelines"
      ]
    },
    {
      name: "RCA Price",
      icon: <Target className="w-12 h-12" />,
      color: "hsl(var(--rca))",
      fullName: "Resource Constraint Analysis",
      bestFor: "Fixed Budget & Timeline Constraints",
      description: "RCA Price is designed for projects with fixed constraints such as predetermined budgets, strict deadlines, or limited team sizes. It helps optimize resource allocation within these constraints.",
      keyFactors: [
        "Maximum Available Team Size",
        "Fixed Timeline Constraints",
        "Budget Limitations",
        "Complexity Multipliers",
        "Resource Utilization Efficiency"
      ],
      formula: "Effort = max(Required Effort, Team × Timeline × 0.8)",
      whenToUse: [
        "Projects with fixed budgets or timelines",
        "Resource-constrained environments",
        "Fixed-price contracts",
        "When team size is predetermined"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2 font-bold text-xl">
            <Calculator className="w-6 h-6 text-primary" />
            <span className="gradient-text">Cost Estimator Pro</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Understanding the
            <br />
            <span className="gradient-text">Estimation Models</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how each model calculates project costs and when to use them
          </p>
        </div>
      </section>

      {/* Models Details */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-16">
          {models.map((model, index) => (
            <div
              key={index}
              className="bg-card border-2 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ borderTopColor: model.color }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Icon & Name */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${model.color}20`, color: model.color }}
                  >
                    {model.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-2">{model.name}</h2>
                  <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-4">
                    {model.fullName}
                  </div>
                  <p className="text-lg text-muted-foreground mb-6">
                    {model.description}
                  </p>

                  {/* Best For */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <span style={{ color: model.color }}>✦</span>
                      Best For
                    </h3>
                    <p className="text-foreground font-medium">{model.bestFor}</p>
                  </div>

                  {/* Key Factors */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Factors</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {model.keyFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formula */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Formula</h3>
                    <code className="block bg-muted px-4 py-3 rounded-lg font-mono text-sm">
                      {model.formula}
                    </code>
                  </div>

                  {/* When to Use */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">When to Use</h3>
                    <ul className="space-y-2">
                      {model.whenToUse.map((use, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span style={{ color: model.color }}>✓</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Try It Out?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Compare all three models side-by-side for your project
          </p>
          <Button 
            onClick={() => navigate("/")} 
            size="lg" 
            className="text-lg px-8 py-6"
          >
            Start Estimating
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>Made with ❤️ for project managers and developers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
