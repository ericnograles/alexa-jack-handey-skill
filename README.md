# alexa-jack-handey-skill

![deep thoughts by jack handey](https://1.bp.blogspot.com/_bkFIPLIOGL8/SEyVjMQe39I/AAAAAAAAOTI/GS9yXLejBsE/s400/Deep+Thoughts+logo.jpg)

## Overview

This small Node.js library demonstrates a rudimentary Lambda function and supporting IntentSchemas and Utterances for an Jack Handey as an Alexa Skill.

This integrates with [Contentful](https://www.contentful.com) using the [request](https://www.npmjs.com/package/request) library to allow for dynamically managed/loaded Deep Thoughts.

## Prerequisites

1. [Node 6.10+](https://www.nodejs.org)
    * [Node Version Manager](https://github.com/creationix/nvm#install-script) highly recommended
2. [Yarn](https://www.yarnpkg.com)

## AWS Setup

1. Sign up for a free [Contentful](https://www.contentful.com) account and create a Management Token (under APIs -> Content management tokens -> Generate personal token)
1. Sign up for an AWS account
2. Install [AWS CLI](https://aws.amazon.com/cli/)
3. Create/configure an [AWS IAM user](https://console.aws.amazon.com/iam/home) with a `LambdaFullAccess` policy attached to it
4. Create a blank [Alexa Skills Kit Lambda Function](https://console.aws.amazon.com/lambda/home) called `JackHandeySkillFunction`
5. Create a local aws-cli profile called `PERSONAL:LAMBDA` and utilize the access key and secret key from the user you made in Step 3
    * `aws configure --profile PERSONAL:LAMBDA`

## Lambda Environment Variables

| **Environment Variable** | **Source** |
| ------------- | ------------- |
| `CONTENTFUL_CDN_TOKEN` | The Contentful CDN token from your account |
| `CONTENTFUL_SPACE_ID` | The Contentful Space ID from your account |
| `CONTENTFUL_BASE_URL` | The base URL for Contentful, e.g. `https://cdn.contentful.com` or `https://preview.contentful.com` |

**Note**: Contentful creates a default key called `Example Key` upon creation of your free account

## Contentful Setup

1. Install [contentful-import](https://github.com/contentful/contentful-import)
2. `cd contentful`
3. `contentful-import --space-id YOUR_SPACE_ID_HERE --management-token YOUR_MANAGEMENT_TOKEN_HERE --content-file contentful-export-jackhandey.json`

## Local Setup and Automatic Deployment

1. Clone this repo
2. `yarn install`
3. `npm run aws:deploy`
