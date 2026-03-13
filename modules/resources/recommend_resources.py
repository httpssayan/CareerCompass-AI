import json

with open("datasets/resources.json","r") as f:
    resource_data = json.load(f)


def recommend_resources(missing_skills):

    resources = {}

    for skill in missing_skills:

        if skill in resource_data:
            resources[skill] = resource_data[skill]

    return resources