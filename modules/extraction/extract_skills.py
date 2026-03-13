import json
import re

# skill aliases (common abbreviations)
skill_aliases = {
    "ml": "machine learning",
    "ai": "machine learning",
    "dl": "deep learning",
    "cv": "computer vision",
    "nlp": "natural language processing",
    "js": "javascript"
}

# load skills dataset
with open("datasets/skills.json", "r") as f:
    skills_data = json.load(f)

skills_list = skills_data["skills"]


def extract_skills(text):
    text = text.lower()
    detected_skills = []

    # detect full skill names
    for skill in skills_list:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text):
            detected_skills.append(skill)

    # detect aliases
    for alias, real_skill in skill_aliases.items():
        pattern = r"\b" + alias + r"\b"
        if re.search(pattern, text):
            detected_skills.append(real_skill)

    return list(set(detected_skills))