'use strict';

// All defaults are stored in the Heroku app Config Vars settings

const WIT_TOKEN = process.env.WIT_TOKEN || 'NKBOL22YOSIBNHVYYDQ5DM5SD5DWM76R';
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}

var FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || 'EAASUuZC5hhzwBAM9HUsWa7ECC2a085ZAW03ClohQ8Kaw0J9MxGGAYr0QOOZAFqioJQjheHIYM0V08RKTXJZAd9AxbZB2WXYa6eWF3CvqJOZB1ocJI4DqR85SHsoHYwQtGPCCpQVDMVGAbIl2V6OCdxoVUrxTWoloNtZCO6erHKxJwZDZD';
if (!FB_PAGE_ACCESS_TOKEN) {
	throw new Error('Missing FB_PAGE_ACCESS_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'documentary_server_101_verify_token';

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_ACCESS_TOKEN: FB_PAGE_ACCESS_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}
