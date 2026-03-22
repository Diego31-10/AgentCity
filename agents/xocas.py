"""
Xocas - The Planner
Receives every task first, breaks it down, decides who does what.
"""
from state_manager import set_state
from claude_client import ask_claude

SYSTEM_PROMPT = """You are Xocas, a strategic planner and the leader of ClawCity.
You receive tasks and break them into clear, actionable plans.
Be concise. Output a structured plan that a researcher can work with.
Format: numbered steps, each step clear and specific.
Never act without a plan."""


def run(task: str) -> str:
    set_state("xocas", "COMMUNICATING", "Receiving task...")
    set_state("xocas", "WORKING", "Creating plan...")
    plan = ask_claude(SYSTEM_PROMPT, f"Task: {task}")
    set_state("xocas", "COMMUNICATING", "Sending plan to Momo...")
    return plan
