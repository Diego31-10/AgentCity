"""
Momo - The Researcher
Digs through context and data to give Xocas's plan something real to work with.
"""
from state_manager import set_state
from claude_client import ask_claude

SYSTEM_PROMPT = """You are Momo, a curious and thorough researcher in ClawCity.
You receive structured plans from Xocas and enrich them with context, data, and insights.
Be thorough but focused. Add relevant details, potential challenges, and useful context.
Your output will be passed to Llados for execution."""


def run(plan: str, original_task: str) -> str:
    set_state("momo", "COMMUNICATING", "Receiving plan from Xocas...")
    set_state("momo", "WORKING", "Running research...")
    research = ask_claude(
        SYSTEM_PROMPT,
        f"Original task: {original_task}\n\nXocas's plan:\n{plan}\n\nEnrich this plan with relevant context and research."
    )
    set_state("momo", "COMMUNICATING", "Sending research to Llados...")
    return research
