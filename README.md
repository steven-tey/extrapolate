<a href="https://extrapolate.app">
  <img alt="Extrapolate – See how well you age with AI" src="https://extrapolate.app/api/og">
  <h1 align="center">Extrapolate</h1>
</a>

<p align="center">
  See how well you age with AI
</p>

<p align="center">
  <a href="https://twitter.com/steventey">
    <img src="https://img.shields.io/twitter/follow/steventey?style=flat&label=steventey&logo=twitter&color=0bf&logoColor=fff" alt="Steven Tey Twitter follower count" />
  </a>
  <a href="https://github.com/steven-tey/extrapolate">
    <img src="https://img.shields.io/github/stars/steven-tey/extrapolate?label=steven-tey%2Fextrapolate" alt="Extrapolate repo star count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#one-click-deploy"><strong>One-click Deploy</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## Introduction

Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence. 100% free and privacy friendly.


https://user-images.githubusercontent.com/28986134/213781048-d215894d-2286-4176-a200-f745b255ecbe.mp4


## Features

- 3s GIF of your face as it ages through time 🧓
- Email notification when the GIF is ready (via [Replicate](https://replicate.com) webhook callback)
- Store & retrieve photos from [Cloudflare R2](https://www.cloudflare.com/lp/pg-r2/) using Workers
- Photos auto-delete after 24 hours (via [Upstash](https://upstash.com) qStash)

## One-click Deploy

You can deploy this template to Vercel with the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Extrapolate%20%E2%80%93%C2%A0See%20how%20well%20you%20age%20with%20AI&demo-description=Age%20transformation%20AI%20app%20powered%20by%20Next.js%2C%20Replicate%2C%20Upstash%2C%20and%20Cloudflare%20R2%20%2B%20Workers.&demo-url=https%3A%2F%2Fextrapolate.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4B2RUQ7DTvPgpf3Ra9jSC2%2Fda2571b055081a670ac9649d3ac0ac7a%2FCleanShot_2023-01-20_at_12.04.08.png&project-name=Extrapolate%20%E2%80%93%C2%A0See%20how%20well%20you%20age%20with%20AI&repository-name=extrapolate&repository-url=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fextrapolate&from=templates&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17&env=REPLICATE_API_KEY%2CREPLICATE_WEBHOOK_TOKEN%2CCLOUDFLARE_WORKER_SECRET%2CPOSTMARK_TOKEN&envDescription=How%20to%20get%20these%20env%20variables%3A%20&envLink=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fextrapolate%2Fblob%2Fmain%2F.env.example)

Note that you'll need to set up a [ReplicateHQ](https://replicate.com) account and [Upstash](https://upstash.com) account to get the required environment variables.

You'll also need to create a [Cloudflare R2 instance](https://www.cloudflare.com/lp/pg-r2/) and set up a Cloudflare Worker to handle uploads & reads (will add more instructions on this soon).

## Author

- Steven Tey ([@steventey](https://twitter.com/steventey))
