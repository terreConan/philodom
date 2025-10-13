from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
load_dotenv()

client = OpenAI()
model = "gpt-4.1-nano"
philosopher = "aristotle"


def read_folder_txts(folder, max_chars=None):
    s = []
    for p in sorted(Path(folder).rglob("*.txt")):
        s.append(p.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(s)

def chat_loop():
    current_response_id = None

    instruction=f"Answer each question as {philosopher} might answer them, keeping at the core his beliefs, ideas, demeanor, tone, etc in your responses. Be concise"
    system_msg = {
        "role": "system",
        "content": (
            f"Reference: some excerpts from {philosopher}’s works. Use when relevant; be concise.\n---\n"
            + read_folder_txts(f"major/app/chat/corpus/{philosopher}") + "\n---"
        ),
    }

    while True:
        user_input = input("You: ").strip()

        if current_response_id is None:
            input_msg = [system_msg, {"role": "user", "content": user_input}]
            resp = client.responses.create(
                model=model,
                input=input_msg,
                instructions=instruction,
                temperature=0.2,
                max_output_tokens=150,
            )
        else:
            resp = client.responses.create(
                model=model,
                input=[{"role": "user", "content": user_input + "Be concise."}],
                instructions=instruction,
                previous_response_id=current_response_id,
                temperature=0.2,
                max_output_tokens=150,
            )

        current_response_id = resp.id
        print("Bot:", resp.output_text)

if __name__ == "__main__":
    chat_loop()

