#!/bin/bash
echo Make sure you have Java JRE installed, since openapi-generator-cli expects it. \
&& rm -rf docs/openapi/gencode/ \
&& npx openapi-generator-cli version-manager set 6.0.0 \
&& npx openapi-generator-cli generate -i docs/openapi/swagger.yaml -g typescript-fetch -o docs/openapi/gencode \
&& mkdir -p src/openapi/gencode \
&& rm -rf src/openapi/gencode/* \
&& cp -R docs/openapi/gencode/* src/openapi/gencode/ \
&& echo OpenApi fiels generated - Run git status or such to check for changes.
