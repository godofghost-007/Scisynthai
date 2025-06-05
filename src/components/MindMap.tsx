import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MindMapProps {
  data: {
    nodes: { id: string; text: string }[];
    edges: { from: string; to: string; label?: string }[];
  };
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    });

    // Convert data to Mermaid flowchart syntax
    const mermaidDef = generateMermaidDefinition(data);
    
    // Clear previous content
    containerRef.current.innerHTML = '<div class="mermaid">' + mermaidDef + '</div>';
    
    // Render new diagram
    mermaid.contentLoaded();
  }, [data]);

  const generateMermaidDefinition = (data: MindMapProps['data']) => {
    let def = 'graph TD;\n';
    
    // Add nodes
    data.nodes.forEach(node => {
      def += `${node.id}["${node.text}"];\n`;
    });
    
    // Add edges
    data.edges.forEach(edge => {
      def += `${edge.from} --> ${edge.label ? `|${edge.label}|` : ''} ${edge.to};\n`;
    });
    
    return def;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-inner"
    />
  );
};

export default MindMap;