import json

# load career skills dataset
with open("datasets/career_skills.json", "r") as f:
    career_data = json.load(f)


def find_skill_gap(career, user_skills):
    # normalize inputs
    career = career.lower()
    user_skills = set([skill.lower() for skill in user_skills])

    # get required skills for the career
    required_skills = career_data.get(career, [])

    # find missing skills
    missing_skills = []

    for skill in required_skills:
        if skill not in user_skills:
            missing_skills.append(skill)

    return missing_skills