import json

# load roadmap dataset
with open("datasets/roadmaps.json", "r") as f:
    roadmap_data = json.load(f)


def generate_roadmap(career):
    career = career.lower()
    return roadmap_data.get(career, [])