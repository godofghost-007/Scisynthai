import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResearch } from '../context/ResearchContext';
import { Node, Link as GraphLink } from '../types';

interface KnowledgeGraphProps {
  hypothesisId: string;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ hypothesisId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hypotheses } = useResearch();
  
  const hypothesis = hypotheses.find(h => h.id === hypothesisId);
  
  // Mock data if knowledge graph not available
  const mockGraphData = {
    nodes: [
      { id: 'hypothesis', name: 'Hypothesis', type: 'hypothesis', value: 30 },
      { id: 'crispr', name: 'CRISPR-Cas9', type: 'concept', value: 25 },
      { id: 'dmd', name: 'DMD Gene', type: 'concept', value: 20 },
      { id: 'muscular_dystrophy', name: 'Muscular Dystrophy', type: 'concept', value: 22 },
      { id: 'gene_editing', name: 'Gene Editing', type: 'concept', value: 18 },
      { id: 'off_target', name: 'Off-Target Effects', type: 'concept', value: 15 },
      { id: 'delivery', name: 'Delivery System', type: 'concept', value: 15 },
      { id: 'paper1', name: 'Zhang et al. 2022', type: 'paper', value: 12 },
      { id: 'paper2', name: 'Brown et al. 2021', type: 'paper', value: 10 },
      { id: 'author1', name: 'Jane Doe', type: 'author', value: 8 },
    ] as Node[],
    links: [
      { source: 'hypothesis', target: 'crispr', value: 5, label: 'uses' },
      { source: 'hypothesis', target: 'dmd', value: 5, label: 'targets' },
      { source: 'hypothesis', target: 'off_target', value: 4, label: 'reduces' },
      { source: 'crispr', target: 'gene_editing', value: 4, label: 'enables' },
      { source: 'dmd', target: 'muscular_dystrophy', value: 5, label: 'causes' },
      { source: 'hypothesis', target: 'delivery', value: 3, label: 'uses' },
      { source: 'paper1', target: 'dmd', value: 3, label: 'studies' },
      { source: 'paper2', target: 'delivery', value: 3, label: 'develops' },
      { source: 'author1', target: 'paper1', value: 2, label: 'wrote' },
      { source: 'delivery', target: 'off_target', value: 2, label: 'reduces' },
    ] as GraphLink[],
  };
  
  const graphData = hypothesis?.knowledgeGraphData || mockGraphData;
  
  useEffect(() => {
    if (!svgRef.current || !graphData) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear svg
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create the simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.value + 10));
    
    // Create the svg elements
    const svg = d3.select(svgRef.current);
    
    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
    
    const g = svg.append('g');
    
    // Colors based on node type
    const color = d3.scaleOrdinal()
      .domain(['concept', 'paper', 'author', 'hypothesis', 'evidence'])
      .range(['#2c7a7b', '#1a365d', '#d69e2e', '#3f60ab', '#10b981']);
    
    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));
    
    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter()
      .append('circle')
      .attr('r', (d: any) => Math.sqrt(d.value) * 2)
      .attr('fill', (d: any) => color(d.type) as string)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);
    
    // Add tooltips
    node.append('title')
      .text((d: any) => d.name);
    
    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .enter()
      .append('text')
      .text((d: any) => d.name)
      .attr('font-size', 10)
      .attr('dx', (d: any) => Math.sqrt(d.value) * 2 + 2)
      .attr('dy', 4)
      .style('pointer-events', 'none');
    
    // Add link labels
    const linkLabels = g.append('g')
      .selectAll('text')
      .data(graphData.links)
      .enter()
      .append('text')
      .attr('font-size', 8)
      .text((d: any) => d.label || '')
      .style('pointer-events', 'none')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle');
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
      
      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
      
      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Create a legend
    const legend = svg.append('g')
      .attr('transform', 'translate(20, 20)');
    
    const legendData = [
      { type: 'hypothesis', label: 'Hypothesis' },
      { type: 'concept', label: 'Concept' },
      { type: 'paper', label: 'Paper' },
      { type: 'author', label: 'Author' },
      { type: 'evidence', label: 'Evidence' },
    ];
    
    legendData.forEach((item, index) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${index * 20})`);
      
      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', color(item.type) as string);
      
      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 4)
        .text(item.label)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });
    
    return () => {
      simulation.stop();
    };
  }, [hypothesisId, graphData]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full" 
      style={{ minHeight: '400px' }}
    />
  );
};

export default KnowledgeGraph;