import { TelemetryReporter } from '@vscode/extension-telemetry';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Returns a {@link TelemetryReporter} with `extensionVersion` from package.json `version`.
 */

export function createTelemetryReporter(context: vscode.ExtensionContext): TelemetryReporter {

    const telemetryConfig = JSON.parse(
        fs.readFileSync(
            path.join(context.extensionPath, 'telemetry.json'),
            'utf8'
        )
    );
    const packageJson = JSON.parse(
        fs.readFileSync(
            path.join(context.extensionPath, 'package.json'),
            'utf8'
        )
    );

    telemetryConfig.commonProperties = telemetryConfig.commonProperties || {};
    telemetryConfig.commonProperties.extensionVersion = packageJson.version;

    return new TelemetryReporter(telemetryConfig.aiKey);
}
