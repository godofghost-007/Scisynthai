import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';

// Register layouts
cytoscape.use(cola);
cytoscape.use(dagre);

interface CytoscapeGraphProps {
  elements: {
    nodes: Array<{
      data: {
        id: string;
        label: string;
        type?: string;
        weight?: number;
      };
    }>;
    edges: Array<{
      data: {
        source: string;
        target: string;
        label?: string;
        weight?: number;
      };
    }>;
  };
  layout?: 'cola' | 'dagre';
  style?: cytoscape.Stylesheet[];
}

const defaultStyle: cytoscape.Stylesheet[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#6696c2',
      'label': 'data(label)',
      'color': '#333',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'width': '40px',
      'height': '40px',
      'border-width': '2px',
      'border-color': '#fff',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'font-size': '10px',
      'text-rotation': 'autorotate',
      'text-margin-y': '-10px',
    }
  },
  {
    selector: 'node[type = "concept"]',
    style: {
      'background-color': '#2c7a7b',
    }
  },
  {
    selector: 'node[type = "paper"]',
    style: {
      'background-color': '#1a365d',
    }
  },
  {
    selector: 'node[type = "author"]',
    style: {
      'background-color': '#d69e2e',
    }
  },
];

const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({ 
  elements, 
  layout = 'cola',
  style = defaultStyle 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: style,
      layout: {
        name: layout,
        fit: true,
        padding: 50,
        nodeSpacing: 100,
        ...(layout === 'cola' ? {
          maxSimulationTime: 2000,
          refresh: 1,
          animate: true,
          randomize: false,
        } : {
          rankDir: 'TB',
          align: 'UL',
        }),
      },
      wheelSensitivity: 0.2,
    });

    // Add zoom controls
    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      cyRef.current?.animate({
        zoom: 2,
        center: { eles: node }
      }, {
        duration: 500
      });
    });

    cyRef.current.on('tap', function(evt) {
      if (evt.target === cyRef.current) {
        cyRef.current?.animate({
          fit: {
            padding: 50
          }
        }, {
          duration: 500
        });
      }
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [elements, layout, style]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] bg-white rounded-lg shadow-inner"
    />
  );
};

export default CytoscapeGraph;