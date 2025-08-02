import { ExtensionContext  } from 'vscode';
import { TelemetryReporter } from '@vscode/extension-telemetry';
import { readFileSync      } from 'fs';
import path from 'path';
 


/**
 * Returns a {@link TelemetryReporter} with `extensionVersion` from package.json `version`.
 */

export function createTelemetryReporter(context: ExtensionContext): TelemetryReporter {

    const telemetryConfig = JSON.parse(
        readFileSync(
            path.join(context.extensionPath, 'telemetry.json'),
            'utf8'
        )
    );
    const packageJson = JSON.parse(
        readFileSync(
            path.join(context.extensionPath, 'package.json'),
            'utf8'
        )
    );

    telemetryConfig.commonProperties = telemetryConfig.commonProperties || {};
    telemetryConfig.commonProperties.extensionVersion = packageJson.version;

    const telemetryReporter = new TelemetryReporter(telemetryConfig.aiKey);

    context.subscriptions.push(telemetryReporter);

    return telemetryReporter;
}
