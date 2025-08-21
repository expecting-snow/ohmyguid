create package and local install

```bash
packageJsonVersion=$(grep '"version"' package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/') && vsce package --allow-package-secrets sendgrid && code --install-extension ohmyguid-$packageJsonVersion.vsix
```
