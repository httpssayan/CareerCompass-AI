from modules.extraction.extract_skills import extract_skills
from modules.skill_expansion.expand_skills import expand_skills
from modules.recommendation.recommend_career import recommend_careers
from modules.skill_gap.find_skill_gap import find_skill_gap
from modules.roadmap.generate_roadmap import generate_roadmap
from modules.resources.recommend_resources import recommend_resources


def run_pipeline(user_message):

    # Phase 5: extract skills
    extracted = extract_skills(user_message)

    # Phase 5.5: expand skills
    expanded = expand_skills(extracted)

    # Phase 6: recommend careers (top 3)
    top_careers = recommend_careers(expanded)

    # best career
    best_career = top_careers[0][0] if top_careers else None

    # Phase 7: skill gap
    missing_skills = find_skill_gap(best_career, expanded)

    # Phase 8: roadmap
    roadmap = generate_roadmap(best_career)

    # Phase 9: recommend resources
    resources = recommend_resources(missing_skills)

    result = {
        "detected_skills": extracted,
        "expanded_skills": expanded,
        "top_careers": top_careers,
        "recommended_career": best_career,
        "missing_skills": missing_skills,
        "roadmap": roadmap,
        "resources": resources
    }

    return result


if __name__ == "__main__":

    user_input = input("Tell me about your skills: ")

    output = run_pipeline(user_input)

    print("\nDetected Skills:", output["detected_skills"])

    print("\nTop Career Matches:")
    for career, score in output["top_careers"]:
        print(f"{career} → {score}%")

    print("\nRecommended Career:", output["recommended_career"])

    print("\nMissing Skills:")
    for skill in output["missing_skills"]:
        print("-", skill)

    print("\nLearning Roadmap:")
    for step in output["roadmap"]:
        print("-", step)
