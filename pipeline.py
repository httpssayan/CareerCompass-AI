from modules.extraction.extract_skills import extract_skills
from modules.skill_expansion.expand_skills import expand_skills
from modules.recommendation.recommend_career import recommend_careers
from modules.skill_gap.find_skill_gap import find_skill_gap
from modules.roadmap.generate_roadmap import generate_roadmap


def run_pipeline(user_message):

    # Phase 5: extract skills
    extracted = extract_skills(user_message)

    # Phase 5.5: expand skills
    expanded = expand_skills(extracted)

    # Phase 6: recommend careers
    recommendations = recommend_careers(expanded)

    # pick the best career
    best_career = recommendations[0][0]

    # Phase 7: skill gap
    missing_skills = find_skill_gap(best_career, expanded)

    # Phase 8: roadmap
    roadmap = generate_roadmap(best_career)

    result = {
        "detected_skills": extracted,
        "expanded_skills": expanded,
        "recommended_career": best_career,
        "missing_skills": missing_skills,
        "roadmap": roadmap
    }

    return result


if __name__ == "__main__":

    user_input = input("Tell me about your skills: ")

    output = run_pipeline(user_input)

    print("\nDetected Skills:", output["detected_skills"])
    print("\nRecommended Career:", output["recommended_career"])

    print("\nMissing Skills:")
    for skill in output["missing_skills"]:
        print("-", skill)

    print("\nLearning Roadmap:")
    for step in output["roadmap"]:
        print("-", step)