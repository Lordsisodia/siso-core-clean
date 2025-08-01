/**
 * SISO MCP (Model Context Protocol) Services
 * 
 * This module provides a comprehensive MCP management system including:
 * - Orchestration of multi-step workflows
 * - Unified client with smart routing
 * - Response caching for performance
 * - Monitoring and metrics collection
 * - Middleware for validation and transformation
 */

export { MCPOrchestrator } from './mcp-orchestrator';
export type { 
  MCPStep, 
  MCPWorkflow, 
  MCPExecutionResult, 
  WorkflowExecutionResult 
} from './mcp-orchestrator';

export { UnifiedMCPClient } from './unified-mcp-client';
export type { 
  MCPIntent, 
  MCPClientConfig, 
  MCPRouteRule 
} from './unified-mcp-client';

export { MCPCache, mcpCache } from './mcp-cache';
export type { 
  CacheEntry, 
  CacheConfig, 
  CacheStats 
} from './mcp-cache';

export { MCPWorkflows, WorkflowTemplates, WorkflowBuilder } from './mcp-workflows';

export { MCPMonitor, mcpMonitor } from './mcp-monitor';
export type { 
  MCPMetric, 
  MCPStats, 
  MCPHealthStatus, 
  MonitorConfig 
} from './mcp-monitor';

export { MCPMiddleware, mcpMiddleware } from './mcp-middleware';
export type { 
  MiddlewareFunction, 
  MiddlewareContext, 
  ValidationSchema 
} from './mcp-middleware';

/**
 * Quick start function to initialize all MCP services
 */
export function initializeMCPServices(config?: {
  cache?: Partial<import('./mcp-cache').CacheConfig>;
  monitor?: Partial<import('./mcp-monitor').MonitorConfig>;
  client?: import('./unified-mcp-client').MCPClientConfig;
}): {
  orchestrator: MCPOrchestrator;
  client: UnifiedMCPClient;
  cache: MCPCache;
  monitor: MCPMonitor;
  middleware: MCPMiddleware;
} {
  const orchestrator = new MCPOrchestrator();
  const client = new UnifiedMCPClient(config?.client);
  
  // Register common MCPs (these would be actual MCP clients in production)
  // Example registration - replace with actual MCP clients
  const mcps = ['supabase', 'context7', 'notion', 'github', 'exa', 'slack', 'desktop-commander'];
  mcps.forEach(mcp => {
    orchestrator.registerMCPClient(mcp, {
      // Placeholder for actual MCP client
      // In production, this would be the actual MCP client instance
    });
  });

  return {
    orchestrator,
    client,
    cache: mcpCache,
    monitor: mcpMonitor,
    middleware: mcpMiddleware
  };
}