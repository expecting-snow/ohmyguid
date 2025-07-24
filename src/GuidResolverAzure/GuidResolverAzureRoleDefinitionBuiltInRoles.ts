import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureRoleDefinitionBuiltInRoles {
    static resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        var role = GuidResolverAzureRoleDefinitionBuiltInRoles.builtInRoles.find(role => role.name === guid);

        if (role === undefined) {
            return Promise.resolve(undefined);
        }
        
        abortController.abort();

        return Promise.resolve(
            new GuidResolverResponse(
                role.name,
                role.roleName,
                "Azure RoleDefinition BuiltInRole",
                role,
                new Date()
            )
        );
    }

    private static readonly builtInRoles = [
        {
            name: "8311e382-0749-4cb8-b61a-304f252e45ec",
            roleName: "AcrPush"
        },
        {
            name: "312a565d-c81f-4fd8-895a-4e21e48d571c",
            roleName: "API Management Service Contributor"
        },
        {
            name: "7f951dda-4ed3-4680-a7ca-43fe172d538d",
            roleName: "AcrPull"
        },
        {
            name: "6cef56e8-d556-48e5-a04f-b8e64114680f",
            roleName: "AcrImageSigner"
        },
        {
            name: "c2f4ef07-c644-48eb-af81-4b1b4947fb11",
            roleName: "AcrDelete"
        },
        {
            name: "cdda3590-29a3-44f6-95f2-9f980659eb04",
            roleName: "AcrQuarantineReader"
        },
        {
            name: "c8d4ff99-41c3-41a8-9f60-21dfdad59608",
            roleName: "AcrQuarantineWriter"
        },
        {
            name: "e022efe7-f5ba-4159-bbe4-b44f577e9b61",
            roleName: "API Management Service Operator Role"
        },
        {
            name: "71522526-b88f-4d52-b57f-d31fc3546d0d",
            roleName: "API Management Service Reader Role"
        },
        {
            name: "ae349356-3a1b-4a5e-921d-050484c6347e",
            roleName: "Application Insights Component Contributor"
        },
        {
            name: "08954f03-6346-4c2e-81c0-ec3a5cfae23b",
            roleName: "Application Insights Snapshot Debugger"
        },
        {
            name: "fd1bd22b-8476-40bc-a0bc-69b95687b9f3",
            roleName: "Attestation Reader"
        },
        {
            name: "4fe576fe-1146-4730-92eb-48519fa6bf9f",
            roleName: "Automation Job Operator"
        },
        {
            name: "5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
            roleName: "Automation Runbook Operator"
        },
        {
            name: "d3881f73-407a-4167-8283-e981cbba0404",
            roleName: "Automation Operator"
        },
        {
            name: "4f8fab4f-1852-4a58-a46a-8eaf358af14a",
            roleName: "Avere Contributor"
        },
        {
            name: "c025889f-8102-4ebf-b32c-fc0c6f0c6bd9",
            roleName: "Avere Operator"
        },
        {
            name: "0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
            roleName: "Azure Kubernetes Service Cluster Admin Role"
        },
        {
            name: "4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
            roleName: "Azure Kubernetes Service Cluster User Role"
        },
        {
            name: "423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
            roleName: "Azure Maps Data Reader"
        },
        {
            name: "6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
            roleName: "Azure Stack Registration Owner"
        },
        {
            name: "5e467623-bb1f-42f4-a55d-6e525e11384b",
            roleName: "Backup Contributor"
        },
        {
            name: "fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
            roleName: "Billing Reader"
        },
        {
            name: "a795c7a0-d4a2-40c1-ae25-d81f01202912",
            roleName: "Backup Reader"
        },
        {
            name: "31a002a1-acaf-453e-8a5b-297c9ca1ea24",
            roleName: "Blockchain Member Node Access (Preview)"
        },
        {
            name: "5e3c6656-6cfa-4708-81fe-0de47ac73342",
            roleName: "BizTalk Contributor"
        },
        {
            name: "426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
            roleName: "CDN Endpoint Contributor"
        },
        {
            name: "ec156ff8-a8d1-4d15-830c-5b80698ca432",
            roleName: "CDN Profile Contributor"
        },
        {
            name: "8f96442b-4075-438f-813d-ad51ab4019af",
            roleName: "CDN Profile Reader"
        },
        {
            name: "b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
            roleName: "Classic Network Contributor"
        },
        {
            name: "86e8f5dc-a6e9-4c67-9d15-de283e8eac25",
            roleName: "Classic Storage Account Contributor"
        },
        {
            name: "985d6b00-f706-48f5-a6fe-d0ca12fb668d",
            roleName: "Classic Storage Account Key Operator Service Role"
        },
        {
            name: "9106cda0-8a86-4e81-b686-29a22c54effe",
            roleName: "ClearDB MySQL DB Contributor"
        },
        {
            name: "d73bb868-a0df-4d4d-bd69-98a00b01fccb",
            roleName: "Classic Virtual Machine Contributor"
        },
        {
            name: "a97b65f3-24c7-4388-baec-2e87135dc908",
            roleName: "Cognitive Services User"
        },
        {
            name: "b59867f0-fa02-499b-be73-45a86b5b3e1c",
            roleName: "Cognitive Services Data Reader"
        },
        {
            name: "25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
            roleName: "Cognitive Services Contributor"
        },
        {
            name: "db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
            roleName: "CosmosBackupOperator"
        },
        {
            name: "b24988ac-6180-42a0-ab88-20f7382dd24c",
            roleName: "Contributor"
        },
        {
            name: "fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
            roleName: "Cosmos DB Account Reader Role"
        },
        {
            name: "434105ed-43f6-45c7-a02f-909b2ba83430",
            roleName: "Cost Management Contributor"
        },
        {
            name: "72fafb9e-0641-4937-9268-a91bfd8191a3",
            roleName: "Cost Management Reader"
        },
        {
            name: "add466c9-e687-43fc-8d98-dfcf8d720be5",
            roleName: "Data Box Contributor"
        },
        {
            name: "028f4ed7-e2a9-465e-a8f4-9c0ffdfdc027",
            roleName: "Data Box Reader"
        },
        {
            name: "673868aa-7521-48a0-acc6-0f60742d39f5",
            roleName: "Data Factory Contributor"
        },
        {
            name: "150f5e0c-0603-4f03-8c7f-cf70034c4e90",
            roleName: "Data Purger"
        },
        {
            name: "47b7735b-770e-4598-a7da-8b91488b4c88",
            roleName: "Data Lake Analytics Developer"
        },
        {
            name: "76283e04-6283-4c54-8f91-bcf1374a3c64",
            roleName: "DevTest Labs User"
        },
        {
            name: "5bd9cd88-fe45-4216-938b-f97437e15450",
            roleName: "DocumentDB Account Contributor"
        },
        {
            name: "befefa01-2a29-4197-83a8-272ff33ce314",
            roleName: "DNS Zone Contributor"
        },
        {
            name: "428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
            roleName: "EventGrid EventSubscription Contributor"
        },
        {
            name: "2414bbcf-6497-4faf-8c65-045460748405",
            roleName: "EventGrid EventSubscription Reader"
        },
        {
            name: "b60367af-1334-4454-b71e-769d9a4f83d9",
            roleName: "Graph Owner"
        },
        {
            name: "8d8d5a11-05d3-4bda-a417-a08778121c7c",
            roleName: "HDInsight Domain Services Contributor"
        },
        {
            name: "03a6d094-3444-4b3d-88af-7477090a9e5e",
            roleName: "Intelligent Systems Account Contributor"
        },
        {
            name: "f25e0fa2-a7c8-4377-a976-54943a77a395",
            roleName: "Key Vault Contributor"
        },
        {
            name: "ee361c5d-f7b5-4119-b4b6-892157c8f64c",
            roleName: "Knowledge Consumer"
        },
        {
            name: "b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
            roleName: "Lab Creator"
        },
        {
            name: "73c42c96-874c-492b-b04d-ab87d138a893",
            roleName: "Log Analytics Reader"
        },
        {
            name: "92aaf0da-9dab-42b6-94a3-d43ce8d16293",
            roleName: "Log Analytics Contributor"
        },
        {
            name: "515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
            roleName: "Logic App Operator"
        },
        {
            name: "87a39d53-fc1b-424a-814c-f7e04687dc9e",
            roleName: "Logic App Contributor"
        },
        {
            name: "c7393b34-138c-406f-901b-d8cf2b17e6ae",
            roleName: "Managed Application Operator Role"
        },
        {
            name: "b9331d33-8a36-4f8c-b097-4f54124fdb44",
            roleName: "Managed Application Publisher Operator"
        },
        {
            name: "f1a07417-d97a-45cb-824c-7a7467783830",
            roleName: "Managed Identity Operator"
        },
        {
            name: "e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
            roleName: "Managed Identity Contributor"
        },
        {
            name: "5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
            roleName: "Management Group Contributor"
        },
        {
            name: "ac63b705-f282-497d-ac71-919bf39d939d",
            roleName: "Management Group Reader"
        },
        {
            name: "43d0d8ad-25c7-4714-9337-8ba259a9fe05",
            roleName: "Monitoring Reader"
        },
        {
            name: "4d97b98b-1d4f-4787-a291-c67834d212e7",
            roleName: "Network Contributor"
        },
        {
            name: "5d28c62d-5b37-4476-8438-e587778df237",
            roleName: "New Relic APM Account Contributor"
        },
        {
            name: "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
            roleName: "Owner"
        },
        {
            name: "acdd72a7-3385-48ef-bd42-f606fba81ae7",
            roleName: "Reader"
        },
        {
            name: "e0f68234-74aa-48ed-b826-c38b57376e17",
            roleName: "Redis Cache Contributor"
        },
        {
            name: "c12c1c16-33a1-487b-954d-41c89c60f349",
            roleName: "Reader and Data Access"
        },
        {
            name: "36243c78-bf99-498c-9df9-86d9f8d28608",
            roleName: "Resource Policy Contributor"
        },
        {
            name: "188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
            roleName: "Scheduler Job Collections Contributor"
        },
        {
            name: "7ca78c08-252a-4471-8644-bb5ff32d4ba0",
            roleName: "Search Service Contributor"
        },
        {
            name: "e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
            roleName: "Security Manager (Legacy)"
        },
        {
            name: "39bc4728-0917-49c7-9d2c-d95423bc2eb4",
            roleName: "Security Reader"
        },
        {
            name: "8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827",
            roleName: "Spatial Anchors Account Contributor"
        },
        {
            name: "6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
            roleName: "Site Recovery Contributor"
        },
        {
            name: "494ae006-db33-4328-bf46-533a6560a3ca",
            roleName: "Site Recovery Operator"
        },
        {
            name: "5d51204f-eb77-4b1c-b86a-2ec626c49413",
            roleName: "Spatial Anchors Account Reader"
        },
        {
            name: "dbaa88c4-0c30-4179-9fb3-46319faa6149",
            roleName: "Site Recovery Reader"
        },
        {
            name: "70bbe301-9835-447d-afdd-19eb3167307c",
            roleName: "Spatial Anchors Account Owner"
        },
        {
            name: "4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
            roleName: "SQL Managed Instance Contributor"
        },
        {
            name: "9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
            roleName: "SQL DB Contributor"
        },
        {
            name: "056cd41c-7e88-42e1-933e-88ba6a50c9c3",
            roleName: "SQL Security Manager"
        },
        {
            name: "17d1049b-9a84-46fb-8f53-869881c3d3ab",
            roleName: "Storage Account Contributor"
        },
        {
            name: "6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
            roleName: "SQL Server Contributor"
        },
        {
            name: "81a9662b-bebf-436f-a333-f67b29880f12",
            roleName: "Storage Account Key Operator Service Role"
        },
        {
            name: "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
            roleName: "Storage Blob Data Contributor"
        },
        {
            name: "b7e6dc6d-f1e8-4753-8033-0f276bb0955b",
            roleName: "Storage Blob Data Owner"
        },
        {
            name: "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
            roleName: "Storage Blob Data Reader"
        },
        {
            name: "974c5e8b-45b9-4653-ba55-5f855dd0fb88",
            roleName: "Storage Queue Data Contributor"
        },
        {
            name: "8a0f0c08-91a1-4084-bc3d-661d67233fed",
            roleName: "Storage Queue Data Message Processor"
        },
        {
            name: "c6a89b2d-59bc-44d0-9896-0f6e12d7b80a",
            roleName: "Storage Queue Data Message Sender"
        },
        {
            name: "19e7f393-937e-4f77-808e-94535e297925",
            roleName: "Storage Queue Data Reader"
        },
        {
            name: "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
            roleName: "Support Request Contributor"
        },
        {
            name: "a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
            roleName: "Traffic Manager Contributor"
        },
        {
            name: "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
            roleName: "User Access Administrator"
        },
        {
            name: "9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
            roleName: "Virtual Machine Contributor"
        },
        {
            name: "2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
            roleName: "Web Plan Contributor"
        },
        {
            name: "de139f84-1756-47ae-9be6-808fbbe84772",
            roleName: "Website Contributor"
        },
        {
            name: "090c5cfd-751d-490a-894a-3ce6f1109419",
            roleName: "Azure Service Bus Data Owner"
        },
        {
            name: "f526a384-b230-433a-b45c-95f59c4a2dec",
            roleName: "Azure Event Hubs Data Owner"
        },
        {
            name: "bbf86eb8-f7b4-4cce-96e4-18cddf81d86e",
            roleName: "Attestation Contributor"
        },
        {
            name: "61ed4efc-fab3-44fd-b111-e24485cc132a",
            roleName: "HDInsight Cluster Operator"
        },
        {
            name: "230815da-be43-4aae-9cb4-875f7bd000aa",
            roleName: "Cosmos DB Operator"
        },
        {
            name: "48b40c6e-82e0-4eb3-90d5-19e40f49b624",
            roleName: "Hybrid Server Resource Administrator"
        },
        {
            name: "5d1e5ee4-7c68-4a71-ac8b-0739630a3dfb",
            roleName: "Hybrid Server Onboarding"
        },
        {
            name: "a638d3c7-ab3a-418d-83e6-5f17a39d4fde",
            roleName: "Azure Event Hubs Data Receiver"
        },
        {
            name: "2b629674-e913-4c01-ae53-ef4638d8f975",
            roleName: "Azure Event Hubs Data Sender"
        },
        {
            name: "4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
            roleName: "Azure Service Bus Data Receiver"
        },
        {
            name: "69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
            roleName: "Azure Service Bus Data Sender"
        },
        {
            name: "aba4ae5f-2193-4029-9191-0cb91df5e314",
            roleName: "Storage File Data SMB Share Reader"
        },
        {
            name: "0c867c2a-1d8c-454a-a3db-ab2ea1bdc8bb",
            roleName: "Storage File Data SMB Share Contributor"
        },
        {
            name: "b12aa53e-6015-4669-85d0-8515ebb3ae7f",
            roleName: "Private DNS Zone Contributor"
        },
        {
            name: "db58b8e5-c6ad-4a2a-8342-4190687cbf4a",
            roleName: "Storage Blob Delegator"
        },
        {
            name: "1d18fff3-a72a-46b5-b4a9-0b38a3cd7e63",
            roleName: "Desktop Virtualization User"
        },
        {
            name: "a7264617-510b-434b-a828-9731dc254ea7",
            roleName: "Storage File Data SMB Share Elevated Contributor"
        },
        {
            name: "41077137-e803-4205-871c-5a86e6a753b4",
            roleName: "Blueprint Contributor"
        },
        {
            name: "437d2ced-4a38-4302-8479-ed2bcb43d090",
            roleName: "Blueprint Operator"
        },
        {
            name: "ab8e14d6-4a74-4a29-9ba8-549422addade",
            roleName: "Microsoft Sentinel Contributor"
        },
        {
            name: "3e150937-b8fe-4cfb-8069-0eaf05ecd056",
            roleName: "Microsoft Sentinel Responder"
        },
        {
            name: "8d289c81-5878-46d4-8554-54e1e3d8b5cb",
            roleName: "Microsoft Sentinel Reader"
        },
        {
            name: "66bb4e9e-b016-4a94-8249-4c0511c2be84",
            roleName: "Policy Insights Data Writer (Preview)"
        },
        {
            name: "04165923-9d83-45d5-8227-78b77b0a687e",
            roleName: "SignalR AccessKey Reader"
        },
        {
            name: "8cf5e20a-e4b2-4e9d-b3a1-5ceb692c2761",
            roleName: "SignalR/Web PubSub Contributor"
        },
        {
            name: "b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
            roleName: "Azure Connected Machine Onboarding"
        },
        {
            name: "91c1777a-f3dc-4fae-b103-61d183457e46",
            roleName: "Managed Services Registration assignment Delete Role"
        },
        {
            name: "5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
            roleName: "App Configuration Data Owner"
        },
        {
            name: "516239f1-63e1-4d78-a4de-a74fb236a071",
            roleName: "App Configuration Data Reader"
        },
        {
            name: "34e09817-6cbe-4d01-b1a2-e0eac5743d41",
            roleName: "Kubernetes Cluster - Azure Arc Onboarding"
        },
        {
            name: "7f646f1b-fa08-80eb-a22b-edd6ce5c915c",
            roleName: "Experimentation Contributor"
        },
        {
            name: "466ccd10-b268-4a11-b098-b4849f024126",
            roleName: "Cognitive Services QnA Maker Reader"
        },
        {
            name: "f4cc2bf9-21be-47a1-bdf1-5c5804381025",
            roleName: "Cognitive Services QnA Maker Editor"
        },
        {
            name: "7f646f1b-fa08-80eb-a33b-edd6ce5c915c",
            roleName: "Experimentation Administrator"
        },
        {
            name: "3df8b902-2a6f-47c7-8cc5-360e9b272a7e",
            roleName: "Remote Rendering Administrator"
        },
        {
            name: "d39065c4-c120-43c9-ab0a-63eed9795f0a",
            roleName: "Remote Rendering Client"
        },
        {
            name: "641177b8-a67a-45b9-a033-47bc880bb21e",
            roleName: "Managed Application Contributor Role"
        },
        {
            name: "612c2aa1-cb24-443b-ac28-3ab7272de6f5",
            roleName: "Security Assessment Contributor"
        },
        {
            name: "4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
            roleName: "Tag Contributor"
        },
        {
            name: "c7aa55d3-1abb-444a-a5ca-5e51e485d6ec",
            roleName: "Integration Service Environment Developer"
        },
        {
            name: "a41e2c5b-bd99-4a07-88f4-9bf657a760b8",
            roleName: "Integration Service Environment Contributor"
        },
        {
            name: "ed7f3fbd-7b88-4dd4-9017-9adb7ce333f8",
            roleName: "Azure Kubernetes Service Contributor Role"
        },
        {
            name: "d57506d4-4c8d-48b1-8587-93c323f6a5a3",
            roleName: "Azure Digital Twins Data Reader"
        },
        {
            name: "bcd981a7-7f74-457b-83e1-cceb9e632ffe",
            roleName: "Azure Digital Twins Data Owner"
        },
        {
            name: "350f8d15-c687-4448-8ae1-157740a3936d",
            roleName: "Hierarchy Settings Administrator"
        },
        {
            name: "5a1fc7df-4bf1-4951-a576-89034ee01acd",
            roleName: "FHIR Data Contributor"
        },
        {
            name: "3db33094-8700-4567-8da5-1501d4e7e843",
            roleName: "FHIR Data Exporter"
        },
        {
            name: "4c8d0bbc-75d3-4935-991f-5f3c56d81508",
            roleName: "FHIR Data Reader"
        },
        {
            name: "3f88fce4-5892-4214-ae73-ba5294559913",
            roleName: "FHIR Data Writer"
        },
        {
            name: "49632ef5-d9ac-41f4-b8e7-bbe587fa74a1",
            roleName: "Experimentation Reader"
        },
        {
            name: "4dd61c23-6743-42fe-a388-d8bdd41cb745",
            roleName: "Object Understanding Account Owner"
        },
        {
            name: "8f5e0ce6-4f7b-4dcf-bddf-e6f48634a204",
            roleName: "Azure Maps Data Contributor"
        },
        {
            name: "c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
            roleName: "Cognitive Services Custom Vision Contributor"
        },
        {
            name: "5c4089e1-6d96-4d2f-b296-c1bc7137275f",
            roleName: "Cognitive Services Custom Vision Deployment"
        },
        {
            name: "88424f51-ebe7-446f-bc41-7fa16989e96c",
            roleName: "Cognitive Services Custom Vision Labeler"
        },
        {
            name: "93586559-c37d-4a6b-ba08-b9f0940c2d73",
            roleName: "Cognitive Services Custom Vision Reader"
        },
        {
            name: "0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
            roleName: "Cognitive Services Custom Vision Trainer"
        },
        {
            name: "00482a5a-887f-4fb3-b363-3b7fe8e74483",
            roleName: "Key Vault Administrator"
        },
        {
            name: "12338af0-0e69-4776-bea7-57ae8d297424",
            roleName: "Key Vault Crypto User"
        },
        {
            name: "b86a8fe4-44ce-4948-aee5-eccb2c155cd7",
            roleName: "Key Vault Secrets Officer"
        },
        {
            name: "4633458b-17de-408a-b874-0445c86b69e6",
            roleName: "Key Vault Secrets User"
        },
        {
            name: "a4417e6f-fecd-4de8-b567-7b0420556985",
            roleName: "Key Vault Certificates Officer"
        },
        {
            name: "21090545-7ca7-4776-b22c-e363652d74d2",
            roleName: "Key Vault Reader"
        },
        {
            name: "e147488a-f6f5-4113-8e2d-b22465e65bf6",
            roleName: "Key Vault Crypto Service Encryption User"
        },
        {
            name: "63f0a09d-1495-4db4-a681-037d84835eb4",
            roleName: "Azure Arc Kubernetes Viewer"
        },
        {
            name: "5b999177-9696-4545-85c7-50de3797e5a1",
            roleName: "Azure Arc Kubernetes Writer"
        },
        {
            name: "8393591c-06b9-48a2-a542-1bd6b377f6a2",
            roleName: "Azure Arc Kubernetes Cluster Admin"
        },
        {
            name: "dffb1e0c-446f-4dde-a09f-99eb5cc68b96",
            roleName: "Azure Arc Kubernetes Admin"
        },
        {
            name: "b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b",
            roleName: "Azure Kubernetes Service RBAC Cluster Admin"
        },
        {
            name: "3498e952-d568-435e-9b2c-8d77e338d7f7",
            roleName: "Azure Kubernetes Service RBAC Admin"
        },
        {
            name: "7f6c6a51-bcf8-42ba-9220-52d62157d7db",
            roleName: "Azure Kubernetes Service RBAC Reader"
        },
        {
            name: "a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb",
            roleName: "Azure Kubernetes Service RBAC Writer"
        },
        {
            name: "82200a5b-e217-47a5-b665-6d8765ee745b",
            roleName: "Services Hub Operator"
        },
        {
            name: "d18777c0-1514-4662-8490-608db7d334b6",
            roleName: "Object Understanding Account Reader"
        },
        {
            name: "fd53cd77-2268-407a-8f46-7e7863d0f521",
            roleName: "SignalR REST API Owner"
        },
        {
            name: "daa9e50b-21df-454c-94a6-a8050adab352",
            roleName: "Collaborative Data Contributor"
        },
        {
            name: "e9dba6fb-3d52-4cf0-bce3-f06ce71b9e0f",
            roleName: "Device Update Reader"
        },
        {
            name: "02ca0879-e8e4-47a5-a61e-5c618b76e64a",
            roleName: "Device Update Administrator"
        },
        {
            name: "0378884a-3af5-44ab-8323-f5b22f9f3c98",
            roleName: "Device Update Content Administrator"
        },
        {
            name: "d1ee9a80-8b14-47f0-bdc2-f4a351625a7b",
            roleName: "Device Update Content Reader"
        },
        {
            name: "cb43c632-a144-4ec5-977c-e80c4affc34a",
            roleName: "Cognitive Services Metrics Advisor Administrator"
        },
        {
            name: "3b20f47b-3825-43cb-8114-4bd2201156a8",
            roleName: "Cognitive Services Metrics Advisor User"
        },
        {
            name: "2c56ea50-c6b3-40a6-83c0-9d98858bc7d2",
            roleName: "Schema Registry Reader"
        },
        {
            name: "5dffeca3-4936-4216-b2bc-10343a5abb25",
            roleName: "Schema Registry Contributor"
        },
        {
            name: "7ec7ccdc-f61e-41fe-9aaf-980df0a44eba",
            roleName: "AgFood Platform Service Reader"
        },
        {
            name: "8508508a-4469-4e45-963b-2518ee0bb728",
            roleName: "AgFood Platform Service Contributor"
        },
        {
            name: "f8da80de-1ff9-4747-ad80-a19b7f6079e3",
            roleName: "AgFood Platform Service Admin"
        },
        {
            name: "18500a29-7fe2-46b2-a342-b16a415e101d",
            roleName: "Managed HSM contributor"
        },
        {
            name: "0b555d9b-b4a7-4f43-b330-627f0e5be8f0",
            roleName: "Security Detonation Chamber Submitter"
        },
        {
            name: "ddde6b66-c0df-4114-a159-3618637b3035",
            roleName: "SignalR REST API Reader"
        },
        {
            name: "7e4f1700-ea5a-4f59-8f37-079cfe29dce3",
            roleName: "SignalR Service Owner"
        },
        {
            name: "f7b75c60-3036-4b75-91c3-6b41c27c1689",
            roleName: "Reservation Purchaser"
        },
        {
            name: "635dd51f-9968-44d3-b7fb-6d9a6bd613ae",
            roleName: "AzureML Metrics Writer (preview)"
        },
        {
            name: "e5e2a7ff-d759-4cd2-bb51-3152d37e2eb1",
            roleName: "Storage Account Backup Contributor"
        },
        {
            name: "6188b7c9-7d01-4f99-a59f-c88b630326c0",
            roleName: "Experimentation Metric Contributor"
        },
        {
            name: "9ef4ef9c-a049-46b0-82ab-dd8ac094c889",
            roleName: "Project Babylon Data Curator"
        },
        {
            name: "c8d896ba-346d-4f50-bc1d-7d1c84130446",
            roleName: "Project Babylon Data Reader"
        },
        {
            name: "05b7651b-dc44-475e-b74d-df3db49fae0f",
            roleName: "Project Babylon Data Source Administrator"
        },
        {
            name: "ca6382a4-1721-4bcf-a114-ff0c70227b6b",
            roleName: "Application Group Contributor"
        },
        {
            name: "49a72310-ab8d-41df-bbb0-79b649203868",
            roleName: "Desktop Virtualization Reader"
        },
        {
            name: "082f0a83-3be5-4ba1-904c-961cca79b387",
            roleName: "Desktop Virtualization Contributor"
        },
        {
            name: "21efdde3-836f-432b-bf3d-3e8e734d4b2b",
            roleName: "Desktop Virtualization Workspace Contributor"
        },
        {
            name: "ea4bfff8-7fb4-485a-aadd-d4129a0ffaa6",
            roleName: "Desktop Virtualization User Session Operator"
        },
        {
            name: "2ad6aaab-ead9-4eaa-8ac5-da422f562408",
            roleName: "Desktop Virtualization Session Host Operator"
        },
        {
            name: "ceadfde2-b300-400a-ab7b-6143895aa822",
            roleName: "Desktop Virtualization Host Pool Reader"
        },
        {
            name: "e307426c-f9b6-4e81-87de-d99efb3c32bc",
            roleName: "Desktop Virtualization Host Pool Contributor"
        },
        {
            name: "aebf23d0-b568-4e86-b8f9-fe83a2c6ab55",
            roleName: "Desktop Virtualization Application Group Reader"
        },
        {
            name: "86240b0e-9422-4c43-887b-b61143f32ba8",
            roleName: "Desktop Virtualization Application Group Contributor"
        },
        {
            name: "0fa44ee9-7a7d-466b-9bb2-2bf446b1204d",
            roleName: "Desktop Virtualization Workspace Reader"
        },
        {
            name: "3e5e47e6-65f7-47ef-90b5-e5dd4d455f24",
            roleName: "Disk Backup Reader"
        },
        {
            name: "b50d9833-a0cb-478e-945f-707fcc997c13",
            roleName: "Disk Restore Operator"
        },
        {
            name: "7efff54f-a5b4-42b5-a1c5-5411624893ce",
            roleName: "Disk Snapshot Contributor"
        },
        {
            name: "5548b2cf-c94c-4228-90ba-30851930a12f",
            roleName: "Microsoft.Kubernetes connected cluster role"
        },
        {
            name: "a37b566d-3efa-4beb-a2f2-698963fa42ce",
            roleName: "Security Detonation Chamber Submission Manager"
        },
        {
            name: "352470b3-6a9c-4686-b503-35deb827e500",
            roleName: "Security Detonation Chamber Publisher"
        },
        {
            name: "7a6f0e70-c033-4fb1-828c-08514e5f4102",
            roleName: "Collaborative Runtime Operator"
        },
        {
            name: "5432c526-bc82-444a-b7ba-57c5b0b5b34f",
            roleName: "CosmosRestoreOperator"
        },
        {
            name: "a1705bd2-3a8f-45a5-8683-466fcfd5cc24",
            roleName: "FHIR Data Converter"
        },
        {
            name: "0e5f05e5-9ab9-446b-b98d-1e2157c94125",
            roleName: "Quota Request Operator"
        },
        {
            name: "1e241071-0855-49ea-94dc-649edcd759de",
            roleName: "EventGrid Contributor"
        },
        {
            name: "28241645-39f8-410b-ad48-87863e2951d5",
            roleName: "Security Detonation Chamber Reader"
        },
        {
            name: "4a167cdf-cb95-4554-9203-2347fe489bd9",
            roleName: "Object Anchors Account Reader"
        },
        {
            name: "ca0835dd-bacc-42dd-8ed2-ed5e7230d15b",
            roleName: "Object Anchors Account Owner"
        },
        {
            name: "d17ce0a2-0697-43bc-aac5-9113337ab61c",
            roleName: "WorkloadBuilder Migration Agent Role"
        },
        {
            name: "b5537268-8956-4941-a8f0-646150406f0c",
            roleName: "Azure Spring Cloud Data Reader"
        },
        {
            name: "0e75ca1e-0464-4b4d-8b93-68208a576181",
            roleName: "Cognitive Services Speech Contributor"
        },
        {
            name: "9894cab4-e18a-44aa-828b-cb588cd6f2d7",
            roleName: "Cognitive Services Face Recognizer"
        },
        {
            name: "1ec5b3c1-b17e-4e25-8312-2acb3c3c5abf",
            roleName: "Stream Analytics Query Tester"
        },
        {
            name: "a2138dac-4907-4679-a376-736901ed8ad8",
            roleName: "AnyBuild Builder"
        },
        {
            name: "b447c946-2db7-41ec-983d-d8bf3b1c77e3",
            roleName: "IoT Hub Data Reader"
        },
        {
            name: "494bdba2-168f-4f31-a0a1-191d2f7c028c",
            roleName: "IoT Hub Twin Contributor"
        },
        {
            name: "4ea46cd5-c1b2-4a8e-910b-273211f9ce47",
            roleName: "IoT Hub Registry Contributor"
        },
        {
            name: "4fc6c259-987e-4a07-842e-c321cc9d413f",
            roleName: "IoT Hub Data Contributor"
        },
        {
            name: "15e0f5a1-3450-4248-8e25-e2afe88a9e85",
            roleName: "Test Base Reader"
        },
        {
            name: "1407120a-92aa-4202-b7e9-c0e197c71c8f",
            roleName: "Search Index Data Reader"
        },
        {
            name: "8ebe5a00-799e-43f5-93ac-243d3dce84a7",
            roleName: "Search Index Data Contributor"
        },
        {
            name: "76199698-9eea-4c19-bc75-cec21354c6b6",
            roleName: "Storage Table Data Reader"
        },
        {
            name: "0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3",
            roleName: "Storage Table Data Contributor"
        },
        {
            name: "e89c7a3c-2f64-4fa1-a847-3e4c9ba4283a",
            roleName: "DICOM Data Reader"
        },
        {
            name: "58a3b984-7adf-4c20-983a-32417c86fbc8",
            roleName: "DICOM Data Owner"
        },
        {
            name: "d5a91429-5739-47e2-a06b-3470a27159e7",
            roleName: "EventGrid Data Sender"
        },
        {
            name: "60fc6e62-5479-42d4-8bf4-67625fcc2840",
            roleName: "Disk Pool Operator"
        },
        {
            name: "f6c7c914-8db3-469d-8ca1-694a8f32e121",
            roleName: "AzureML Data Scientist"
        },
        {
            name: "22926164-76b3-42b3-bc55-97df8dab3e41",
            roleName: "Grafana Admin"
        },
        {
            name: "e8113dce-c529-4d33-91fa-e9b972617508",
            roleName: "Azure Connected SQL Server Onboarding"
        },
        {
            name: "26baccc8-eea7-41f1-98f4-1762cc7f685d",
            roleName: "Azure Relay Sender"
        },
        {
            name: "2787bf04-f1f5-4bfe-8383-c8a24483ee38",
            roleName: "Azure Relay Owner"
        },
        {
            name: "26e0b698-aa6d-4085-9386-aadae190014d",
            roleName: "Azure Relay Listener"
        },
        {
            name: "60921a7e-fef1-4a43-9b16-a26c52ad4769",
            roleName: "Grafana Viewer"
        },
        {
            name: "a79a5197-3a5c-4973-a920-486035ffd60f",
            roleName: "Grafana Editor"
        },
        {
            name: "f353d9bd-d4a6-484e-a77a-8050b599b867",
            roleName: "Automation Contributor"
        },
        {
            name: "85cb6faf-e071-4c9b-8136-154b5a04f717",
            roleName: "Kubernetes Extension Contributor"
        },
        {
            name: "10745317-c249-44a1-a5ce-3a4353c0bbd8",
            roleName: "Device Provisioning Service Data Reader"
        },
        {
            name: "dfce44e4-17b7-4bd1-a6d1-04996ec95633",
            roleName: "Device Provisioning Service Data Contributor"
        },
        {
            name: "2837e146-70d7-4cfd-ad55-7efa6464f958",
            roleName: "Trusted Signing Certificate Profile Signer"
        },
        {
            name: "cff1b556-2399-4e7e-856d-a8f754be7b65",
            roleName: "Azure Spring Cloud Service Registry Reader"
        },
        {
            name: "f5880b48-c26d-48be-b172-7927bfa1c8f1",
            roleName: "Azure Spring Cloud Service Registry Contributor"
        },
        {
            name: "d04c6db6-4947-4782-9e91-30a88feb7be7",
            roleName: "Azure Spring Cloud Config Server Reader"
        },
        {
            name: "a06f5c24-21a7-4e1a-aa2b-f19eb6684f5b",
            roleName: "Azure Spring Cloud Config Server Contributor"
        },
        {
            name: "6ae96244-5829-4925-a7d3-5975537d91dd",
            roleName: "Azure VM Managed identities restore Contributor"
        },
        {
            name: "6be48352-4f82-47c9-ad5e-0acacefdb005",
            roleName: "Azure Maps Search and Render Data Reader"
        },
        {
            name: "dba33070-676a-4fb0-87fa-064dc56ff7fb",
            roleName: "Azure Maps Contributor"
        },
        {
            name: "b748a06d-6150-4f8a-aaa9-ce3940cd96cb",
            roleName: "Azure Arc VMware VM Contributor"
        },
        {
            name: "ce551c02-7c42-47e0-9deb-e3b6fc3a9a83",
            roleName: "Azure Arc VMware Private Cloud User"
        },
        {
            name: "ddc140ed-e463-4246-9145-7c664192013f",
            roleName: "Azure Arc VMware Administrator role "
        },
        {
            name: "f72c8140-2111-481c-87ff-72b910f6e3f8",
            roleName: "Cognitive Services LUIS Owner"
        },
        {
            name: "7628b7b8-a8b2-4cdc-b46f-e9b35248918e",
            roleName: "Cognitive Services Language Reader"
        },
        {
            name: "f2310ca1-dc64-4889-bb49-c8e0fa3d47a8",
            roleName: "Cognitive Services Language Writer"
        },
        {
            name: "f07febfe-79bc-46b1-8b37-790e26e6e498",
            roleName: "Cognitive Services Language Owner"
        },
        {
            name: "18e81cdc-4e98-4e29-a639-e7d10c5a6226",
            roleName: "Cognitive Services LUIS Reader"
        },
        {
            name: "6322a993-d5c9-4bed-b113-e49bbea25b27",
            roleName: "Cognitive Services LUIS Writer"
        },
        {
            name: "a9a19cc5-31f4-447c-901f-56c0bb18fcaf",
            roleName: "PlayFab Reader"
        },
        {
            name: "749a398d-560b-491b-bb21-08924219302e",
            roleName: "Load Test Contributor"
        },
        {
            name: "45bb0b16-2f0c-4e78-afaa-a07599b003f6",
            roleName: "Load Test Owner"
        },
        {
            name: "0c8b84dc-067c-4039-9615-fa1a4b77c726",
            roleName: "PlayFab Contributor"
        },
        {
            name: "3ae3fb29-0000-4ccd-bf80-542e7b26e081",
            roleName: "Load Test Reader"
        },
        {
            name: "b2de6794-95db-4659-8781-7e080d3f2b9d",
            roleName: "Cognitive Services Immersive Reader User"
        },
        {
            name: "f69b8690-cc87-41d6-b77a-a4bc3c0a966f",
            roleName: "Lab Services Contributor"
        },
        {
            name: "2a5c394f-5eb7-4d4f-9c8e-e8eae39faebc",
            roleName: "Lab Services Reader"
        },
        {
            name: "ce40b423-cede-4313-a93f-9b28290b72e1",
            roleName: "Lab Assistant"
        },
        {
            name: "a36e6959-b6be-4b12-8e9f-ef4b474d304d",
            roleName: "Lab Operator"
        },
        {
            name: "5daaa2af-1fe8-407c-9122-bba179798270",
            roleName: "Lab Contributor"
        },
        {
            name: "fb1c8493-542b-48eb-b624-b4c8fea62acd",
            roleName: "Security Admin"
        },
        {
            name: "12cf5a90-567b-43ae-8102-96cf46c7d9b4",
            roleName: "Web PubSub Service Owner"
        },
        {
            name: "bfb1c7d2-fb1a-466b-b2ba-aee63b92deaf",
            roleName: "Web PubSub Service Reader"
        },
        {
            name: "420fcaa2-552c-430f-98ca-3264be4806c7",
            roleName: "SignalR App Server"
        },
        {
            name: "fb879df8-f326-4884-b1cf-06f3ad86be52",
            roleName: "Virtual Machine User Login"
        },
        {
            name: "1c0163c0-47e6-4577-8991-ea5c82e286e4",
            roleName: "Virtual Machine Administrator Login"
        },
        {
            name: "cd570a14-e51a-42ad-bac8-bafd67325302",
            roleName: "Azure Connected Machine Resource Administrator"
        },
        {
            name: "00c29273-979b-4161-815c-10b084fb9324",
            roleName: "Backup Operator"
        },
        {
            name: "e8ddcd69-c73f-4f9f-9844-4100522f16ad",
            roleName: "Workbook Contributor"
        },
        {
            name: "b279062a-9be3-42a0-92ae-8b3cf002ec4d",
            roleName: "Workbook Reader"
        },
        {
            name: "749f88d5-cbae-40b8-bcfc-e573ddc772fa",
            roleName: "Monitoring Contributor"
        },
        {
            name: "3913510d-42f4-4e42-8a64-420c390055eb",
            roleName: "Monitoring Metrics Publisher"
        },
        {
            name: "8a3c2885-9b38-4fd2-9d99-91af537c1347",
            roleName: "Purview role 1 (Deprecated)"
        },
        {
            name: "200bba9e-f0c8-430f-892b-6f0794863803",
            roleName: "Purview role 2 (Deprecated)"
        },
        {
            name: "ff100721-1b9d-43d8-af52-42b69c1272db",
            roleName: "Purview role 3 (Deprecated)"
        },
        {
            name: "b8b15564-4fa6-4a59-ab12-03e1d9594795",
            roleName: "Autonomous Development Platform Data Contributor (Preview)"
        },
        {
            name: "27f8b550-c507-4db9-86f2-f4b8e816d59d",
            roleName: "Autonomous Development Platform Data Owner (Preview)"
        },
        {
            name: "d63b75f7-47ea-4f27-92ac-e0d173aaf093",
            roleName: "Autonomous Development Platform Data Reader (Preview)"
        },
        {
            name: "14b46e9e-c2b7-41b4-b07b-48a6ebf60603",
            roleName: "Key Vault Crypto Officer"
        },
        {
            name: "49e2f5d2-7741-4835-8efa-19e1fe35e47f",
            roleName: "Device Update Deployments Reader"
        },
        {
            name: "e4237640-0e3d-4a46-8fda-70bc94856432",
            roleName: "Device Update Deployments Administrator"
        },
        {
            name: "67d33e57-3129-45e6-bb0b-7cc522f762fa",
            roleName: "Azure Arc VMware Private Clouds Onboarding"
        },
        {
            name: "f4c81013-99ee-4d62-a7ee-b3f1f648599a",
            roleName: "Microsoft Sentinel Automation Contributor"
        },
        {
            name: "871e35f6-b5c1-49cc-a043-bde969a0f2cd",
            roleName: "CDN Endpoint Reader"
        },
        {
            name: "f2dc8367-1007-4938-bd23-fe263f013447",
            roleName: "Cognitive Services Speech User"
        },
        {
            name: "a6333a3e-0164-44c3-b281-7a577aff287f",
            roleName: "Windows Admin Center Administrator Login"
        },
        {
            name: "18ed5180-3e48-46fd-8541-4ea054d57064",
            roleName: "Azure Kubernetes Service Policy Add-on Deployment"
        },
        {
            name: "088ab73d-1256-47ae-bea9-9de8e7131f31",
            roleName: "Guest Configuration Resource Contributor"
        },
        {
            name: "361898ef-9ed1-48c2-849c-a832951106bb",
            roleName: "Domain Services Reader"
        },
        {
            name: "eeaeda52-9324-47f6-8069-5d5bade478b2",
            roleName: "Domain Services Contributor"
        },
        {
            name: "0f2ebee7-ffd4-4fc0-b3b7-664099fdad5d",
            roleName: "DNS Resolver Contributor"
        },
        {
            name: "00493d72-78f6-4148-b6c5-d3ce8e4799dd",
            roleName: "Azure Arc Enabled Kubernetes Cluster User Role"
        },
        {
            name: "959f8984-c045-4866-89c7-12bf9737be2e",
            roleName: "Data Operator for Managed Disks"
        },
        {
            name: "6b77f0a0-0d89-41cc-acd1-579c22c17a67",
            roleName: "AgFood Platform Sensor Partner Contributor"
        },
        {
            name: "1ef6a3be-d0ac-425d-8c01-acb62866290b",
            roleName: "Compute Gallery Sharing Admin"
        },
        {
            name: "cd08ab90-6b14-449c-ad9a-8f8e549482c6",
            roleName: "Scheduled Patching Contributor"
        },
        {
            name: "45d50f46-0b78-4001-a660-4198cbe8cd05",
            roleName: "DevCenter Dev Box User"
        },
        {
            name: "331c37c6-af14-46d9-b9f4-e1909e1b95a0",
            roleName: "DevCenter Project Admin"
        },
        {
            name: "602da2ba-a5c2-41da-b01d-5360126ab525",
            roleName: "Virtual Machine Local User Login"
        },
        {
            name: "e582369a-e17b-42a5-b10c-874c387c530b",
            roleName: "Azure Arc ScVmm VM Contributor"
        },
        {
            name: "a92dfd61-77f9-4aec-a531-19858b406c87",
            roleName: "Azure Arc ScVmm Administrator role"
        },
        {
            name: "6aac74c4-6311-40d2-bbdd-7d01e7c6e3a9",
            roleName: "Azure Arc ScVmm Private Clouds Onboarding"
        },
        {
            name: "c0781e91-8102-4553-8951-97c6d4243cda",
            roleName: "Azure Arc ScVmm Private Cloud User"
        },
        {
            name: "7656b436-37d4-490a-a4ab-d39f838f0042",
            roleName: "HDInsight on AKS Cluster Pool Admin"
        },
        {
            name: "fd036e6b-1266-47a0-b0bb-a05d04831731",
            roleName: "HDInsight on AKS Cluster Admin"
        },
        {
            name: "4465e953-8ced-4406-a58e-0f6e3f3b530b",
            roleName: "FHIR Data Importer"
        },
        {
            name: "bcf28286-af25-4c81-bb6f-351fcab5dbe9",
            roleName: "HDInsight on AKS Cluster Operator"
        },
        {
            name: "c031e6a8-4391-4de0-8d69-4706a7ed3729",
            roleName: "API Management Developer Portal Content Editor"
        },
        {
            name: "d24ecba3-c1f4-40fa-a7bb-4588a071e8fd",
            roleName: "VM Scanner Operator"
        },
        {
            name: "80dcbedb-47ef-405d-95bd-188a1b4ac406",
            roleName: "Elastic SAN Owner"
        },
        {
            name: "af6a70f8-3c9f-4105-acf1-d719e9fca4ca",
            roleName: "Elastic SAN Reader"
        },
        {
            name: "a959dbd1-f747-45e3-8ba6-dd80f235f97c",
            roleName: "Desktop Virtualization Virtual Machine Contributor"
        },
        {
            name: "40c5ff49-9181-41f8-ae61-143b0e78555e",
            roleName: "Desktop Virtualization Power On Off Contributor"
        },
        {
            name: "489581de-a3bd-480d-9518-53dea7416b33",
            roleName: "Desktop Virtualization Power On Contributor"
        },
        {
            name: "a8281131-f312-4f34-8d98-ae12be9f0d23",
            roleName: "Elastic SAN Volume Group Owner"
        },
        {
            name: "76cc9ee4-d5d3-4a45-a930-26add3d73475",
            roleName: "Access Review Operator Service Role"
        },
        {
            name: "4339b7cf-9826-4e41-b4ed-c7f4505dac08",
            roleName: "Trusted Signing Identity Verifier"
        },
        {
            name: "a2c4a527-7dc0-4ee3-897b-403ade70fafb",
            roleName: "Video Indexer Restricted Viewer"
        },
        {
            name: "b0d8363b-8ddd-447d-831f-62ca05bff136",
            roleName: "Monitoring Data Reader"
        },
        {
            name: "5af6afb3-c06c-4fa4-8848-71a8aee05683",
            roleName: "Azure Kubernetes Fleet Manager RBAC Writer"
        },
        {
            name: "434fb43a-c01c-447e-9f67-c3ad923cfaba",
            roleName: "Azure Kubernetes Fleet Manager RBAC Admin"
        },
        {
            name: "63bb64ad-9799-4770-b5c3-24ed299a07bf",
            roleName: "Azure Kubernetes Fleet Manager Contributor Role"
        },
        {
            name: "30b27cfc-9c84-438e-b0ce-70e35255df80",
            roleName: "Azure Kubernetes Fleet Manager RBAC Reader"
        },
        {
            name: "18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
            roleName: "Azure Kubernetes Fleet Manager RBAC Cluster Admin"
        },
        {
            name: "ba79058c-0414-4a34-9e42-c3399d80cd5a",
            roleName: "Kubernetes Namespace User"
        },
        {
            name: "c6decf44-fd0a-444c-a844-d653c394e7ab",
            roleName: "Data Labeling - Labeler"
        },
        {
            name: "f58310d9-a9f6-439a-9e8d-f62e7b41a168",
            roleName: "Role Based Access Control Administrator"
        },
        {
            name: "1c9b6475-caf0-4164-b5a1-2142a7116f4b",
            roleName: "Template Spec Contributor"
        },
        {
            name: "392ae280-861d-42bd-9ea5-08ee6d83b80e",
            roleName: "Template Spec Reader"
        },
        {
            name: "51d6186e-6489-4900-b93f-92e23144cca5",
            roleName: "Microsoft Sentinel Playbook Operator"
        },
        {
            name: "18e40d4e-8d2e-438d-97e1-9528336e149c",
            roleName: "Deployment Environments User"
        },
        {
            name: "80558df3-64f9-4c0f-b32d-e5094b036b0b",
            roleName: "Azure Spring Apps Connect Role"
        },
        {
            name: "a99b0159-1064-4c22-a57b-c9b3caa1c054",
            roleName: "Azure Spring Apps Remote Debugging Role"
        },
        {
            name: "1823dd4f-9b8c-4ab6-ab4e-7397a3684615",
            roleName: "AzureML Registry User"
        },
        {
            name: "e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
            roleName: "AzureML Compute Operator"
        },
        {
            name: "aabbc5dd-1af0-458b-a942-81af88f9c138",
            roleName: "Azure Center for SAP solutions service role"
        },
        {
            name: "05352d14-a920-4328-a0de-4cbe7430e26b",
            roleName: "Azure Center for SAP solutions reader"
        },
        {
            name: "7b0c7e81-271f-4c71-90bf-e30bdfdbc2f7",
            roleName: "Azure Center for SAP solutions administrator"
        },
        {
            name: "fbc52c3f-28ad-4303-a892-8a056630b8f1",
            roleName: "AppGw for Containers Configuration Manager"
        },
        {
            name: "4ba50f17-9666-485c-a643-ff00808643f0",
            roleName: "FHIR SMART User"
        },
        {
            name: "a001fd3d-188f-4b5d-821b-7da978bf7442",
            roleName: "Cognitive Services OpenAI Contributor"
        },
        {
            name: "5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
            roleName: "Cognitive Services OpenAI User"
        },
        {
            name: "36e80216-a7e8-4f42-a7e1-f12c98cbaf8a",
            roleName: "Impact Reporter"
        },
        {
            name: "68ff5d27-c7f5-4fa9-a21c-785d0df7bd9e",
            roleName: "Impact Reader"
        },
        {
            name: "1afdec4b-e479-420e-99e7-f82237c7c5e6",
            roleName: "Azure Kubernetes Service Cluster Monitoring User"
        },
        {
            name: "ad2dd5fb-cd4b-4fd4-a9b6-4fed3630980b",
            roleName: "ContainerApp Reader"
        },
        {
            name: "f5819b54-e033-4d82-ac66-4fec3cbf3f4c",
            roleName: "Azure Connected Machine Resource Manager"
        },
        {
            name: "189207d4-bb67-4208-a635-b06afe8b2c57",
            roleName: "SqlDb Migration Role"
        },
        {
            name: "c4bc862a-3b64-4a35-a021-a380c159b042",
            roleName: "Bayer Ag Powered Services GDU Solution"
        },
        {
            name: "ef29765d-0d37-4119-a4f8-f9f9902c9588",
            roleName: "Bayer Ag Powered Services Imagery Solution"
        },
        {
            name: "0105a6b0-4bb9-43d2-982a-12806f9faddb",
            roleName: "Azure Center for SAP solutions Service role for management"
        },
        {
            name: "6d949e1d-41e2-46e3-8920-c6e4f31a8310",
            roleName: "Azure Center for SAP solutions Management role"
        },
        {
            name: "d5a2ae44-610b-4500-93be-660a0c5f5ca6",
            roleName: "Kubernetes Agentless Operator"
        },
        {
            name: "f0310ce6-e953-4cf8-b892-fb1c87eaf7f6",
            roleName: "Azure Usage Billing Data Sender"
        },
        {
            name: "96062cf7-95ca-4f89-9b9d-2a2aa47356af",
            roleName: "Azure Container Registry secure supply chain operator service role"
        },
        {
            name: "1d335eef-eee1-47fe-a9e0-53214eba8872",
            roleName: "SqlMI Migration Role"
        },
        {
            name: "a9b99099-ead7-47db-8fcf-072597a61dfa",
            roleName: "Bayer Ag Powered Services CWUM Solution"
        },
        {
            name: "ae8036db-e102-405b-a1b9-bae082ea436d",
            roleName: "SqlVM Migration Role"
        },
        {
            name: "0ab34830-df19-4f8c-b84e-aa85b8afa6e8",
            roleName: "Azure Front Door Domain Contributor"
        },
        {
            name: "0db238c4-885e-4c4f-a933-aa2cef684fca",
            roleName: "Azure Front Door Secret Reader"
        },
        {
            name: "3f2eb865-5811-4578-b90a-6fc6fa0df8e5",
            roleName: "Azure Front Door Secret Contributor"
        },
        {
            name: "0f99d363-226e-4dca-9920-b807cf8e1a5f",
            roleName: "Azure Front Door Domain Reader"
        },
        {
            name: "bda0d508-adf1-4af0-9c28-88919fc3ae06",
            roleName: "Azure Stack HCI Administrator"
        },
        {
            name: "d18ad5f3-1baf-4119-b49b-d944edb1f9d0",
            roleName: "MySQL Backup And Export Operator"
        },
        {
            name: "a8835c7d-b5cb-47fa-b6f0-65ea10ce07a2",
            roleName: "LocalNGFirewallAdministrator role"
        },
        {
            name: "bfc3b73d-c6ff-45eb-9a5f-40298295bf20",
            roleName: "LocalRulestacksAdministrator role"
        },
        {
            name: "7392c568-9289-4bde-aaaa-b7131215889d",
            roleName: "Azure Extension for SQL Server Deployment"
        },
        {
            name: "d6470a16-71bd-43ab-86b3-6f3a73f4e787",
            roleName: "Azure Maps Data Read and Batch Role"
        },
        {
            name: "d59a3e9c-6d52-4a5a-aeed-6bf3cf0e31da",
            roleName: "API Management Service Workspace API Product Manager"
        },
        {
            name: "56328988-075d-4c6a-8766-d93edd6725b6",
            roleName: "API Management Workspace API Developer"
        },
        {
            name: "ef1c2c96-4a77-49e8-b9a4-6179fe1d2fd2",
            roleName: "API Management Workspace Reader"
        },
        {
            name: "73c2c328-d004-4c5e-938c-35c6f5679a1f",
            roleName: "API Management Workspace API Product Manager"
        },
        {
            name: "9565a273-41b9-4368-97d2-aeb0c976a9b3",
            roleName: "API Management Service Workspace API Developer"
        },
        {
            name: "0c34c906-8d99-4cb7-8bb7-33f5b0a1a799",
            roleName: "API Management Workspace Contributor"
        },
        {
            name: "b8eda974-7b85-4f76-af95-65846b26df6d",
            roleName: "Storage File Data Privileged Reader"
        },
        {
            name: "69566ab7-960f-475b-8e7c-b3118f30c6bd",
            roleName: "Storage File Data Privileged Contributor"
        },
        {
            name: "7eabc9a4-85f7-4f71-b8ab-75daaccc1033",
            roleName: "Windows 365 Network User"
        },
        {
            name: "3d55a8f6-4133-418d-8051-facdb1735758",
            roleName: "Windows365SubscriptionReader"
        },
        {
            name: "1f135831-5bbe-4924-9016-264044c00788",
            roleName: "Windows 365 Network Interface Contributor"
        },
        {
            name: "ffc6bbe0-e443-4c3b-bf54-26581bb2f78e",
            roleName: "App Compliance Automation Reader"
        },
        {
            name: "0f37683f-2463-46b6-9ce7-9b788b988ba2",
            roleName: "App Compliance Automation Administrator"
        },
        {
            name: "8b9dfcab-4b77-4632-a6df-94bd07820648",
            roleName: "Azure Sphere Contributor"
        },
        {
            name: "e9b8712a-cbcf-4ea7-b0f7-e71b803401e6",
            roleName: "SaaS Hub Contributor"
        },
        {
            name: "c8ae6279-5a0b-4cb2-b3f0-d4d62845742c",
            roleName: "Azure Sphere Reader"
        },
        {
            name: "6d994134-994b-4a59-9974-f479f0b227fb",
            roleName: "Azure Sphere Publisher"
        },
        {
            name: "ea01e6af-a1c1-4350-9563-ad00f8c72ec5",
            roleName: "Azure Machine Learning Workspace Connection Secrets Reader"
        },
        {
            name: "be1a1ac2-09d3-4261-9e57-a73a6e227f53",
            roleName: "Procurement Contributor"
        },
        {
            name: "7ac06ca7-21ca-47e3-a67b-cbd6e6223baf",
            roleName: "Cognitive Search Serverless Data Contributor (Deprecated)"
        },
        {
            name: "79b01272-bf9f-4f4c-9517-5506269cf524",
            roleName: "Cognitive Search Serverless Data Reader (Deprecated)"
        },
        {
            name: "5e28a61e-8040-49db-b175-bb5b88af6239",
            roleName: "Community Owner Role"
        },
        {
            name: "9c1607d1-791d-4c68-885d-c7b7aaff7c8a",
            roleName: "Firmware Analysis Admin"
        },
        {
            name: "8b54135c-b56d-4d72-a534-26097cfdc8d8",
            roleName: "Key Vault Data Access Administrator"
        },
        {
            name: "1e7ca9b1-60d1-4db8-a914-f2ca1ff27c40",
            roleName: "Defender for Storage Data Scanner"
        },
        {
            name: "df2711a6-406d-41cf-b366-b0250bff9ad1",
            roleName: "Compute Diagnostics Role"
        },
        {
            name: "fa6cecf6-5db3-4c43-8470-c540bcb4eafa",
            roleName: "Elastic SAN Network Admin"
        },
        {
            name: "bba48692-92b0-4667-a9ad-c31c7b334ac2",
            roleName: "Cognitive Services Usages Reader"
        },
        {
            name: "c088a766-074b-43ba-90d4-1fb21feae531",
            roleName: "PostgreSQL Flexible Server Long Term Retention Backup Role"
        },
        {
            name: "a02f7c31-354d-4106-865a-deedf37fa038",
            roleName: "Search Parameter Manager"
        },
        {
            name: "66f75aeb-eabe-4b70-9f1e-c350c4c9ad04",
            roleName: "Virtual Machine Data Access Administrator (preview)"
        },
        {
            name: "523776ba-4eb2-4600-a3c8-f2dc93da4bdb",
            roleName: "Logic Apps Standard Developer (Preview)"
        },
        {
            name: "ad710c24-b039-4e85-a019-deb4a06e8570",
            roleName: "Logic Apps Standard Contributor (Preview)"
        },
        {
            name: "b70c96e9-66fe-4c09-b6e7-c98e69c98555",
            roleName: "Logic Apps Standard Operator (Preview)"
        },
        {
            name: "4accf36b-2c05-432f-91c8-5c532dff4c73",
            roleName: "Logic Apps Standard Reader (Preview)"
        },
        {
            name: "7b3e853f-ad5d-4fb5-a7b8-56a3581c7037",
            roleName: "IPAM Pool User"
        },
        {
            name: "e9c9ed2b-2a99-4071-b2ff-5b113ebf73a1",
            roleName: "SpatialMapsAccounts Account Owner"
        },
        {
            name: "0b962ed2-6d56-471c-bd5f-3477d83a7ba4",
            roleName: "Azure Resource Notifications System Topics Subscriber"
        },
        {
            name: "90e8b822-3e73-47b5-868a-787dc80c008f",
            roleName: "Elastic SAN Volume Importer"
        },
        {
            name: "1c4770c0-34f7-4110-a1ea-a5855cc7a939",
            roleName: "Elastic SAN Snapshot Exporter"
        },
        {
            name: "49435da6-99fe-48a5-a235-fc668b9dc04a",
            roleName: "Community Contributor Role"
        },
        {
            name: "4b0f2fd7-60b4-4eca-896f-4435034f8bf5",
            roleName: "EventGrid TopicSpaces Subscriber"
        },
        {
            name: "a12b0b94-b317-4dcd-84a8-502ce99884c6",
            roleName: "EventGrid TopicSpaces Publisher"
        },
        {
            name: "d1a38570-4b05-4d70-b8e4-1100bcf76d12",
            roleName: "Data Boundary Tenant Administrator"
        },
        {
            name: "bb6577c4-ea0a-40b2-8962-ea18cb8ecd4e",
            roleName: "DeID Realtime Data User"
        },
        {
            name: "b73a14ee-91f5-41b7-bd81-920e12466be9",
            roleName: "DeID Batch Data Reader"
        },
        {
            name: "8a90fa6b-6997-4a07-8a95-30633a7c97b9",
            roleName: "DeID Batch Data Owner"
        },
        {
            name: "fa0d39e6-28e5-40cf-8521-1eb320653a4c",
            roleName: "Carbon Optimization Reader"
        },
        {
            name: "38863829-c2a4-4f8d-b1d2-2e325973ebc7",
            roleName: "Landing Zone Management Owner"
        },
        {
            name: "8fe6e843-6d9e-417b-9073-106b048f50bb",
            roleName: "Landing Zone Management Reader"
        },
        {
            name: "865ae368-6a45-4bd1-8fbf-0d5151f56fc1",
            roleName: "Azure Stack HCI Device Management Role"
        },
        {
            name: "4dae6930-7baf-46f5-909e-0383bc931c46",
            roleName: "Azure Customer Lockbox Approver for Subscription"
        },
        {
            name: "7b1f81f9-4196-4058-8aae-762e593270df",
            roleName: "Azure Resource Bridge Deployment Role"
        },
        {
            name: "4b3fe76c-f777-4d24-a2d7-b027b0f7b273",
            roleName: "Azure Stack HCI VM Reader"
        },
        {
            name: "64702f94-c441-49e6-a78b-ef80e0188fee",
            roleName: "Azure AI Developer"
        },
        {
            name: "874d1c73-6003-4e60-a13a-cb31ea190a85",
            roleName: "Azure Stack HCI VM Contributor"
        },
        {
            name: "eb960402-bf75-4cc3-8d68-35b34f960f72",
            roleName: "Deployment Environments Reader"
        },
        {
            name: "78cbd9e7-9798-4e2e-9b5a-547d9ebb31fb",
            roleName: "EventGrid Data Receiver"
        },
        {
            name: "1d8c3fe3-8864-474b-8749-01e3783e8157",
            roleName: "EventGrid Data Contributor"
        },
        {
            name: "8aac15f0-d885-4138-8afa-bfb5872f7d13",
            roleName: "Advisor Reviews Contributor"
        },
        {
            name: "c64499e0-74c3-47ad-921c-13865957895c",
            roleName: "Advisor Reviews Reader"
        },
        {
            name: "3afb7f49-54cb-416e-8c09-6dc049efa503",
            roleName: "Azure AI Inference Deployment Operator"
        },
        {
            name: "65a14201-8f6c-4c28-bec4-12619c5a9aaa",
            roleName: "Connected Cluster Managed Identity CheckAccess Reader"
        },
        {
            name: "a8d4b70f-0fb9-4f72-b267-b87b2f990aec",
            roleName: "AgFood Platform Dataset Admin"
        },
        {
            name: "0f641de8-0b88-4198-bdef-bd8b45ceba96",
            roleName: "Defender for Storage Scanner Operator"
        },
        {
            name: "662802e2-50f6-46b0-aed2-e834bacc6d12",
            roleName: "Azure Front Door Profile Reader"
        },
        {
            name: "86fede04-b259-4277-8c3e-e26b9865abd8",
            roleName: "Enclave Reader Role"
        },
        {
            name: "fc3f91a1-40bf-4439-8c46-45edbd83563a",
            roleName: "Azure Kubernetes Service Hybrid Cluster User Role"
        },
        {
            name: "b5092dac-c796-4349-8681-1a322a31c3f9",
            roleName: "Azure Kubernetes Service Hybrid Cluster Admin Role"
        },
        {
            name: "e7037d40-443a-4434-a3fb-8cd202011e1d",
            roleName: "Azure Kubernetes Service Hybrid Contributor Role"
        },
        {
            name: "3d5f3eff-eb94-473d-91e3-7aac74d6c0bb",
            roleName: "Enclave Owner Role"
        },
        {
            name: "19feefae-eacc-4106-81fd-ac34c0671f14",
            roleName: "Enclave Contributor Role"
        },
        {
            name: "e6aadb6b-e64f-41c0-9392-d2bba3bc3ebc",
            roleName: "Community Reader Role"
        },
        {
            name: "a316ed6d-1efe-48ac-ac08-f7995a9c26fb",
            roleName: "Storage Account Encryption Scope Contributor Role"
        },
        {
            name: "44f0a1a8-6fea-4b35-980a-8ff50c487c97",
            roleName: "Operator Nexus Key Vault Writer Service Role (Preview)"
        },
        {
            name: "08bbd89e-9f13-488c-ac41-acfcb10c90ab",
            roleName: "Key Vault Crypto Service Release User"
        },
        {
            name: "0cd9749a-3aaf-4ae5-8803-bd217705bf3b",
            roleName: "Kubernetes Runtime Storage Class Contributor Role"
        },
        {
            name: "609c0c20-e0a0-4a71-b99f-e7e755ac493d",
            roleName: "Azure Programmable Connectivity Gateway User"
        },
        {
            name: "db79e9a7-68ee-4b58-9aeb-b90e7c24fcba",
            roleName: "Key Vault Certificate User"
        },
        {
            name: "52fd16bd-6ed5-46af-9c40-29cbd7952a29",
            roleName: "Azure Spring Apps Managed Components Log Reader Role"
        },
        {
            name: "6593e776-2a30-40f9-8a32-4fe28b77655d",
            roleName: "Azure Spring Apps Application Configuration Service Log Reader Role"
        },
        {
            name: "4301dc2a-25a9-44b0-ae63-3636cf7f2bd2",
            roleName: "Azure Spring Apps Spring Cloud Gateway Log Reader Role"
        },
        {
            name: "207bcc4b-86a6-4487-9141-d6c1f4c238aa",
            roleName: "Azure Edge On-Site Deployment Engineer"
        },
        {
            name: "c7244dfb-f447-457d-b2ba-3999044d1706",
            roleName: "Azure API Center Data Reader"
        },
        {
            name: "dfb2f09d-25f8-4558-8986-497084006d7a",
            roleName: "Azure impact-insight reader"
        },
        {
            name: "8bb6f106-b146-4ee6-a3f9-b9c5a96e0ae5",
            roleName: "Defender Kubernetes Agent Operator"
        },
        {
            name: "a1f96423-95ce-4224-ab27-4e3dc72facd4",
            roleName: "Azure Red Hat OpenShift Cloud Controller Manager"
        },
        {
            name: "5b7237c5-45e1-49d6-bc18-a1f62f400748",
            roleName: "Azure Red Hat OpenShift Disk Storage Operator"
        },
        {
            name: "be7a6435-15ae-4171-8f30-4a343eff9e8f",
            roleName: "Azure Red Hat OpenShift Network Operator"
        },
        {
            name: "8b32b316-c2f5-4ddf-b05b-83dacd2d08b5",
            roleName: "Azure Red Hat OpenShift Image Registry Operator"
        },
        {
            name: "0d7aedc0-15fd-4a67-a412-efad370c947e",
            roleName: "Azure Red Hat OpenShift File Storage Operator"
        },
        {
            name: "4436bae4-7702-4c84-919b-c4069ff25ee2",
            roleName: "Azure Red Hat OpenShift Service Operator"
        },
        {
            name: "0358943c-7e01-48ba-8889-02cc51d78637",
            roleName: "Azure Red Hat OpenShift Machine API Operator"
        },
        {
            name: "0336e1d3-7a87-462b-b6db-342b63f7802c",
            roleName: "Azure Red Hat OpenShift Cluster Ingress Operator"
        },
        {
            name: "5a382001-fe36-41ff-bba4-8bf06bd54da9",
            roleName: "Azure Sphere Owner"
        },
        {
            name: "e2217c0e-04bb-4724-9580-91cf9871bc01",
            roleName: "GroupQuota Request Operator"
        },
        {
            name: "d0f495dc-44ef-4140-aeb0-b89110e6a7c1",
            roleName: "GroupQuota Reader"
        },
        {
            name: "539283cd-c185-4a9a-9503-d35217a1db7b",
            roleName: "Bayer Ag Powered Services Smart Boundary Solution User Role"
        },
        {
            name: "8480c0f0-4509-4229-9339-7c10018cb8c4",
            roleName: "Defender CSPM Storage Scanner Operator"
        },
        {
            name: "6b534d80-e337-47c4-864f-140f5c7f593d",
            roleName: "Advisor Recommendations Contributor (Assessments and Reviews)"
        },
        {
            name: "c9c97b9c-105d-4bb5-a2a7-7d15666c2484",
            roleName: "GeoCatalog Administrator"
        },
        {
            name: "b7b8f583-43d0-40ae-b147-6b46f53661c1",
            roleName: "GeoCatalog Reader"
        },
        {
            name: "af854a69-80ce-4ff7-8447-f1118a2e0ca8",
            roleName: "Healthcare Agent Editor"
        },
        {
            name: "eb5a76d5-50e7-4c33-a449-070e7c9c4cf2",
            roleName: "Healthcare Agent Reader"
        },
        {
            name: "c20923c5-b089-47a5-bf67-fd89569c4ad9",
            roleName: "Azure Programmable Connectivity Gateway Dataplane User"
        },
        {
            name: "f1082fec-a70f-419f-9230-885d2550fb38",
            roleName: "Healthcare Agent Admin"
        },
        {
            name: "b556d68e-0be0-4f35-a333-ad7ee1ce17ea",
            roleName: "Azure AI Enterprise Network Connection Approver"
        },
        {
            name: "08d4c71a-cc63-4ce4-a9c8-5dd251b4d619",
            roleName: "Azure Container Storage Operator"
        },
        {
            name: "95dd08a6-00bd-4661-84bf-f6726f83a4d0",
            roleName: "Azure Container Storage Contributor"
        },
        {
            name: "95de85bd-744d-4664-9dde-11430bc34793",
            roleName: "Azure Container Storage Owner"
        },
        {
            name: "5d3f1697-4507-4d08-bb4a-477695db5f82",
            roleName: "Azure Kubernetes Service Arc Contributor Role"
        },
        {
            name: "233ca253-b031-42ff-9fba-87ef12d6b55f",
            roleName: "Azure Kubernetes Service Arc Cluster User Role"
        },
        {
            name: "b29efa5f-7782-4dc3-9537-4d5bc70a5e9f",
            roleName: "Azure Kubernetes Service Arc Cluster Admin Role"
        },
        {
            name: "f54b6d04-23c6-443e-b462-9c16ab7b4a52",
            roleName: "Backup MUA Operator"
        },
        {
            name: "c2a970b4-16a7-4a51-8c84-8a8ea6ee0bb8",
            roleName: "Backup MUA Admin"
        },
        {
            name: "3d24a3a0-c154-4f6f-a5ed-adc8e01ddb74",
            roleName: "Savings plan Purchaser"
        },
        {
            name: "b6ee44de-fe58-4ddc-b5c2-ab174eb23f05",
            roleName: "CrossConnectionReader"
        },
        {
            name: "399c3b2b-64c2-4ff1-af34-571db925b068",
            roleName: "CrossConnectionManager"
        },
        {
            name: "5e93ba01-8f92-4c7a-b12a-801e3df23824",
            roleName: "Kubernetes Agent Operator"
        },
        {
            name: "dd24193f-ef65-44e5-8a7e-6fa6e03f7713",
            roleName: "Azure API Center Service Contributor"
        },
        {
            name: "6cba8790-29c5-48e5-bab1-c7541b01cb04",
            roleName: "Azure API Center Service Reader"
        },
        {
            name: "ede9aaa3-4627-494e-be13-4aa7c256148d",
            roleName: "Azure API Center Compliance Manager"
        },
        {
            name: "b5b192c1-773c-4543-bfb0-6c59254b74a9",
            roleName: "Bayer Ag Powered Services Historical Weather Data Solution User Role"
        },
        {
            name: "e9ce8739-6fa2-4123-a0a2-0ef41a67806f",
            roleName: "Oracle.Database VmCluster Administrator Built-in Role"
        },
        {
            name: "d623d097-b882-4e1e-a26f-ac60e31065a1",
            roleName: "Oracle.Database Reader Built-in Role"
        },
        {
            name: "4562aac9-b209-4bd7-a144-6d7f3bb516f4",
            roleName: "Oracle.Database Owner Built-in Role"
        },
        {
            name: "4caf51ec-f9f5-413f-8a94-b9f5fddba66b",
            roleName: "Oracle Subscriptions Manager Built-in Role"
        },
        {
            name: "4cfdd23b-aece-4fd1-b614-ad3a06c53453",
            roleName: "Oracle.Database Exadata Infrastructure Administrator Built-in Role"
        },
        {
            name: "f27b7598-bc64-41f7-8a44-855ff16326c2",
            roleName: "Azure Messaging Catalog Data Owner"
        },
        {
            name: "25211fc6-dc78-40b6-b205-e4ac934fd9fd",
            roleName: "Azure Spring Apps Application Configuration Service Config File Pattern Reader Role"
        },
        {
            name: "5d9c6a55-fc0e-4e21-ae6f-f7b095497342",
            roleName: "Azure Hybrid Database Administrator - Read Only Service Role"
        },
        {
            name: "c18f9900-27b8-47c7-a8f0-5b3b3d4c2bc2",
            roleName: "Microsoft Sentinel Business Applications Agent Operator"
        },
        {
            name: "0fb8eba5-a2bb-4abe-b1c1-49dfad359bb0",
            roleName: "Azure ContainerApps Session Executor"
        },
        {
            name: "83ee7727-862c-4213-8ed8-2ce6c5d69a40",
            roleName: "Microsoft.Edge Winfields federated subscription read access role"
        },
        {
            name: "ef318e2a-8334-4a05-9e4a-295a196c6a6e",
            roleName: "Azure Red Hat OpenShift Federated Credential"
        },
        {
            name: "39138f76-04e6-41f0-ba6b-c411b59081a9",
            roleName: "Bayer Ag Powered Services Crop Id Solution User Role"
        },
        {
            name: "b67fe603-310e-4889-b9ee-8257d09d353d",
            roleName: "Scheduled Events Contributor"
        },
        {
            name: "e82342c9-ac7f-422b-af64-e426d2e12b2d",
            roleName: "Compute Recommendations Role"
        },
        {
            name: "91422e52-bb88-4415-bb4a-90f5b71f6dcb",
            roleName: "Azure Spring Apps Job Execution Instance List Role"
        },
        {
            name: "b459aa1d-e3c8-436f-ae21-c0531140f43e",
            roleName: "Azure Spring Apps Job Log Reader Role"
        },
        {
            name: "05fdd44c-adc6-4aff-981c-61041f0c929a",
            roleName: "Nexus Network Fabric Service Reader"
        },
        {
            name: "a5eb8433-97a5-4a06-80b2-a877e1622c31",
            roleName: "Nexus Network Fabric Service Writer"
        },
        {
            name: "bf7f8882-3383-422a-806a-6526c631a88a",
            roleName: "Azure Deployment Stack Contributor"
        },
        {
            name: "adb29209-aa1d-457b-a786-c913953d2891",
            roleName: "Azure Deployment Stack Owner"
        },
        {
            name: "74252426-c508-480e-9345-4607bbebead4",
            roleName: "Azure Spring Apps Spring Cloud Config Server Log Reader Role"
        },
        {
            name: "bfdb9389-c9a5-478a-bb2f-ba9ca092c3c7",
            roleName: "Container Registry Repository Catalog Lister"
        },
        {
            name: "2efddaa5-3f1f-4df3-97df-af3f13818f4c",
            roleName: "Container Registry Repository Contributor"
        },
        {
            name: "2a1e307c-b015-4ebd-883e-5b7698a07328",
            roleName: "Container Registry Repository Writer"
        },
        {
            name: "b93aa761-3e63-49ed-ac28-beffa264f7ac",
            roleName: "Container Registry Repository Reader"
        },
        {
            name: "78e4b983-1a0b-472e-8b7d-8d770f7c5890",
            roleName: "DeID Data Owner"
        },
        {
            name: "28bf596f-4eb7-45ce-b5bc-6cf482fec137",
            roleName: "Locks Contributor"
        },
        {
            name: "39fcb0de-8844-4706-b050-c28ddbe3ff83",
            roleName: "Standby Container Group Pool Contributor"
        },
        {
            name: "85a2d0d9-2eba-4c9c-b355-11c2cc0788ab",
            roleName: "Compute Gallery Artifacts Publisher"
        },
        {
            name: "c5826735-177b-4a0d-a9a3-d0e4b4bda107",
            roleName: "ToolchainOrchestrator Viewer Role"
        },
        {
            name: "2ccf8795-8983-4912-8036-1c45212c95e8",
            roleName: "ToolchainOrchestrator Admin Role"
        },
        {
            name: "4d8c6f2e-3fd6-4d40-826e-93e3dc4c3fc1",
            roleName: "ProviderHub Reader"
        },
        {
            name: "a3ab03bc-5350-42ff-b0d5-00207672db55",
            roleName: "ProviderHub Contributor"
        },
        {
            name: "c99c945f-8bd1-4fb1-a903-01460aae6068",
            roleName: "Azure Stack HCI Connected InfraVMs"
        },
        {
            name: "dfce8971-25e3-42e3-ba33-6055438e3080",
            roleName: "VM Restore Operator"
        },
        {
            name: "0847e196-2fd2-4c2f-a48c-fca6fd030f44",
            roleName: "HDInsight Cluster Admin"
        },
        {
            name: "4aa368ec-fba9-4e93-81ed-396b3d461cc5",
            roleName: "Operator Nexus Compute Contributor Role (Preview)"
        },
        {
            name: "5d977122-f97e-4b4d-a52f-6b43003ddb4d",
            roleName: "Azure Container Instances Contributor Role"
        },
        {
            name: "6cdbb904-5ff3-429d-8169-7d7818b91bd8",
            roleName: "Connector Reader"
        },
        {
            name: "8ad4d0ee-9bfb-49e8-93fc-01abb8db6240",
            roleName: "Transparency Logs Owner"
        },
        {
            name: "41e04612-9dac-4699-a02b-c82ff2cc3fb5",
            roleName: "Grafana Limited Viewer"
        },
        {
            name: "136d308c-0937-4a49-9bd7-edfb42adbffc",
            roleName: "Disk Encryption Set Operator for Managed Disks"
        },
        {
            name: "1af232de-e806-426f-8ca1-c36142449755",
            roleName: "Bayer Ag Powered Services Field Imagery Solution Service Role"
        },
        {
            name: "9295f069-25d0-4f44-bb6a-3da70d11aa00",
            roleName: "Azure Edge Hardware Center Administrator"
        },
        {
            name: "b78c5d69-af96-48a3-bf8d-a8b4d589de94",
            roleName: "Azure AI Administrator"
        },
        {
            name: "cf7c76d2-98a3-4358-a134-615aa78bf44d",
            roleName: "Compute Gallery Image Reader"
        },
        {
            name: "f3bd1b5c-91fa-40e7-afe7-0c11d331232c",
            roleName: "Container Apps Operator"
        },
        {
            name: "57cc5028-e6a7-4284-868d-0611c5923f8d",
            roleName: "Container Apps ManagedEnvironments Contributor"
        },
        {
            name: "358470bc-b998-42bd-ab17-a7e34c199c0f",
            roleName: "Container Apps Contributor"
        },
        {
            name: "1b32c00b-7eff-4c22-93e6-93d11d72d2d8",
            roleName: "Container Apps ManagedEnvironments Reader"
        },
        {
            name: "edd66693-d32a-450b-997d-0158c03976b0",
            roleName: "Container Apps Jobs Reader"
        },
        {
            name: "af61e8fc-2633-4b95-bed3-421ad6826515",
            roleName: "Container Apps SessionPools Reader"
        },
        {
            name: "4e3d2b60-56ae-4dc6-a233-09c8e5a82e68",
            roleName: "Container Apps Jobs Contributor"
        },
        {
            name: "f7669afb-68b2-44b4-9c5f-6d2a47fddda0",
            roleName: "Container Apps SessionPools Contributor"
        },
        {
            name: "0ad04412-c4d5-4796-b79c-f76d14c8d402",
            roleName: "Durable Task Data Contributor"
        },
        {
            name: "1a5682fc-4f12-4b25-927e-e8cfed0c539e",
            roleName: "KubernetesRuntime Load Balancer Contributor Role"
        },
        {
            name: "d715fb95-a0f0-4f1c-8be6-5ad2d2767f67",
            roleName: "AVS Orchestrator Role"
        },
        {
            name: "db7003cd-07a9-490c-bfa5-23e40314f8d7",
            roleName: "Service Connector Contributor"
        },
        {
            name: "2142ea27-02ad-4094-bfea-2dbac6d24934",
            roleName: "Enclave Approver Role"
        },
        {
            name: "2a740172-0fc2-4039-972c-b31864cd47d6",
            roleName: "Azure Device Update Agent"
        },
        {
            name: "a68e7c17-0ab2-4c09-9a58-125dae29748c",
            roleName: "Key Vault Purge Operator"
        },
        {
            name: "b5b0c71d-aca9-4081-aee2-9b1bb335fc1a",
            roleName: "Cognitive Services Face Contributor"
        },
        {
            name: "b9a307c4-5aa3-4b52-ba60-2b17c136cd7b",
            roleName: "Container Apps Jobs Operator"
        },
        {
            name: "77be276d-fb44-4f3b-beb5-9bf03c4cd2d3",
            roleName: "Operator Nexus Owner (Preview)"
        },
        {
            name: "4e9d0bd4-5aab-4f91-92df-9def33fe287c",
            roleName: "CloudTest Contributor Role"
        },
        {
            name: "8d6517c1-e434-405c-9f3f-e0ae65085d76",
            roleName: "Azure Automanage Contributor"
        },
        {
            name: "9fc6112f-f48e-4e27-8b09-72a5c94e4ae9",
            roleName: "Azure Bot Service Contributor Role"
        },
        {
            name: "175b81b9-6e0d-490a-85e4-0d422273c10c",
            roleName: "App Configuration Reader"
        },
        {
            name: "fe86443c-f201-4fc4-9d2a-ac61149fbda0",
            roleName: "App Configuration Contributor"
        },
        {
            name: "83f80186-3729-438c-ad2d-39e94d718838",
            roleName: "Service Fabric Managed Cluster Contributor"
        },
        {
            name: "577a9874-89fd-4f24-9dbd-b5034d0ad23a",
            roleName: "Container Registry Data Importer and Data Reader"
        },
        {
            name: "a35466a1-cfd6-450a-b35e-683fcdf30363",
            roleName: "Azure Batch Service Orchestration Role"
        },
        {
            name: "8c87871d-6201-42da-abb1-1c0c985ff71c",
            roleName: "Microsoft PowerBI Tenant Operations Role"
        },
        {
            name: "b6efc156-f0da-4e90-a50a-8c000140b017",
            roleName: "Service Fabric Cluster Contributor"
        },
        {
            name: "6e0c8711-85a0-4490-8365-8ec13c4560b4",
            roleName: "Stream Analytics Contributor"
        },
        {
            name: "1dfc38e8-6ce7-447f-807c-029c65262c5f",
            roleName: "Stream Analytics Reader"
        },
        {
            name: "80d0d6b0-f522-40a4-8886-a5a11720c375",
            roleName: "Durable Task Worker"
        },
        {
            name: "78eacb5e-e318-4560-85a9-e6a724ca60c9",
            roleName: "Portal Dashboard Writer Service Role"
        },
        {
            name: "bf2b6809-e9a5-4aea-a6e1-40a9dc8c43a7",
            roleName: "Landing Zone Account Owner"
        },
        {
            name: "2718b1f7-eb07-424e-8868-0137541392a1",
            roleName: "Landing Zone Account Reader"
        },
        {
            name: "21bffb94-04c0-4ed0-b676-68bb926e832b",
            roleName: "Microsoft.Windows365.CloudPcDelegatedMsis Writer User"
        },
        {
            name: "48e5e92e-a480-4e71-aa9c-2778f4c13781",
            roleName: "Azure Batch Job Submitter"
        },
        {
            name: "11076f67-66f6-4be0-8f6b-f0609fd05cc9",
            roleName: "Azure Batch Account Reader"
        },
        {
            name: "29fe4964-1e60-436b-bd3a-77fd4c178b3c",
            roleName: "Azure Batch Account Contributor"
        },
        {
            name: "6aaa78f1-f7de-44ca-8722-c64a23943cae",
            roleName: "Azure Batch Data Contributor"
        },
        {
            name: "0b6ca2e8-2cdc-4bd6-b896-aa3d8c21fc35",
            roleName: "Defender CSPM Storage Data Scanner"
        },
        {
            name: "5c2d7e57-b7c2-4d8a-be4f-82afa42c6e95",
            roleName: "Azure Managed Grafana Workspace Contributor"
        },
        {
            name: "19c28022-e58e-450d-a464-0b2a53034789",
            roleName: "Cognitive Services Data Contributor (Preview)"
        },
        {
            name: "d5adeb5b-107f-4aca-99ea-4e3f4fc008d5",
            roleName: "Container Apps ConnectedEnvironments Reader"
        },
        {
            name: "bd80684d-2f5f-4130-892a-0955546282de",
            roleName: "Azure Kubernetes Fleet Manager RBAC Cluster Reader"
        },
        {
            name: "1dc4cd5a-de51-4ee4-bc8e-b40e9c17e320",
            roleName: "Azure Kubernetes Fleet Manager RBAC Cluster Writer"
        },
        {
            name: "7c2e40b7-25eb-482a-82cb-78ba06cb46d5",
            roleName: "Chaos Studio Experiment Contributor"
        },
        {
            name: "29e2da8a-229c-4157-8ae8-cc72fc506b74",
            roleName: "Chaos Studio Reader"
        },
        {
            name: "1a40e87e-6645-48e0-b27a-0b115d849a20",
            roleName: "Chaos Studio Operator"
        },
        {
            name: "ff478a4e-8633-416e-91bc-ec33ce7c9516",
            roleName: "Azure Messaging Connectors Owner"
        },
        {
            name: "6f4fe6fc-f04f-4d97-8528-8bc18c848dca",
            roleName: "Container Apps ConnectedEnvironments Contributor"
        },
        {
            name: "3bc748fc-213d-45c1-8d91-9da5725539b9",
            roleName: "Container Registry Contributor and Data Access Configuration Administrator"
        },
        {
            name: "566f0da3-e2a5-4393-9089-763f8bab8fb6",
            roleName: "Health Safeguards Data User"
        },
        {
            name: "7fd69092-c9bc-4b59-9e2e-bca63317e147",
            roleName: "App Configuration Data SAS User"
        },
        {
            name: "69b07be0-09bf-439a-b9a6-e73de851bd59",
            roleName: "Container Registry Configuration Reader and Data Access Configuration Reader"
        },
        {
            name: "bf94e731-3a51-4a7c-8c54-a1ab9971dfc1",
            roleName: "Container Registry Transfer Pipeline Contributor"
        },
        {
            name: "97dfb3ce-e936-462c-9425-9cdb67e66d45",
            roleName: "Desktop Virtualization App Attach Contributor"
        },
        {
            name: "e9701b4d-e6e7-4657-91cd-360a0881d224",
            roleName: "HybridCompute Machine ListAccessDetails Action In-Built Role"
        },
        {
            name: "8ea85a25-eb16-4e29-ab4d-6f2a26c711a2",
            roleName: "App Service Environment Contributor"
        },
        {
            name: "ada52afe-776a-4b4d-a8f2-55670d3d8178",
            roleName: "Kubernetes Agent Subscription Level Operator"
        },
        {
            name: "c1410b24-3e69-4857-8f86-4d0a2e603250",
            roleName: "Quantum Workspace Data Contributor"
        },
        {
            name: "09976791-48a7-449e-bb21-39d1a415f350",
            roleName: "Communication and Email Service Owner"
        },
        {
            name: "59c05558-2358-462d-ba19-afbd7118936d",
            roleName: "Oracle.Database Autonomous Database Administrator"
        },
        {
            name: "11102f94-c441-49e6-a78b-ef80e0188abc",
            roleName: "Azure AI Safety Evaluator"
        },
        {
            name: "fb382eab-e894-4461-af04-94435c366c3f",
            roleName: "Container Registry Tasks Contributor"
        },
        {
            name: "afc680e2-a938-412d-b213-9a49efa7fb83",
            roleName: "Azure Backup Snapshot Contributor"
        },
        {
            name: "49fc33c1-886f-4b21-a00e-1d9993234734",
            roleName: "AVS on Fleet VIS Role"
        },
        {
            name: "53e48117-a530-4075-bcbe-d91913e3bdb8",
            roleName: "Edge Management Copilot User"
        },
        {
            name: "d6a5505f-6ebb-45a4-896e-ac8274cfc0ac",
            roleName: "Durable Task Data Reader"
        },
        {
            name: "1a6f9009-515c-4455-b170-143e4c9ce229",
            roleName: "Azure Stack HCI Edge Machine Contributor Role"
        },
        {
            name: "53747cdd-e97c-477a-948c-b587d0e514b2",
            roleName: "Online Experimentation Data Owner"
        },
        {
            name: "1363e94d-546f-4fe9-8434-b0eefb292d59",
            roleName: "Online Experimentation Data Reader"
        },
        {
            name: "59a618e3-3c9a-406e-9f03-1a20dd1c55f1",
            roleName: "Chaos Studio Target Contributor"
        },
        {
            name: "a8d01690-9418-4783-8ca2-9f0f1791783d",
            roleName: "Auto Actions Contributor"
        },
        {
            name: "a227fb39-f479-404b-96fd-0176f5d88ab4",
            roleName: "Azure Device Onboarding Discovery Contributor"
        },
        {
            name: "31ef6312-5b0c-4ce9-8c5d-587a91344fe7",
            roleName: "SSH PublicKeys Reader Role"
        },
        {
            name: "fc6e3395-6a8c-4527-bb4c-d0abd41e8e74",
            roleName: "SSH PublicKeys Contributor Role"
        },
        {
            name: "1b7f3653-4324-473a-9165-bc55e4d04ba8",
            roleName: "Azure Kubernetes Service Agent Pool Manager Role"
        },
        {
            name: "68ac31b4-936a-4046-a6d2-ba6f8a757bf6",
            roleName: "Agentless scanning for Serverless Scanner Service Role"
        },
        {
            name: "96ebd254-ecc7-4590-aff5-e9af3ff5f3b3",
            roleName: "Dedicated Host Contributor Role"
        },
        {
            name: "2bed379c-9fba-455b-99e4-6b911073bcf2",
            roleName: "Compute Fleet Contributor"
        },
        {
            name: "1df7cd83-1d3f-41df-95b0-53b30d963369",
            roleName: "Azure API Center Credential Access Reader"
        },
        {
            name: "7e559ce2-48d7-4b27-9128-fa1b247f1308",
            roleName: "Managed Identity Federated Identity Credential Contributor"
        },
        {
            name: "92b92042-07d9-4307-87f7-36a593fc5850",
            roleName: "Azure File Sync Administrator"
        },
        {
            name: "754c1a27-40dc-4708-8ad4-2bffdeee09e8",
            roleName: "Azure File Sync Reader"
        },
        {
            name: "88366f10-ed47-4cc0-9fab-c8a06148393e",
            roleName: "Azure Red Hat OpenShift Hosted Control Planes Cluster API Provider"
        },
        {
            name: "2c7a01fe-5518-4a42-93c2-658e45441691",
            roleName: "Online Experimentation Contributor"
        },
        {
            name: "a00ed373-f085-4b75-a950-53eacdc52ac0",
            roleName: "Oracle.Database Exascale Storage Vault Administrator"
        },
        {
            name: "58b80de8-4b34-424c-9e47-23faf0f7cfe2",
            roleName: "Online Experimentation Reader"
        },
        {
            name: "61eb6405-5f4a-440b-ad03-fe06c5c85e44",
            roleName: "Flux Configurations Contributor"
        },
        {
            name: "8d7ecc5c-f27b-43cf-883f-46409d445502",
            roleName: "Issue Contributor"
        },
        {
            name: "f094fb07-0703-4400-ad6a-e16dd8000e14",
            roleName: "Container Registry Credential Set Administrator"
        },
        {
            name: "0869d06d-e3d1-4472-8764-1bb71b2bdaf7",
            roleName: "Oracle.Database Exascale VmCluster Administrator"
        },
        {
            name: "29093635-9924-4f2c-913b-650a12949526",
            roleName: "Container Registry Credential Set Reader"
        },
        {
            name: "c357b964-0002-4b64-a50d-7a28f02edc52",
            roleName: "Container Registry Cache Rule Reader"
        },
        {
            name: "df87f177-bb12-4db1-9793-a413691eff94",
            roleName: "Container Registry Cache Rule Administrator"
        },
        {
            name: "2593f4c7-8bf4-4fff-9804-2ee069b41902",
            roleName: "Power Platform Account Contributor"
        },
        {
            name: "babe7770-cdbc-4f46-9bd7-b90b34842946",
            roleName: "Power Platform Enterprise Policy Contributor"
        },
        {
            name: "33cdeeac-0940-4f85-9317-7e2432c17289",
            roleName: "Usage Billing Contributor"
        },
        {
            name: "db9875ba-bd2b-4e98-934d-0daa549a07f0",
            roleName: "Workload Orchestration Solution External Validator"
        },
        {
            name: "eadc314b-1a2d-4efa-be10-5d325db5065e",
            roleName: "Azure AI Project Manager"
        },
        {
            name: "0618ae3d-2930-4bb7-aa00-718db34ee9f9",
            roleName: "Azure Monitor Dashboards with Grafana Contributor"
        },
        {
            name: "e47c6f54-e4a2-4754-9501-8e0985b135e1",
            roleName: "Azure AI Account Owner"
        },
        {
            name: "5c227a58-cff3-4b51-9fa3-51bdafb6ca55",
            roleName: "Secrets Store Extension Owner"
        },
        {
            name: "53ca6127-db72-4b80-b1b0-d745d6d5456d",
            roleName: "Azure AI User"
        },
        {
            name: "fc0c873f-45e9-4d0d-a7d1-585aab30c6ed",
            roleName: "Azure Red Hat OpenShift Hosted Control Planes Control Plane Operator"
        },
        {
            name: "c0ff367d-66d8-445e-917c-583feb0ef0d4",
            roleName: "Azure Red Hat OpenShift Hosted Control Planes Service Managed Identity"
        },
        {
            name: "de2b316d-7a2c-4143-b4cd-c148f6a355a1",
            roleName: "Azure Kubernetes Fleet Manager Hub Agent Role"
        },
        {
            name: "63304235-eaf4-4c15-8e93-46c483611231",
            roleName: "Workload Orchestration IT Admin"
        },
        {
            name: "f6e92014-8af2-414d-9948-9b1abf559285",
            roleName: "Arc Gateway Manager"
        },
        {
            name: "8e253927-1f29-4d89-baa2-c3a549eff423",
            roleName: "Azure Kubernetes Service Machine Manager Role"
        },
        {
            name: "adc3c795-c41e-4a89-a478-0b321783324c",
            roleName: "Microsoft.AzureStackHCI Device Pool Manager"
        },
        {
            name: "5f569efd-4da5-4123-99cd-d42fbb2a836e",
            roleName: "Microsoft.AzureStackHCI EdgeMachine Reader"
        },
        {
            name: "47be4a87-7950-4631-9daf-b664a405f074",
            roleName: "Monitoring Policy Contributor"
        },
        {
            name: "765a04e0-5de8-4bb2-9bf6-b2a30bc03e91",
            roleName: "Storage File Delegator"
        },
        {
            name: "965033a5-c8eb-4f35-b82f-fef460a3606d",
            roleName: "Storage Table Delegator"
        },
        {
            name: "7ee386e9-84f0-448e-80a6-f185f6533131",
            roleName: "Storage Queue Delegator"
        },
        {
            name: "6fbca9a8-3561-41fd-8b20-6576043c1076",
            roleName: "Scheduled Actions Contributor"
        },
        {
            name: "b6d9c0f6-d69f-472b-91b4-7a6838c6d1cb",
            roleName: "Microsoft.AzureStackHCI Device Pool Machine Manager"
        },
        {
            name: "8b9beb50-e28c-4879-8472-24c9d328085f",
            roleName: "AI Model Scanner Operator"
        },
        {
            name: "c9f76ca8-b262-4b10-8ed2-09cf0948aa35",
            roleName: "Azure Kubernetes Service Namespace User"
        },
        {
            name: "289d8817-ee69-43f1-a0af-43a45505b488",
            roleName: "Azure Kubernetes Service Namespace Contributor"
        },
        {
            name: "4c6569b6-f23e-4295-9b90-bd4cc4ff3292",
            roleName: "DevCenter Owner"
        },
        {
            name: "76153a9e-0edb-49bc-8e01-93c47e6b5180",
            roleName: "DevOps Infrastructure Contributor"
        },
        {
            name: "32c34659-0f83-4a4c-80f2-63a244f8ae0b",
            roleName: "Service Health Billing Reader"
        },
        {
            name: "1a928ab0-1fee-43cf-9266-f9d8c22a8ddb",
            roleName: "Service Health Security Reader"
        },
        {
            name: "12b8206a-0216-4469-908d-a3e2025fe085",
            roleName: "Azure Stack Edge Operations Role"
        },
        {
            name: "2016c9ed-c18d-4120-93d7-178e583efe92",
            roleName: "Grounding with Bing User"
        },
        {
            name: "69a41f41-6dce-4ea7-8a34-8e095ddba55c",
            roleName: "Azure Advisor Service Role"
        },
        {
            name: "548d7e7c-65ee-412b-ae37-2dbb419d4207",
            roleName: "Experimentation Resource Admin"
        },
        {
            name: "804db8d3-32c7-4ad4-a975-3f6f90d5f5f5",
            roleName: "FHIR Data Bulk Operator"
        },
        {
            name: "7a2b6e6c-472e-4b39-8878-a26eb63d75c6",
            roleName: "Microsoft Discovery Platform Administrator (Preview)"
        },
        {
            name: "3bb7c424-af4e-436b-bfcc-8779c8934c31",
            roleName: "Microsoft Discovery Platform Reader (Preview)"
        },
        {
            name: "01288891-85ee-45a7-b367-9db3b752fc65",
            roleName: "Microsoft Discovery Platform Contributor (Preview)"
        },
        {
            name: "5bc02df6-6cd5-43fe-ad3d-4c93cf56cc16",
            roleName: "Azure IoT Operations Administrator"
        },
        {
            name: "7b7c71ed-33fa-4ed2-a91a-e56d5da260b5",
            roleName: "Azure IoT Operations Onboarding"
        },
        {
            name: "c459b115-f629-486b-b359-35feb5568b83",
            roleName: "Connector Writer"
        },
        {
            name: "1abf4029-2200-4343-800c-e4c4c01eddbd",
            roleName: "Virtual Enclave Owner Role"
        },
        {
            name: "35ffec73-9cb8-4593-8718-40d5bc4b7f6f",
            roleName: "CosmosDB Fleet Operator Role"
        },
        {
            name: "29f61507-bdfb-4987-b629-20033be2d6c3",
            roleName: "Healthcare Apis contributor"
        },
        {
            name: "225efd4d-4ca0-42a1-ae53-5f233ba23c73",
            roleName: "Liftr Elastic Owner"
        },
        {
            name: "285ce6d6-fa11-43bd-94ef-42a9b3740bfd",
            roleName: "Policy Enrollments Contributor"
        },
        {
            name: "79732128-7761-4733-aebf-35590da9f29b",
            roleName: "Microsoft.OffAzureSpringBoot Service Owner"
        },
        {
            name: "46c70067-0f50-457f-8137-2449c90de518",
            roleName: "Nexus Network Fabric Owner"
        },
        {
            name: "374a1cc6-96cb-4946-8d8b-a41054c8ae97",
            roleName: "Nexus Identity Owner"
        }
    ];
}
