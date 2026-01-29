// Get article title and body from Shortcuts input parameter
let inputJSON = args.shortcutParameter;

let params = inputJSON;
let title = params[0];
let body = params[1];

let filename = title || "Untitled";
let message = "Article: " + filename;

let today = new Date();
let fullFilename = filename + "-" + today.toISOString() + ".md";

// Format date as YYYY-MM-DD for Hugo
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0');
let day = String(today.getDate()).padStart(2, '0');
let publishDate = `${year}-${month}-${day}`;

// Header of article with dynamic title and date
// Needed for the Hugo parser to output a properly formatted article
let header = `---
title: "${title}"
date: ${publishDate}
author: "Dee"
tags: []
description: ""
---

`;

// The body of the article
let inputText = body || "No content provided.";

// Combine header and body, then encode to base64
let fullContent = header + inputText;
let base64Content = Data.fromString(fullContent).toBase64String();

// GitHub API request
let url = "https://api.github.com/repos/pelauimagineering/write/contents/content/articles/" + fullFilename;

let req = new Request(url);
req.method = "PUT";
req.headers = {
  "Authorization": "Bearer " + Keychain.get("GITHUB_TOKEN"),
  "Accept": "application/json",
  "User-Agent": "Scriptable-iOS"
};
req.body = JSON.stringify({
  "message": message,
  "content": base64Content
});

let response = await req.loadJSON();
Script.setShortcutOutput(response);
Script.complete();
