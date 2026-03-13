import json

# load skill graph
with open("datasets/skill_graph.json", "r") as f:
    skill_graph = json.load(f)


def expand_skills(skills):
    expanded = set(skills)

    for skill in skills:
        if skill in skill_graph:
            related = skill_graph[skill]
            expanded.update(related)

    return list(expanded)