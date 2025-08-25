
import { GuidResolverMicrosoftEntraIdAdministrativeUnit } from "./GuidResolverMicrosoftEntraIdAdministrativeUnit";
import { GuidResolverMicrosoftEntraIdBase               } from "./GuidResolverMicrosoftEntraIdBase"                    ;
import { GuidResolverResponse                           } from "../Models/GuidResolverResponse"                        ;
import { IGuidResolver                                  } from "../GuidResolver"                                       ;
import { TokenCredential                                } from "@azure/identity"                                       ;

export class GuidResolverMicrosoftEntraIdAdministrativeUnitWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    private readonly guidResolverMicrosoftEntraIdAdministrativeUnit: GuidResolverMicrosoftEntraIdAdministrativeUnit;

    constructor(
        private readonly onResponse      : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                : string              ) => void,
        private readonly onProgressUpdate: (value               : string              ) => void,
        tokenCredential: TokenCredential
    ) {
        super(tokenCredential);
        this.guidResolverMicrosoftEntraIdAdministrativeUnit = new GuidResolverMicrosoftEntraIdAdministrativeUnit(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            // https://learn.microsoft.com/en-us/graph/api/resources/administrativeunit?view=graph-rest-1.0
            const administrativeUnit = await this.guidResolverMicrosoftEntraIdAdministrativeUnit.resolve(guid, new AbortController());
            const members            = await this.resolveAll(`/directory/administrativeUnits/${guid}/members`          , this.onResponse, _ => _, this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const scopedRoleMembers  = await this.resolveAll(`/directory/administrativeUnits/${guid}/scopedRoleMembers`, this.onResponse, _ => _, this.onToBeResolved, this.onProgressUpdate, new AbortController());

            if (administrativeUnit && administrativeUnit.displayName) {

                return new GuidResolverResponse(
                    guid,
                    administrativeUnit.displayName,
                    'Microsoft Entra ID Administrative Unit Details',
                    {
                        administrativeUnit,
                        members           : (members as any[])?.map(this.mapIdDisplayName).sort(),
                        scopedRoleMembers,
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
