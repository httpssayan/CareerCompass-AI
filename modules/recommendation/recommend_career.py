import json

# load career skills dataset
with open("datasets/career_skills.json", "r") as f:
    career_data = json.load(f)


def recommend_careers(user_skills, top_n=3):
    scores = {}

    for career, required_skills in career_data.items():
        matched = set(user_skills) & set(required_skills)

        if len(required_skills) == 0:
            score = 0
        else:
            score = len(matched) / len(required_skills)

        scores[career] = score

    # sort careers by score
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return ranked[:top_n]