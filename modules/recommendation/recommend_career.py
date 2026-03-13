import json

with open("datasets/career_skills.json","r") as f:
    career_data = json.load(f)


def recommend_careers(user_skills, top_n=3):

    scores = {}

    for career, skills in career_data.items():

        match_count = len(set(user_skills) & set(skills))

        score = match_count / len(skills)

        scores[career] = round(score * 100,2)

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return ranked[:top_n]