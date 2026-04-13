<div align="center">

# 🦞 AgentHQ

**A multi-agent AI system where three specialized agents collaborate — visualized in real-time on Terminal UI and Physical Hardware**

[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-7c3aed?style=flat-square)](https://openrouter.ai)
[![Claude](https://img.shields.io/badge/Model-Claude_Haiku-06b6d4?style=flat-square)](https://anthropic.com)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?style=flat-square)](https://nodejs.org)
[![ESP32](https://img.shields.io/badge/Hardware-ESP32-FF7043?style=flat-square)](https://www.espressif.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](./LICENSE)

*What if you could watch AI agents think, collaborate, and act — in real time?*

**Two ways to experience it:**
- 💻 **Terminal UI** — Full-screen dashboard in your terminal
- 🎭 **Physical Circuit** — ESP32 with servos, LEDs, and LCD displays

</div>

---

## 🌆 The Idea

AI agents are invisible — they live in terminals, logs, and API responses. You send a message, something happens, you get a reply.

**AgentHQ makes that invisible process visible.**

Three specialized agents work together to process any task. While they work, you watch them **live in a full-screen terminal dashboard** AND/OR on a **physical circuit with moving servos, color-changing LEDs, and live task text on LCD displays**. Each agent has a visual representation that changes based on what they're doing: resting on the sofa, working at the computer, or on the phone communicating with another agent.

---

## 🦞 The Residents

AgentHQ has three permanent residents, each one an AI agent with its own personality and role:

<div align="center">

| Name | Role | Personality |
|------|------|-------------|
| **Xocas** | Planner | The strategist. Receives every task first, breaks it down, and decides who does what. Never acts without a plan. |
| **Momo** | Researcher | The curious one. Takes Xocas's plan and enriches it with context, data, and insights. |
| **Llados** | Executor | The doer. Takes Momo's research and produces the final output — documents, reports, action plans. |

</div>

---

## 🏢 Their Office

```
[ 💻 Computer ] ──────── [ 🛋️ Sofa ] ──────── [ 📞 Phone ]
   WORKING                   IDLE              COMMUNICATION
```

Each agent moves between these three positions depending on what they're doing at that moment — visible in real time in the terminal dashboard.

---

## 🎨 Agent States (Live TUI)

```
╔══════════════════════════════════════════════════════════════════════════╗
║              === AGENTHQ  -  Multi-Agent Dashboard ===                   ║
╚══════════════════════════════════════════════════════════════════════════╝
┌─ XOCAS - Planner ──────┐  ┌─ MOMO - Researcher ────┐  ┌─ LLADOS - Executor ────┐
│   .--.                  │  │   .--.                  │  │   .--.                  │
│  (^  ^)                 │  │  (x  x)  zzz            │  │  (o  o) )))            │
│   \--/                  │  │   \--/                  │  │   \--/                  │
│  ->|  |  [=]            │  │  _/|  |\_               │  │  /|  |c                │
│  [ WORKING - At PC ]    │  │  [ IDLE - On sofa ]     │  │  [ COMM - On phone ]   │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

### State Colors

| Color | State | Meaning |
|-------|-------|---------|
| 🟡 Yellow | `IDLE` | Agent is resting, waiting for work |
| 🟢 Green | `WORKING` | Agent is processing — reasoning, writing, executing |
| 🔵 Cyan | `COMMUNICATING` | Agent is sending or receiving from another agent |

---

## ⚙️ System Architecture

```
              ┌─────────────────────────────────────┐
              │   User Input (TUI or REST API)      │
              └────────────────┬────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  AgentHQ Pipeline   │
                    │   Orchestrator      │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼──────┐      ┌─────▼──────┐      ┌─────▼──────┐
    │   XOCAS    │      │    MOMO    │      │   LLADOS   │
    │  (Planner) │      │(Researcher)│      │  (Executor)│
    │  Claude    │      │   Claude   │      │   Claude   │
    │   Haiku    │      │   Haiku    │      │   Haiku    │
    └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ State Manager       │
                    │ (Real-time updates) │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
     ┌──────▼────────┐              ┌──────────▼─────────┐
     │  TUI Display  │              │  REST API :5001    │
     │  (Terminal)   │              │  (Network)         │
     └───────────────┘              └──────────┬─────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  ESP32 Hardware │
                                      │  (Wi-Fi HTTP)   │
                                      └─────────────────┘
```

---

## 🔄 Workflow Example

**User types in TUI:** `organize my meetings for tomorrow`

| Step | Agent | State | Visual |
|------|-------|-------|--------|
| 1 | All | `IDLE` | All agents on sofa, yellow |
| 2 | Xocas | `COMMUNICATING` | On the phone, receiving task |
| 3 | Xocas | `WORKING` | At the computer, creating plan |
| 4 | Xocas | `COMMUNICATING` | On the phone, sending plan → `IDLE` |
| 5 | Momo | `COMMUNICATING` | On the phone, receiving plan |
| 6 | Momo | `WORKING` | At the computer, running research |
| 7 | Momo | `COMMUNICATING` | On the phone, sending research → `IDLE` |
| 8 | Llados | `COMMUNICATING` | On the phone, receiving data |
| 9 | Llados | `WORKING` | At the computer, executing |
| 10 | Llados | `COMMUNICATING` | On the phone, delivering result → `IDLE` |
| ✅ | All | `IDLE` | Pipeline complete |

---

## 📄 File Output

Llados generates output files in multiple formats. AgentCity auto-detects the format from your task description:

| What you say | Output format |
|---|---|
| "...Word document..." | `.docx` |
| "...PDF..." | `.pdf` |
| "...markdown..." | `.md` |
| "...text file..." | `.txt` |
| "...file..." (generic) | `.docx` (default) |

Files are saved directly to your Desktop.

---

## 🎭 Dual Visualization: Terminal UI + Physical Hardware

### 💻 Terminal User Interface (Node.js)
Real-time dashboard displaying all three agents with:
- Live state visualization (IDLE, WORKING, COMMUNICATING)
- ASCII art representations of each agent
- Color-coded states (Yellow, Green, Cyan)
- Task progress tracking

**Start it with:** `node src/main.js` or `.\launch.ps1` (Windows)

---

### 🌐 REST API — Bridges Terminal to Hardware
AgentHQ exposes a live state API on port `5001` that **streams real-time agent states** to connected ESP32 hardware:

```
GET /states   → real-time state of all 3 agents
GET /health   → health check
```

Example response:
```json
{
  "xocas":  { "state": "WORKING",        "task": "Creating plan..." },
  "momo":   { "state": "IDLE",           "task": "Waiting..." },
  "llados": { "state": "COMMUNICATING",  "task": "Sending response..." }
}
```

---

### 🎭 Physical Hardware (ESP32 Microcontroller)
The REST API directly controls a physical circuit with:

| Component | Qty | Purpose |
|-----------|-----|---------|
| **SG90 Servo Motors** | 3x | Agent movement (0°/90°/180° positions: PC/Sofa/Phone) |
| **RGB LEDs** | 3x | Color-coded agent states (Yellow/Green/Blue) |
| **16x2 LCD Displays** | 3x | Live task text display per agent |
| **PCA9685 PWM Driver** | 1x | Servo control via I2C |
| **Buzzer** | 1x | Audio feedback on state changes |
| **ESP32 WROOM-32** | 1x | Main controller (Wi-Fi HTTP client) |

**Status:** ✅ **Fully Assembled & Tested**
- Firmware compiled and uploaded to ESP32
- All servos calibrated and tested
- LCD displays configured with unique I2C addresses (0x27, 0x26, 0x25)
- Real-time polling every 500ms with adaptive backoff
- Auto-detects offline mode and shows visual feedback

---

## 🛠️ Tech Stack

### Backend (Node.js)
| Component | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| LLM | [OpenRouter](https://openrouter.ai) → `anthropic/claude-haiku-4-5` |
| Terminal UI | [blessed](https://github.com/chjj/blessed) |
| REST API | Express |
| File generation | docx, pdfkit |
| HTTP client | OpenAI-compatible SDK |

### Hardware (ESP32)
| Component | Library/Framework |
|---|---|
| Microcontroller | ESP32 WROOM-32 |
| Servo Control | Adafruit PWM Servo Driver (PCA9685 via I2C) |
| LCD Display | LiquidCrystal_I2C (16x2 HD44780) |
| JSON Parsing | ArduinoJson |
| WiFi/HTTP | ESP32 built-in HTTPClient |
| Firmware | Arduino IDE / PlatformIO compatible |

---

## 🚀 Setup

### Quick Start (TUI Only)

```bash
# 1. Clone the repo
git clone https://github.com/Diego31-10/agenthq.git
cd agenthq

# 2. Install dependencies
npm install

# 3. Add your OpenRouter API key
# Create a .env file:
echo "OPENROUTER_API_KEY=sk-or-v1-..." > .env

# 4. Run the TUI
node src/main.js
```

**Windows users:** Use `.\launch.ps1` to open in a new terminal window

---

### Full Setup (TUI + ESP32 Hardware)

#### Part 1: Node.js Backend
Follow the "Quick Start" steps above ✅

#### Part 2: ESP32 Hardware Setup
1. **Install Arduino IDE** or **PlatformIO**
2. **Add ESP32 board** to Arduino:
   - Board Manager → Search "ESP32" → Install "esp32 by Espressif Systems"
3. **Install required libraries** (Arduino Library Manager):
   - `Adafruit PWM Servo Driver Library`
   - `LiquidCrystal_I2C`
   - `ArduinoJson`
4. **Open the firmware:**
   - File → Open → `hardware/agentcity_esp32/agenthq_esp32/agenthq_esp32.ino`
5. **Configure WiFi & IP:**
   - Edit lines 30-35:
     ```cpp
     const char* WIFI_SSID     = "YOUR_SSID";
     const char* WIFI_PASSWORD = "YOUR_PASSWORD";
     const char* API_URL = "http://YOUR_PC_IP:5001/states";
     ```
6. **Compile & Upload:**
   - Select board: `ESP32 Dev Module`
   - Select port (COM3, /dev/ttyUSB0, etc.)
   - Click **Upload**

#### Part 3: Hardware Wiring
See `circuits/` folder for detailed pinout diagrams or follow the .ino comments:
- **PCA9685** → ESP32 (I2C: SDA=21, SCL=22)
- **3x SG90 Servos** → PCA9685 (channels 0, 1, 2)
- **3x RGB LEDs** → GPIO pins (see LED_XOCAS, LED_MOMO, LED_LLADOS)
- **3x LCD 16x2** → I2C addresses (0x27, 0x26, 0x25)
- **Buzzer** → GPIO 2

#### Part 4: Run Both Systems
```bash
# Terminal 1: Start Node.js backend (REST API will listen on :5001)
node src/main.js

# Terminal 2 (optional): Monitor ESP32 serial output
# Arduino IDE → Tools → Serial Monitor (115200 baud)
```

**Once both are running:**
- Type a task in the TUI
- Watch the agents work in the terminal
- Watch the servos, LEDs, and LCDs respond in real-time on the circuit

---

## 📁 Project Structure

```
agenthq/
├── src/
│   ├── main.js              # Entry point — TUI, pipeline, file saving
│   ├── agents.js            # Xocas, Momo, Llados agent logic
│   ├── claudeClient.js      # OpenRouter API client
│   ├── stateManager.js      # Real-time agent state tracking
│   ├── tui.js               # Terminal UI with blessed
│   ├── fileWriter.js        # Multi-format file output (.docx, .pdf, .md, .txt)
│   └── api.js               # REST API server (port 5001)
│
├── hardware/
│   └── agentcity_esp32/
│       └── agenthq_esp32/
│           └── agenthq_esp32.ino    # ✅ ESP32 Firmware
│                                    # • Servo control via PCA9685 (I2C 0x40)
│                                    # • RGB LED control (3x agents)
│                                    # • LCD display management (3x 16x2)
│                                    # • WiFi HTTP polling (:5001/states)
│                                    # • Buzzer audio feedback
│                                    # • Offline detection & adaptive polling
│
├── circuits/                        # (Reserved for circuit diagrams)
├── launch.ps1                       # Windows launcher script
├── package.json
├── .env.example                     # Environment template
└── README.md
```

---

---

## 🎬 Live Demonstration

### 🎥 Physical Circuit in Action
**[📹 INSERT DEMO VIDEO HERE - Shows ESP32 circuit responding in real-time]**

The demo video should show:
- ✅ **Servo motors** responding to agent state changes (rotating to 3 positions)
- ✅ **RGB LEDs** changing colors based on agent activity (Yellow/Green/Blue)
- ✅ **LCD displays** showing live task text with smooth scrolling
- ✅ **Buzzer** providing audio feedback on state transitions
- ✅ **WiFi integration** pulling live data from REST API running on PC

### 📊 What Happens During Execution

| Event | Terminal TUI | Physical Hardware |
|-------|---|---|
| **Task submitted** | Xocas → WORKING | Servo rotates to PC position, LED turns Green |
| **Communicating** | Xocas → COMMUNICATING | Servo rotates to Phone, LED turns Cyan, Buzzer beeps |
| **Idle** | Agent → IDLE | Servo returns to Sofa, LED turns Yellow |
| **New task arrives** | LCD updates | Task text scrolls on 16x2 display |
| **API Offline** | All IDLE | All servos → SOFA, LEDs → Red, LCD shows OFFLINE |

---

## 🔮 What's Next

- Web dashboard mirroring both TUI and hardware state simultaneously
- Llados with real tool access (calendar, email, web search)
- Voice input/output integration
- Add more agents → more servos, more LCDs
- IoT dashboard for monitoring multiple AgentHQ instances

---

## 🌍 Why This Project Exists

Most people have no intuition for what multi-agent AI systems actually do. They know "AI" does something, but the process — the delegation, the specialization, the back-and-forth between agents — is completely opaque.

AgentHQ tries to fix that. Not with a diagram, but with movement you can see. When you watch three agents shift states in real time in response to a single message, something clicks that a static API response never achieves.

---

## 📜 License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

*Built with 🦞 and ❤️*

**AgentHQ** — *Where AI agents get to work*

</div>
