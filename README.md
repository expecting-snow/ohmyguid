# ohmyguid

![Sample](images/sample.png)

This extension provides CodeLens support for guids within text files by looking up
- Azure Advisor Recommendation Ids
- Azure Application Insights InstrumentationKey Ids
- Azure Log Analytics Workspace Ids
- Azure Management Group Ids
- Azure Policy Definition Ids
- Azure Role Definition Ids
- Azure Subscription Ids
- Azure Tag Ids
- Microsoft Entra Id AppRegistration and ServicePrincipal Ids<br/>[ id / appId / clientId / appRoles / oauth2PermissionScopes / federatedCredentials ]
- Microsoft Entra Id DirectoryObject Ids
- Microsoft Entra Id Group Ids
- Microsoft Entra Id User Ids

in

- yaml
- bicep
- markdown
- json

files.

## Features

Use the command 'OhMyGuid: LookUp' to enter a guid an look it up.

## Telemetry

Telemetry collecting follows guidelines in [Telemetry extension authors guide](https://code.visualstudio.com/api/extension-guides/telemetry) using [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry).

Configure the `telemetry.telemetryLevel` in [user settings](vscode://settings/telemetry.telemetryLevel).
 

Dump of all Visual Studio Code telemetry on the command line with `code --telemetry`.


## Requirements

please log in with the Azure CLI

## Extension Settings

no settings are currently supported

## Known Issues

all feedback is welcome and appreciated at https://github.com/expecting-snow/ohmyguid/issues

## Release Notes

### 0.0.x

all is beta before 1.0

**Happy hacking!**
