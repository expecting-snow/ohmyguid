az policy definition list --query "[?policyType=='BuiltIn']"   --output json > ./static/azure-policies-builtin.json
az policy definition list --query "[?policyType=='Static']"    --output json > ./static/azure-policies-static.json

# tod remove CustomRole
az role   definition list --query "[?roleType=='BuiltInRole']" --query '[].{description:description,name:name,permissions:permissions,roleName:roleName,roleType:roleType,type:type}' --output json > ./static/azure-role-definitions-builtin.json

# todo: output contains duplicates, need to filter them out
az advisor recommendation list --query '[].{category:category,impact:impact,impactedField:impactedField,recommendationTypeId:recommendationTypeId,risk:risk,shortDescription:shortDescription,type:type}' --output json --output json > ./static/azure-advisor-recommendations.json

 
  