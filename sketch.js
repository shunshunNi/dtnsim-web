const canvas_size = 600;
let agent_size = 50;
let list_of_agents = [];
const speed = 10;
let timer_interval = null;
let timer = 0;

class Agent {
  constructor(x, y, is_infected) {
    this.x = x;
    this.y = y;
    this.is_infected = is_infected;
    this.set_speed();
  }

  // random speed and direction
  set_speed() {
    const r = speed;
    const angle = Math.random() * 2 * Math.PI;
    this.dx = r * Math.cos(angle);
    this.dy = r * Math.sin(angle);
  }

  // move the agent
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  // check if the agent is in the canvas
  is_in_canvas() {
    return this.x >= 0 && this.x <= canvas_size && this.y >= 0 && this.y <= canvas_size;
  }

  // warp the agent to the other side of the canvas
  warp() {
    if (this.x < 0) {
      this.x = canvas_size;
    } else if (this.x > canvas_size) {
      this.x = 0;
    } else if (this.y < 0) {
      this.y = canvas_size;
    } else if (this.y > canvas_size) {
      this.y = 0;
    }
  }
}

const agent_distance = (agent1, agent2) => {
  return Math.sqrt(Math.pow(agent1.x - agent2.x, 2) + Math.pow(agent1.y - agent2.y, 2));
}

function setup() {
  background(51);
  createCanvas(canvas_size, canvas_size);
  frameRate(15);
}


function draw() {
  // check if all agents are infected
  if (list_of_agents.every(agent => agent.is_infected)) {
    noLoop();
    // stop timer
    clearInterval(timer_interval);
  }
  // draw agents as circles
  background(51);
  for (let i = 0; i < list_of_agents.length; i++) {
    const agent = list_of_agents[i];
    if (agent.is_infected) {
      fill(255, 0, 0);
    } else {
      fill(0, 0, 255);
    }
    ellipse(agent.x, agent.y, agent_size, agent_size);
  }
  // move agents
  for (let i = 0; i < list_of_agents.length; i++) {
    const agent = list_of_agents[i];
    agent.move();
    // agent should random walk
    if (Math.random() < 0.5) {
      agent.set_speed();
    }
    // warp the agent if it is out of the canvas
    if (!agent.is_in_canvas()) {
      agent.warp();
    }
    // check if agent is infected
    for (let j = 0; j < list_of_agents.length; j++) {
      if (i != j) {
        const other_agent = list_of_agents[j];
        if (agent_distance(agent, other_agent) < agent_size) {
          if (other_agent.is_infected) {
            agent.is_infected = true;
          }
        }
      }
    }
  }

}

const reset_canvas = () => {
  // reset timer
  clearInterval(timer_interval);
  timer_interval = setInterval(() => {
    timer += 0.01;
    document.getElementById("timer").innerHTML = timer.toFixed(2);
  }, 10);
  // timer changes in milliseconds
  background(51);
  list_of_agents = [];
  agent_size = document.getElementById("agent_size").value;
  let agents_number = document.getElementById("agents_number").value;
  let infected_number = document.getElementById("infected_number").value;
  // agents number,size and infected number should be int
  agents_number = parseInt(agents_number, 10);
  infected_number = parseInt(infected_number, 10);
  agent_size = parseInt(agent_size, 10);

  // initialize agents
  for (let i = 0; i < agents_number; i++) {
    list_of_agents.push(new Agent(random(canvas_size), random(canvas_size), false));
  }
  // infect some agents
  for (let i = 0; i < infected_number; i++) {
    list_of_agents[i].is_infected = true;
  }
  // start timer
  timer = 0;
  loop();
}

// if the user change the number of agents or the number of infected agents, reset the canvas
document.getElementById("agents_number").addEventListener("change", reset_canvas);
document.getElementById("infected_number").addEventListener("change", reset_canvas);
document.getElementById("agent_size").addEventListener("change", reset_canvas);
document.getElementById("reset").addEventListener("click", reset_canvas);


// onload reset the canvas
window.onload = reset_canvas;

