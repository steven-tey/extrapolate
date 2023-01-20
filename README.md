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

## Features

- 3s GIF of your face as it ages through time 🧓
- Email notification when the GIF is ready (via [Replicate](https://replicate.com) webhook callback)
- Store & retrieve photos from [Cloudflare R2](https://www.cloudflare.com/lp/pg-r2/) using Workers
- Photos auto-delete after 24 hours (via [Upstash](https://upstash.com) qStash)

## One-click Deploy

You can deploy this template to Vercel with the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent&project-name=precedent&repository-name=precedent&demo-title=Precedent&demo-description=An%20opinionated%20collection%20of%20components%2C%20hooks%2C%20and%20utilities%20for%20your%20Next%20project.&demo-url=https%3A%2F%2Fextrapolate.app&demo-image=https%3A%2F%2Fextrapolate.app%2Fapi%2Fog&env=DATABASE_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent%2Fblob%2Fmain%2F.env.example)

Note that you'll need to set up a [ReplicateHQ](https://replicate.com) account and [Upstash](https://upstash.com) account to get the required environment variables.

You'll also need to create a [Cloudflare R2 instance](https://www.cloudflare.com/lp/pg-r2/) and set up a Cloudflare Worker to handle uploads & reads (will add more instructions on this soon).

## Author

- Steven Tey ([@steventey](https://twitter.com/steventey))
