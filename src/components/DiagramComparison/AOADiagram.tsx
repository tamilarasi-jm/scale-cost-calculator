import React from 'react';

interface AOANode {
  id: number;
  x: number;
  y: number;
  et: number;
  lt: number;
}

interface AOAActivity {
  from: number;
  to: number;
  label: string;
  duration: number;
  float: number;
}

export const AOADiagram: React.FC = () => {
  const nodes: AOANode[] = [
    { id: 1, x: 50, y: 200, et: 0, lt: 0 },
    { id: 2, x: 200, y: 100, et: 3, lt: 3 },
    { id: 3, x: 200, y: 300, et: 3, lt: 5 },
    { id: 4, x: 350, y: 200, et: 7, lt: 7 },
    { id: 5, x: 500, y: 200, et: 12, lt: 12 },
  ];

  const activities: AOAActivity[] = [
    { from: 1, to: 2, label: 'A', duration: 3, float: 0 },
    { from: 1, to: 3, label: 'B', duration: 3, float: 2 },
    { from: 2, to: 4, label: 'C', duration: 4, float: 0 },
    { from: 3, to: 4, label: 'D', duration: 2, float: 2 },
    { from: 4, to: 5, label: 'E', duration: 5, float: 0 },
  ];

  const getNode = (id: number) => nodes.find(n => n.id === id)!;

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 600 400" className="w-full h-auto border border-blue-200 rounded-lg bg-blue-50/30">
        <defs>
          <marker
            id="arrowhead-aoa"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#2563eb" />
          </marker>
        </defs>

        {/* Draw activities (arrows) */}
        {activities.map((activity, idx) => {
          const fromNode = getNode(activity.from);
          const toNode = getNode(activity.to);
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          const isCritical = activity.float === 0;

          return (
            <g key={idx}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isCritical ? "#dc2626" : "#2563eb"}
                strokeWidth={isCritical ? "3" : "2"}
                markerEnd="url(#arrowhead-aoa)"
              />
              <text
                x={midX}
                y={midY - 10}
                textAnchor="middle"
                className="text-xs font-semibold fill-blue-900"
              >
                {activity.label} ({activity.duration}d)
              </text>
              {activity.float > 0 && (
                <text
                  x={midX}
                  y={midY + 15}
                  textAnchor="middle"
                  className="text-xs fill-blue-600"
                >
                  Float: {activity.float}d
                </text>
              )}
            </g>
          );
        })}

        {/* Draw nodes (circles) */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <line
              x1={node.x - 30}
              y1={node.y}
              x2={node.x + 30}
              y2={node.y}
              stroke="#2563eb"
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y - 8}
              textAnchor="middle"
              className="text-sm font-bold fill-blue-900"
            >
              {node.id}
            </text>
            <text
              x={node.x}
              y={node.y + 18}
              textAnchor="middle"
              className="text-xs fill-blue-700"
            >
              ET:{node.et} LT:{node.lt}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">AOA Legend:</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p>• <strong>Circles</strong> = Event Nodes (Top: Node #, Bottom: ET/LT)</p>
          <p>• <strong>Arrows</strong> = Activities (Label, Duration)</p>
          <p>• <strong>Red Arrows</strong> = Critical Path (Float = 0)</p>
          <p>• <strong>Blue Arrows</strong> = Non-critical (Float &gt; 0)</p>
        </div>
      </div>
    </div>
  );
};
