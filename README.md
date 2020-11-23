# gpm-blag

Source code for personal blog hosted at georgepatrickmontgomery dot com.

Built using Gatsby 1.0. 

Content derived from previous blog: https://github.com/Adverbly/Adverbly.github.io

```
# nvm use v10

gatsby develop
```

Gatsby starter based on the Forty site template, designed by [HTML5 UP](https://html5up.net/forty)

## Deploying
On Ubuntu 20.04, you'll need to make sure some pngquant stuff works that gatsby needs before deploying(see https://github.com/tcoopman/image-webpack-loader/issues/95) 
```
sudo apt install -y build-essential libpng-dev

wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && sudo dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb

npm run deploy
```
Note: If having trouble getting markdown file images to load, try clearing the .cache dir before building
