# Header parser

live site: https://jeb-urlshortner.herokuapp.com/

## URL Shortener Microservice

Pass a URL as a parameter and user will receive a shortened URL in the JSON response.

When user visits that shortened URL, it will redirect them to the original link.

## Example creation usage:

https://jeb-urlshortner.herokuapp.com/new/https://www.google.com

https://jeb-urlshortner.herokuapp.com/new/http://foo.com:80

## Example creation output

{
  "original_url": "http://foo.com:80",
  "short_url": "https://jeb-urlshortner.herokuapp.com/8170",
  "id":8170
}

## Usage:

https://jeb-urlshortner.herokuapp.com/8170

Will redirect to:
http://foo.com:80

TODO
- [ ] change shortner to shortener, url
- [ ] text field instead of passing url by url
- [ ] make code more modular
