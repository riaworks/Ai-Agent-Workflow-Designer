import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load workflow config
const workflowPath = path.join(__dirname, "src", "workflow.json");
const workflowConfig = JSON.parse(fs.readFileSync(workflowPath, "utf-8"));

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mission State
  let missionActive = false;
  let currentStepIndex = -1;
  let missionStats = {
    completedTasks: 0,
    activeAgents: 0,
    startTime: null as number | null,
    throughput: 0,
  };

  // Agent State initialized from workflowConfig
  let agents = workflowConfig.agents.map((a: any) => ({
    ...a,
    status: 'idle',
    pos: { ...a.home },
    hasWork: false,
    direction: 'right' as 'left' | 'right'
  }));

  // API Routes
  app.get("/api/mission/status", (req, res) => {
    res.json({ missionActive, missionStats, agents, currentStepIndex });
  });

  app.post("/api/mission/start", (req, res) => {
    if (missionActive) return res.json({ success: true });
    
    missionActive = true;
    missionStats.startTime = Date.now();
    missionStats.completedTasks = 0;
    currentStepIndex = 0;
    
    io.emit("mission:started", { startTime: missionStats.startTime });
    console.log("Mission Started");
    
    runWorkflowStep();
    res.json({ success: true });
  });

  app.post("/api/mission/stop", (req, res) => {
    missionActive = false;
    currentStepIndex = -1;
    agents = agents.map((a: any) => ({
      ...a,
      status: 'idle',
      pos: { ...a.home },
      hasWork: false
    }));
    io.emit("mission:stopped");
    io.emit("agents:reset", agents);
    console.log("Mission Stopped");
    res.json({ success: true });
  });

  // Workflow Logic
  async function runWorkflowStep() {
    if (!missionActive || currentStepIndex >= workflowConfig.sequence.length) {
      if (currentStepIndex >= workflowConfig.sequence.length) {
        io.emit("mission:complete");
      }
      return;
    }

    const step = workflowConfig.sequence[currentStepIndex];
    const fromAgent = agents.find((a: any) => a.id === step.from);
    const toAgent = agents.find((a: any) => a.id === step.to);

    if (fromAgent && toAgent) {
      // 1. Start movement
      fromAgent.status = 'moving';
      fromAgent.hasWork = true;
      fromAgent.direction = toAgent.home.x > fromAgent.pos.x ? 'right' : 'left';
      
      io.emit("agent:update", fromAgent);
      
      // Simulate travel
      await new Promise(r => setTimeout(r, 1200));
      fromAgent.pos = { ...toAgent.home };
      io.emit("agent:update", fromAgent);

      // 2. Handover
      fromAgent.hasWork = false;
      toAgent.hasWork = true;
      missionStats.completedTasks++;
      
      io.emit("task:completed", { 
        agentId: fromAgent.id, 
        targetId: toAgent.id,
        taskId: step.id,
        log: step.log,
        stats: missionStats
      });

      // 3. Return home
      fromAgent.direction = fromAgent.home.x > fromAgent.pos.x ? 'right' : 'left';
      io.emit("agent:update", fromAgent);
      
      await new Promise(r => setTimeout(r, 1200));
      fromAgent.pos = { ...fromAgent.home };
      fromAgent.status = 'idle';
      io.emit("agent:update", fromAgent);

      currentStepIndex++;
      runWorkflowStep();
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.emit("init", { agents, missionActive, missionStats, workflowConfig });
    
    socket.on("request-init", () => {
      socket.emit("init", { agents, missionActive, missionStats, workflowConfig });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
