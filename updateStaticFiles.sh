az policy definition list --query "[?policyType=='BuiltIn']"   --output json > ./static/azure-policies-builtin.json
az policy definition list --query "[?policyType=='Static']"    --output json > ./static/azure-policies-static.json
az role   definition list --query "[?roleType=='BuiltInRole']" --output json > ./static/azure-role-definitions-builtin.json


