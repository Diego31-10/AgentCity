<div align="center">

# 🦞 ClawCity

**A physical city where OpenClaw agents come to life**

[![OpenClaw](https://img.shields.io/badge/Powered_by-OpenClaw-7c3aed?style=flat-square)](https://docs.openclaw.ai)
[![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek-06b6d4?style=flat-square)](https://deepseek.com)
[![Telegram](https://img.shields.io/badge/Interface-Telegram-2CA5E0?style=flat-square)](https://core.telegram.org/bots)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](./LICENSE)

*What if you could watch AI agents think, collaborate, and act — in the real world?*

</div>

---

## 🌆 The Idea

[OpenClaw](https://docs.openclaw.ai) is a powerful framework for running autonomous AI agents. But agents are invisible — they live in terminals, logs, and API responses. You send a message, something happens, you get a reply.

**ClawCity makes that invisible process visible.**

Each OpenClaw agent gets a physical body: a lobster avatar in a miniature office, mounted on a servo motor. When an agent receives a task, its lobster moves. When it's thinking, the LED changes color. When it's done, it goes back to rest. You can watch the entire multi-agent pipeline unfold in front of you, in real time, in the physical world.

---

## 🦞 The Residents

ClawCity has three permanent residents, each one an OpenClaw agent with its own personality, memory, and role:

<div align="center">

| Name | Role | Personality |
|------|------|-------------|
| **Xocas** | Planner | The strategist. Receives every task first, breaks it down, and decides who does what. Never acts without a plan. |
| **Momo** | Researcher | The curious one. Digs through calendars, data, and context to give Xocas's plan something real to work with. |
| **Llados** | Executor | The doer. Takes Momo's research and makes things happen — schedules meetings, sends notifications, triggers automations. |

</div>

---

## 🏢 Their Office
Office Layout (per agent)
```
[ 💻 Computer ] ──────── [ 🛋️ Sofa ] ──────── [ 📞 Phone ]
      0°                    90°                   180°
   WORKING                  IDLE              COMMUNICATION
```

Each servo sweeps between these three positions based on the agent's current state.

The lobster avatar physically moves between these zones depending on what the agent is doing at that moment. There is no screen refresh, no terminal output — just a small figure sliding across a tiny desk.

---

## 🎨 How You Know What's Happening

Each office has three ways of communicating agent state:

### **1. The servo** 
Moves the lobster to the right spot — working at the computer, resting on the sofa, or on the phone communicating with another agent.

### **2. The RGB LED** 
Changes color instantly:

| Color | Meaning |
|-------|---------|
| 🟡 Yellow | Agent is idle, waiting for work |
| 🔵 Blue | Agent is communicating — receiving or sending |
| 🟢 Green | Agent is working — processing, reasoning, executing |
| 🔴 Red | Something went wrong |

### **3. The LCD screen** 
Shows a short description of exactly what the agent is doing right now: *"Creating plan"*, *"Running research"*, *"Executing actions"*.

---
## 🛠️ Hardware

### Components

| Component | Qty | Purpose |
|-----------|-----|---------|
| ESP32 DevKit V1 | 1 | Main controller — WiFi, I2C, PWM |
| PCA9685 | 1 | I2C PWM driver for 3 servos (addr `0x40`) |
| SG90 Servo | 3 | Move each lobster avatar |
| LCD 16x2 + I2C module | 3 | Display current agent task |
| RGB LED (common cathode) | 3 | Visual state indicator |
| Resistor 220Ω | 9 | Current limiting for RGB LEDs (3 per LED) |
| Capacitor 1000µF / 10V | 1 | Voltage stabilizer on servo power rail |
| 5V / 5A Power Supply | 1 | Powers entire system |
| Protoboard + PCB 10×10 | 1 | Circuit integration |
| Terminals, wires | — | Connections |

---
## ⚙️ System Architecture

```
Telegram Bot
     │
     ▼
Backend (Python)
     │
     ├── OpenClaw Gateway
     │        │
     │        ├── Xocas  (Planner)    ← deepseek/deepseek-reasoner
     │        ├── Momo   (Researcher) ← deepseek/deepseek-chat
     │        └── Llados (Executor)   ← deepseek/deepseek-chat
     │
     ├── State Extractor  ──► REST API  ──► ESP32 (WiFi)
     │
     └── Pipeline: Xocas → Momo → Llados → Response
                                                │
                                          ESP32 Controls
                                        ┌──────┼──────┐
                                     Servos  LCDs  RGB LEDs
```

---

## 🔄 Workflow Example

**User sends via Telegram:** `/task organize my meetings tomorrow`

| Step | Agent | State | Physical |
|------|-------|-------|----------|
| 1 | All | `IDLE` | All lobsters on sofa, yellow LEDs |
| 2 | Xocas | `COMMUNICATION` | Moves to phone, blue LED, LCD: "Receiving task" |
| 3 | Xocas | `WORKING` | Moves to computer, green LED, LCD: "Creating plan" |
| 4 | Xocas | `COMMUNICATION` | Back to phone, LCD: "Sending plan" → `IDLE` |
| 5 | Momo | `COMMUNICATION` | Moves to phone, blue LED, LCD: "Receiving plan" |
| 6 | Momo | `WORKING` | Moves to computer, green LED, LCD: "Running research" |
| 7 | Momo | `COMMUNICATION` | Back to phone, LCD: "Sending research" → `IDLE` |
| 8 | Llados | `COMMUNICATION` | Moves to phone, blue LED, LCD: "Receiving data" |
| 9 | Llados | `WORKING` | Moves to computer, green LED, LCD: "Executing actions" |
| 10 | Llados | `COMMUNICATION` | Back to phone, LCD: "Sending response" → `IDLE` |
| ✅ | All | `IDLE` | LEDs blink green, LCD: "DONE — Ready" |

---
## 🧠 Built on OpenClaw

ClawCity wouldn't exist without [OpenClaw](https://docs.openclaw.ai).

OpenClaw is the framework that runs each agent as a fully isolated entity with its own memory, tools, and model. Xocas, Momo, and Llados each live in their own OpenClaw workspace — they don't share memory, they don't interfere with each other, and each one can be powered by a different model if needed.

The pipeline that connects them — Xocas plans → Momo researches → Llados executes — is orchestrated through OpenClaw's SDK, with each agent's state extracted in real time and sent to the physical hardware.

If you're curious about how OpenClaw works, their [documentation](https://docs.openclaw.ai) is the best place to start.

---

## 🌍 Why This Project Exists

Most people have no intuition for what multi-agent AI systems actually do. They know "AI" does something, but the process — the delegation, the specialization, the back-and-forth between agents — is completely opaque.

ClawCity tries to fix that. Not with a dashboard or a diagram, but with physical movement in a room. When a kid (or an investor, or a skeptic) watches three small lobsters shuffle around their offices in response to a single message, something clicks that a terminal window never achieves.

It's also just a fun thing to watch.

---

## 🔮 What's Next

- More agents, more offices — the city grows
- A web dashboard that mirrors the physical state in real time
- Computer vision to monitor the physical model
- Smart home integrations so Llados can control real devices
- Voice commands to trigger tasks without Telegram

---
## 👥 Team

### 🧠 AI & Software — Diego Torres
[![GitHub](https://img.shields.io/badge/GitHub-Diego31--10-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Diego31-10)

* AI architecture 
* Backend
* LLM integration
* OpenClaw pipeline
* Telegram bot

### ⚙️ Hardware & Electronics — Juan José Medina
[![GitHub](https://img.shields.io/badge/GitHub-JuanjoMedina23-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JuanjoMedina23)

* ESP32 firmware
* Circuit design
* PCB
* Physical model construction
---

## 📜 License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

*Built with 🦞 and ❤️*

**ClawCity** — *Where AI agents get a body*

</div>
