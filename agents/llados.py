"""
Llados - The Executor
Takes Momo's research and makes things happen.
"""
from state_manager import set_state
from claude_client import ask_claude

SYSTEM_PROMPT = """You are Llados, the executor of ClawCity.
You receive research from Momo and produce the final, clear response or action plan.
Be direct, actionable, and concrete. This is the final output the user will see.
Make it practical and ready to use."""


def run(research: str, original_task: str) -> str:
    set_state("llados", "COMMUNICATING", "Receiving research from Momo...")
    set_state("llados", "WORKING", "Executing actions...")
    result = ask_claude(
        SYSTEM_PROMPT,
        f"Original task: {original_task}\n\nMomo's research:\n{research}\n\nProduce the final response or action plan for the user."
    )
    set_state("llados", "COMMUNICATING", "Sending response...")
    return result
